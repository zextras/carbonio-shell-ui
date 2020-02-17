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
import { forEach, reduce, find, pick, flatMap } from 'lodash';

const _sharedBC = new BroadcastChannel('com_zextras_zapp_shell_sw');
// _sharedBC.addEventListener('message', function onMessageOnBC(e) {
//   console.log('Received', e.data);
// });

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
      syncReq.Body.SyncRequest.token = syncData.token;
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

function _handleBatchResponses(responses, operations, db) {
  const [res, ...rest] = responses;
  const op = find(operations, op => `${op.id}` === res.requestId);
  db.delete('sync-operations', op.id)
    .then(() => {
        _sharedBC.postMessage({
          action: 'sync:operation:completed',
          data: {
            to: op.app.package,
            data: {
              operation: op.operation,
              result: {
                Body: {
                  [`${op.operation.request.command}Response`]: res
                }
              }
            }
          }
        });
        if (rest.length > 0) {
          _handleBatchResponses(rest, operations, db);
        }
      }
    );
}

function _handleBatchErrors(faults, operations) {
  forEach(
    faults,
    fault => {
      const op = find(operations, op => `${op.id}` === fault.requestId);
      _sharedBC.postMessage({
        action: 'sync:operation:error',
        data: {
          to: op.app.package,
          data: {
            operation: op.operation,
            error: fault
          }
        }
      });
    }
  )
}

async function _doExecuteSyncOperations() {
  const db = await _idbSrvc.openDb();
  const operations = await db.getAll('sync-operations');
  const opTypes = [];
  const requests = reduce(
    operations,
    (reqs, op) => {
      switch (op.operation.opType) {
        case 'soap': {
          if (reqs[`${op.operation.request.command}Request`]) {
            reqs[`${op.operation.request.command}Request`].push(
              {
                ...op.operation.request.data,
                _jsns: op.operation.request.urn,
                requestId: op.id
              }
            );
          }
          else {
            opTypes.push(`${op.operation.request.command}Response`);
            reqs[`${op.operation.request.command}Request`] = [
              {
                ...op.operation.request.data,
                _jsns: op.operation.request.urn,
                requestId: op.id
              }
            ]
          }
          return reqs;
        }
        default:
          throw new Error(`Operation type '${op.operation.opType}' cannot be handled.`);
      }
    },
    {}
  );
  const batch = {
    Body: {
      BatchRequest: {
        _jsns: 'urn:zimbra',
        onerror: 'continue',
        ...requests
      }
    }
  };
  return fetch(
    '/service/soap/BatchRequest',
    {
      method: 'POST',
      body: JSON.stringify(batch)
    }
  )
    .then((r) => r.json())
    .then((responses) => {
      _handleBatchResponses(
        flatMap(pick(responses.Body.BatchResponse, opTypes)),
        operations,
        db
      );
      if (responses.Body.BatchResponse.Fault) {
        _handleBatchErrors(responses.Body.BatchResponse.Fault, operations, db);
      }
    })
    .catch(err => new Error(err))
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
