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
/* eslint-disable @typescript-eslint/camelcase */

import IdbService from '../idb/IdbService';
import * as Lodash from 'lodash';
import FiberChannelService from '../fc/FiberChannelService';
import * as RxJS from 'rxjs';
import * as RxJSOperators from 'rxjs/operators';

const loFilter = Lodash.filter;
const filter = RxJSOperators.filter;

self.__ZAPP_SHARED_LIBRARIES__ = {
	'lodash': Lodash,
	'rxjs': RxJS,
	'rxjs/operators': RxJSOperators,
};

importScripts(
	'shell-sw-extension.js',
	'shell-sw-sync.js'
);

self._zapp_idbSrvc = new IdbService();
self._zapp_fcSrvc = new FiberChannelService();

self._zapp_fcSrvc.getInternalFC()
	.pipe(filter(({ event }) => event === 'sync:do-soap-sync' ))
	.subscribe((e) => self._zapp_doSOAPSync());

self._zapp_fcSrvc.getInternalFC()
	.pipe(filter(({ event }) => event === 'sync:consume-operation-queue' ))
	.subscribe((e) => self._zapp_doExecuteSyncOperations());

self._zapp_fcSrvc.getInternalFC()
	.pipe(filter(({ event }) => event === 'app:all-loaded' ))
	.subscribe((e) => self._zapp_loadExtensions(loFilter(e.data, (e) => !!e.serviceworkerExtension )));

self.addEventListener('install', function(event) {
	console.log(`Installing Service Worker for ${PACKAGE_NAME}`);
});

// self.addEventListener('message', function(event) {});

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
