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

import { ReplaySubject, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { omit } from 'lodash';
import { lt } from 'semver';
import {
	FC,
	FCEvent,
	FCPartialEvent,
	FCPromisedEvent,
	FCSink,
	IFCSink,
	IFiberChannelFactory
} from './fiber-channel-types';
import { AppPkgDescription } from '../db/account';
import { LoadedAppsCache } from '../app/app-loader';

type WithPromiseId = { _promiseIdRequest?: string; _promiseIdResponse?: string };

export default class FiberChannelFactory implements IFiberChannelFactory {

	private _channel = new Subject<FCEvent<any> & WithPromiseId | FCPromisedEvent<any, any> & WithPromiseId>();
	private _channelCache = new ReplaySubject<FCEvent<any> & WithPromiseId | FCPromisedEvent<any, any> & WithPromiseId>();
	private _id = 0;
	private _appsLoaded = false;
	private _appsCache: LoadedAppsCache = {};

	constructor() {
		this.getShellFiberChannel()
			.pipe(filter(({ to }) => to ? to.app === PACKAGE_NAME : false))
			.pipe(filter(({ event }) => event === 'all-apps-loaded'))
			.subscribe(({ data }) => this._onAllAppsLoaded(data));
	}

	public getAppFiberChannelSink({ name, version }: AppPkgDescription): FCSink {
		const subject = new Subject<FCEvent<any> | FCEvent<any> & WithPromiseId>();
		subject.subscribe((ev) => this._cacheOrEmitEvent(ev));
		return (ev: FCPartialEvent<any>): void | Promise<any> => {
			const event = { ...ev, from: name, version: version, data: ev.data || {} };
			if (ev.asPromise) {
				return this._getPromiseForRequest(subject, event);
			}
			else {
				this._checkDestinationVersion(event);
				subject.next(event);
			}
		};
	}

	public getAppFiberChannel({ name, version }: AppPkgDescription): FC {
		const subject = new Subject<FCEvent<any> | FCPromisedEvent<any, any>>();
		this._channel.pipe(
			filter(({ to }) => !to || to.app === name)
		).subscribe((ev) => {
			if (ev.asPromise) {
				subject.next({
					...omit(
						ev,
						['_promiseIdResponse',  '_promiseIdRequest']
					),
					sendResponse: (data: any) => {
						this._channel.next({
							to: {
								app: ev.from,
								version: ev.version
							},
							from: name,
							version: version,
							event: `${ev.event}-response`,
							_promiseIdResponse: ev._promiseIdRequest,
							data
						});
					}
				});
			}
			else {
				subject.next(ev);
			}
		});
		return subject.asObservable();
	}

	public getInternalFiberChannelSink(): IFCSink {
		const subject = new Subject<FCEvent<any> | FCEvent<any> & WithPromiseId>();
		subject.subscribe((ev) => this._cacheOrEmitEvent(ev));
		return (ev: FCEvent<any>): void | Promise<any> => {
			if (ev.asPromise) {
				return this._getPromiseForRequest(subject, ev);
			}
			else {
				this._checkDestinationVersion(ev);
				subject.next(ev);
			}
		};
	}

	public getInternalFiberChannel({ name, version }: AppPkgDescription): FC {
		const subject = new Subject<FCEvent<any> | FCPromisedEvent<any, any>>();
		this._channel.subscribe((ev) => {
			if (ev.asPromise) {
				subject.next({
					...omit(
						ev,
						['_promiseIdResponse',  '_promiseIdRequest']
					),
					sendResponse: (data: any) => {
						this._channel.next({
							to: {
								app: ev.from,
								version: ev.version
							},
							from: name,
							version: version,
							event: `${ev.event}-response`,
							_promiseIdResponse: ev._promiseIdRequest,
							data
						});
					}
				});
			}
			else {
				subject.next(ev);
			}
		});
		return subject.asObservable();
	}

	private _getPromiseForRequest(subject: Subject<FCEvent<any> | FCEvent<any> & WithPromiseId>, ev: FCEvent<any> | FCEvent<any> & WithPromiseId): Promise<any> {
		return new Promise((resolve, reject) => {
			const id = `${++this._id}`;
			try {
				this._checkDestinationVersion(ev);
			} catch (err) {
				reject(err);
				return;
			}
			this._channel.pipe(
				filter((ev) => ev._promiseIdResponse ? ev._promiseIdResponse === id : false)
			)
				.subscribe(({ data }) => resolve(data));
			subject.next({
				...ev,
				_promiseIdRequest: id,
			});
		});
	}

	public getShellFiberChannelSink(): FCSink {
		return this.getAppFiberChannelSink({
			priority: 0,
			package: PACKAGE_NAME,
			name: PACKAGE_NAME,
			description: '',
			version: PACKAGE_VERSION,
			resourceUrl: '',
			entryPoint : ''
		});
	}

	public getShellFiberChannel(): FC {
		return this.getAppFiberChannel({
			priority: 0,
			package: PACKAGE_NAME,
			name: PACKAGE_NAME,
			description: '',
			version: PACKAGE_VERSION,
			resourceUrl: '',
			entryPoint : ''
		});
	}

	public _onAllAppsLoaded(cache: LoadedAppsCache): void {
		this._appsLoaded = true;
		this._appsCache = cache;
		this._channelCache.subscribe((ev) => this._channel.next(ev));
		this._channelCache.complete();
	}

	private _cacheOrEmitEvent(ev: FCEvent<any> | FCPromisedEvent<any, any>): void {
		if (this._appsLoaded || (ev.to && ev.to.app === PACKAGE_NAME)) {
				this._channel.next(ev);
		}
		else {
			this._channelCache.next(ev);
		}
	}

	private _checkDestinationVersion(ev: FCEvent<any> | FCPromisedEvent<any, any>): void {
		if (ev.to && !ev.to.version) {
			throw new Error('API Version not specified.');
		}
		if(ev.to && this._appsCache[ev.to.app] && lt(this._appsCache[ev.to.app].pkg.version, ev.to.version)) {
			throw new Error('API Version cannot be satisfied.');
		}
	}
}
