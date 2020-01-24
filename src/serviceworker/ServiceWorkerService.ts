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

import { IServiceWorkerService } from './IServiceWorkerService';
import { ISyncOpCompletedEv, ISyncOpErrorEv } from '../sync/ISyncService';
import { IFiberChannelService } from '../fc/IFiberChannelService';

export class ServiceWorkerService implements IServiceWorkerService {

	private _registration?: ServiceWorkerRegistration;

	constructor(
		private _fcSrvc: IFiberChannelService,
	) {
		const sink = _fcSrvc.getInternalFCSink();

		const _sharedBC = new BroadcastChannel('com_zextras_zapp_shell_sw');
		_sharedBC.addEventListener('message', (e) => {
			if (!e.data || !e.data.action) return;
			const opData = e.data.data;
			switch(e.data.action) {
				case 'sync:operation:completed':
					sink<ISyncOpCompletedEv<unknown>>({
							event: 'sync:operation:completed',
							to: opData.to,
							data: opData.data
						});
					break;
				case 'sync:operation:error':
					sink<ISyncOpErrorEv>({
							event: 'sync:operation:error',
							to: opData.to,
							data: opData.data
					});
					break;
			}
		});

		this.registerServiceWorker(
			'shell-sw.js',
			'/'
		).then((registration: ServiceWorkerRegistration) => {
			this._registration = registration;
			navigator.serviceWorker.addEventListener('message', function handler(event) {
				console.log('Event from ServiceWorker', event.data);
			});
		})
			.catch((registrationError: Error) => {
				this._registration = undefined;
			});
	}

	public registerServiceWorker(path: string, appScope: string): Promise<ServiceWorkerRegistration> {
		return new Promise((resolve, reject) => {
			if ('serviceWorker' in navigator) {
				navigator.serviceWorker
					.register(path, { scope: appScope })
					.then((registration: ServiceWorkerRegistration) => {
						console.debug('SW registered: ', registration);
						resolve(registration);
					})
					.catch((registrationError: Error) => {
						console.debug('SW registration failed: ', registrationError);
						reject(registrationError);
					});
			} else {
				console.debug('SW registration failed: ', new Error('ServiceWorker not supported'));
				reject(new Error('ServiceWorker not supported'));
			}
		});
	}

	public sendMessage(command: string, data: any): Promise<void> {
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
			this._registration.active.postMessage({ command, data }, [messageChannel.port2]);
		});
	}

}
