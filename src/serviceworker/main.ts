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
/* eslint-disable @typescript-eslint/camelcase,@typescript-eslint/no-misused-promises */

import * as Lodash from 'lodash';
import * as RxJS from 'rxjs';
import * as RxJSOperators from 'rxjs/operators';

import IdbService from '../idb/IdbService';
import FiberChannelService from '../fc/FiberChannelService';
import ShellNetworkService from '../network/ShellNetworkService';
import { loadExtensions } from './extensions';
import { filter } from 'rxjs/operators';
import { doExecuteSyncOperations, doSOAPSync } from './sync';

self.addEventListener('install', function(event: ExtendableEvent) {
	console.log(`Installing Service Worker for ${PACKAGE_NAME}`);

	self.__ZAPP_SHARED_LIBRARIES__ = {
		'lodash': Lodash,
		'rxjs': RxJS,
		'rxjs/operators': RxJSOperators,
	};
	self.__ZAPP_SHARED_LIBRARIES_SHIMS__ = {};

	const networkSrvc = new ShellNetworkService();
	const fcSrvc = new FiberChannelService();
	const idbSrvc = new IdbService();

	const fc = fcSrvc.getInternalFC();

	fc
		.pipe(filter(({ event }) => event === 'sync:do-soap-sync' ))
		.subscribe((e) => doSOAPSync(idbSrvc, fcSrvc).then());

	fc
		.pipe(filter(({ event }) => event === 'sync:consume-operation-queue' ))
		.subscribe((e) => doExecuteSyncOperations(idbSrvc, fcSrvc).then());

	event.waitUntil(
		networkSrvc.getApps().then(
			(appList) => loadExtensions(
				Lodash.filter(appList, (a) => typeof a.serviceworkerExtension !== 'undefined'),
				fcSrvc,
				idbSrvc
			)
		)
	);
});

// self.addEventListener('message', function(event) {
// 	switch() {
// 		case '':
// 			event.waitUntil();
// 			break;
// 	}
// });

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
