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

import IdbService from '../idb/IdbService';
import _ from 'lodash';

self.__ZAPP_SHARED_LIBRARIES__ = {
	'lodash': _
};

importScripts(
	'shell-sw-extension.js',
	'shell-sw-sync.js'
);

self._idbSrvc = new IdbService();

self._sharedBC = new BroadcastChannel(`${PACKAGE_NAME}_sw`);
// _sharedBC.addEventListener('message', function onMessageOnBC(e) {
//   console.log('Received', e.data);
// });

self.addEventListener('install', function(event) {
	console.log(`Installing Service Worker for ${PACKAGE_NAME}`);
});

self.addEventListener('message', function(event) {
	if (!event || !event.data || !event.data.command) return;
	console.log(`Service worker command: ${event.data.command}`);
	switch(event.data.command) {
		case 'load_extensions':
			self._loadExtensions(event.data.data);
			break;
		case 'unload_extensions':
			self._unloadExtensions();
			break;
		case 'soap_sync':
			self._doSOAPSync();
			break;
		case 'execute_sync_operations':
			self._doExecuteSyncOperations();
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
