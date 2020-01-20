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
import { schemaVersion } from '../idb/IShellIdb';

precacheAndRoute(self.__WB_MANIFEST);

console.log(`Hello from service-worker.js installing schema: v${schemaVersion}`);

self.addEventListener('install', function(event) {
    console.log('Installing service-worker.js');
});

self.addEventListener('message', function(event) {
    console.log('Message for service-worker.js');
});

self.addEventListener('sync', function(event) {
  console.log('Sync for service-worker.js');
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
    })
    .catch(function(err) {
      console.error(err);
    });
});

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
