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

import { precacheAndRoute } from 'workbox-precaching/precacheAndRoute';
import IdbService from '../idb/IdbService';

precacheAndRoute(self.__WB_MANIFEST);

const idbService = new IdbService();

console.log(`Hello from service-worker.js`);

function _performSync(token?: number): Promise<void> {
  return new Promise((resolve, reject) => {
    fetch(
      '/service/soap/SyncRequest',
      {
        method: 'POST',
        body: JSON.stringify({
          Body: {
            _jsns: 'urn:zimbraMail',
            SyncRequest: {
              typed: true
            }
          }
        })
      }
    )
      .then(function(response) {
        return response.json();
      })
      .then(function(response) {
        const resp = response.Body.SyncResponse;
        console.log(resp);
        // md
        // token
        // s
        // folder
        // TODO: Handle the sync data of the folders
        resolve();
      })
      .catch(function(err) {
        console.error(err);
        reject(err);
      });
  });
}

function _syncAll() {
  idbService.openDb()
    .then((db) => {
      db.getAll('sync', null, 1).then((syncDatas) => {
        console.log('Sync data: ', syncDatas);
        if (syncDatas.length < 1) {
          // Is the first sync
          _performSync();
        }
        else if (syncDatas.length === 1) {
          // There is something to sync
          _performSync(syncDatas[0].token);
        }
        else {
          // Data must be nuked! Perhaps, it should not happen as the query is limited.
        }
      });
    });
}

self.addEventListener('install', function(event) {
    console.log('Installing service-worker.js');
});

self.addEventListener('message', function(event) {
    if (!event || !event.data || !event.data.command) return;
    console.log(`Service worker command: ${event.data.command}`);
    switch(event.data.command) {
      case 'sync': {
        _syncAll();
      }
    }
    return;
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
