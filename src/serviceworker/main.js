/*
 * *** BEGIN LICENSE BLOCK *****
 * Copyright (C) 2011-2019 ZeXtras
 *
 * The contents of this file are subject to the ZeXtras EULA;
 * you may not use this file except in compliance with the EULA.
 * You may obtain a copy of the EULA at
 * http://www.zextras.com/zextras-eula.html
 * *** END LICENSE BLOCK *****
 */
/* eslint-env serviceworker */

// import { precacheAndRoute } from 'workbox-precaching/precacheAndRoute';
// precacheAndRoute(self.__WB_MANIFEST);

import IdbService from '../idb/IdbService';
import { map } from 'lodash';

const _sharedBC = new BroadcastChannel('com_zextras_zapp_shell_sw');
_sharedBC.addEventListener('message', function onMessageOnBC(e) {
  console.log('Received', e.data);
});

const _idbSrvc = new IdbService();

async function _storeSOAPSyncToken(accountId, syncResponse) {
  const syncResp = syncResponse.Body.SyncResponse;
  const db = await _idbSrvc.openDb();
  await db.put(
    'sync',
    {
      accountId: accountId,
      token: typeof syncResp.token === 'string' ? parseInt(syncResp.token, 10) : syncResp.token,
      modifyDate: syncResp.md
    }
  );
}

function _propagateSOAPNotifications(response) {
  const data = { ...response.Body.SyncResponse };
  delete data.token;
  _sharedBC.postMessage({
    action: 'SOAP:notification:handle',
    data
  });
}

function _executeSOAPSync(syncData) {
  return new Promise((resolve, reject) => {
    const syncReq = {
      Body: {
        SyncRequest: {
          _jsns: 'urn:zimbraMail',
          typed: true
        }
      }
    };
    if (syncData) {
      syncReq.token = syncData.token;
      fetch(
        '/service/soap/SyncRequest',
        {
          method: 'POST',
          body: JSON.stringify(syncReq)
        }
      )
        .then(response => response.json())
        .then((syncResponse) => Promise.all([
          _storeSOAPSyncToken(syncData.accountId, syncResponse),
          _propagateSOAPNotifications(syncResponse)
        ]))
        .then(() => resolve())
        .catch((err) => reject(err));
    }
    else {
      const getInfoReq = {
        Body: {
          GetInfoRequest: {
            _jsns: 'urn:zimbraAccount',
          }
        }
      };
      Promise.all([
        fetch(
          '/service/soap/GetInfoRequest',
          {
            method: 'POST',
            body: JSON.stringify(getInfoReq)
          }
        )
          .then(response => response.json()),
        fetch(
          '/service/soap/SyncRequest',
          {
            method: 'POST',
            body: JSON.stringify(syncReq)
          }
        )
          .then(response => response.json())
      ])
        .then(([getInfoResponse, syncResponse]) => Promise.all([
          _storeSOAPSyncToken(getInfoResponse.Body.GetInfoResponse.id, syncResponse),
          _propagateSOAPNotifications(syncResponse)
        ]))
        .then(() => resolve())
        .catch((err) => reject(err));
    }

  });
}

async function _doSOAPSync() {
  const db = await _idbSrvc.openDb();
  const syncDatas = await db.getAll('sync', null, 1);
  if (syncDatas.length < 1) {
    // Is the first sync
    return _executeSOAPSync();
  }
  else if (syncDatas.length === 1) {
    // There is something to sync
    return _executeSOAPSync(syncDatas[0]);
  }
  else {
    // Data must be nuked! Perhaps, it should not happen as the query is limited.
    return db.clear('sync');
  }
}

function _executeSoapOperation(op) {
  return new Promise((resolve, reject) => {
    const soapReq = op.request;
    fetch(
      `/service/soap/${soapReq.command}Request`,
      {
        method: 'POST',
        body: JSON.stringify({
          Body: {
            [`${soapReq.command}Request`]: {
              ...soapReq.data,
              _jsns: soapReq.urn
            }
          }
        })
      }
    )
      .then(response => response.json())
      .then(response => resolve(response))
      .catch(err => reject(err))
  });
}

async function _tryToConsumeOperation(opKey) {
  const db = await _idbSrvc.openDb();
  const op = await db.get('sync-operations', opKey);
  if (op) {
    switch (op.operation.opType) {
      case 'soap': {
        try {
          const result = await _executeSoapOperation(op.operation);
          await db.delete('sync-operations', opKey);
          _sharedBC.postMessage({
            action: 'sync:operation:completed',
            data: {
              to: op.app.package,
              data: {
                operation: op.operation,
                result: result
              }
            }
          });
        } catch (e) {
          _sharedBC.postMessage({
            action: 'sync:operation:error',
            data: {
              to: op.app.package,
              data: {
                operation: op.operation,
                error: e
              }
            }
          });
        }
        break;
      }
      default:
        throw new Error(`Operation type '${ op.operation.opType }' cannot be handled.`);
    }
  }
}

async function _doExecuteSyncOperations() {
  const db = await _idbSrvc.openDb();
  const operationsKeys = await db.getAllKeys('sync-operations');
  await Promise.all(
    map(
      operationsKeys,
      (opKey) => _tryToConsumeOperation(opKey)
    )
  );
}

self.addEventListener('install', function(event) {
    console.log('Installing shell-sw.js');
});

self.addEventListener('message', function(event) {
    if (!event || !event.data || !event.data.command) return;
    console.log(`Service worker command: ${event.data.command}`);
    switch(event.data.command) {
      case 'soap_sync':
        _doSOAPSync();
        break;
      case 'execute_sync_operations':
        _doExecuteSyncOperations();
        break;
    }
});

// Send a message to all connected clients.
// self.clients.matchAll().then(all => all.map(client => client.postMessage(data)));

/*
self.addEventListener('fetch', function (event) {
    console.debug('SW', event);
    event.respondWith(
        caches.match(event.request)
            .then(
                function(response) {
                    if (response) {
                        return response;
                    }
                    return fetch(event.request);
                }
            )
    );
});
*/
