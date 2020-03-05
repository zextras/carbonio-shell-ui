/*
 * *** BEGIN LICENSE BLOCK *****
 * Copyright (C) 2011-2020 ZeXtras
 *
 * The contents of this file are subject to the ZeXtras EULA;
 * you may not use this file except in compliance with the EULA.
 * You may obtain a copy of the EULA at
 * http://www.zextras.com/zextras-eula.html
 * *** END LICENSE BLOCK *****
 */

import { IInternalFiberChannelService } from '../fc/IFiberChannelService';
import { filter, take } from 'rxjs/operators';
import { interval } from 'rxjs';
import { IFCEvent } from '../fc/IFiberChannel';

export class ServiceWorkerService {

	private _registration?: ServiceWorkerRegistration;

	constructor(
		private _fcSrvc: IInternalFiberChannelService,
	) {
		const fc = _fcSrvc.getInternalFC();

		fc
			.pipe(
				filter((e) => e.event === 'shell:serviceworker:activate')
			)
			.pipe(
				take(1)
			)
			.subscribe(
				(e) => {
					// Sync after the start
					this._sendEvent({ event: 'sync:do-soap-sync', from: PACKAGE_NAME, version: PACKAGE_VERSION, to: PACKAGE_NAME, data: {} }).then();
					// Perform a sync every 30s
					interval(30000)
						.subscribe(
						(_) => this._sendEvent({ event: 'sync:do-soap-sync', from: PACKAGE_NAME, version: PACKAGE_VERSION, to: PACKAGE_NAME, data: {} }).then()
						);
				}
			);
		
		fc
			.pipe(
				filter((e) => e.event === 'shell:serviceworker:activate')
			)
			.pipe(
				take(1)
			)
			.subscribe(
				(e) => {
					fc.subscribe((ev) => this._sendEvent(ev));
				}
			);

		fc
			.pipe(
				filter((e) => e.event === 'session:login:logged-in')
			)
			.subscribe(
				(e) => {
					this._registerServiceWorker(
						'shell-sw.js',
						'/'
					).then();
				}
			);
	}

	private _registerServiceWorker(path: string, appScope: string): Promise<ServiceWorkerRegistration> {
		return new Promise((resolve, reject) => {
			const sink = this._fcSrvc.getInternalFCSink();

			if ('serviceWorker' in navigator) {
				navigator.serviceWorker
					.register(path, { scope: appScope })
					.then((registration: ServiceWorkerRegistration) => {
						this._registration = registration;
						navigator.serviceWorker.addEventListener('message', (event) => {
							// console.log('Event from ServiceWorker', event);
							this._fcSrvc.getInsecureFCSink(false)(event.data);
						});
						sink('shell:serviceworker:registered');
						if (this._registration.active) sink('shell:serviceworker:activate');
						resolve(registration);
					})
					.catch((registrationError: Error) => {
						this._registration = undefined;
						console.error('SW registration failed: ', registrationError);
						sink('shell:serviceworker:registration-failed', { error: registrationError });
						reject(registrationError);
					});
			} else {
				console.error('SW registration failed: ', new Error('ServiceWorker not supported'));
				sink('shell:serviceworker:registration-failed', { error: new Error('ServiceWorker not supported') });
				reject(new Error('ServiceWorker not supported'));
			}
		});
	}

	private _sendEvent(event: IFCEvent<any>): Promise<void> {
		return new Promise((resolve, reject) => {
			if (!('serviceWorker' in navigator) || !this._registration || !this._registration.active) {
				reject(new Error('ServiceWorker not found'));
				return;
			}
			const messageChannel = new MessageChannel();
			messageChannel.port1.onmessage = function(event) {
				if (event.data.error) {
					reject(event.data.error);
				} else {
					resolve(event.data);
				}
			};

			// This sends the message data as well as transferring messageChannel.port2 to the service worker.
			// The service worker can then use the transferred port to reply via postMessage(), which
			// will in turn trigger the onmessage handler on messageChannel.port1.
			// See https://html.spec.whatwg.org/multipage/workers.html#dom-worker-postmessage
			this._registration.active.postMessage(event, [ messageChannel.port2 ]);
		});
	}

}
