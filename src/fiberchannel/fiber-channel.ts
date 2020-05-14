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

import { Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { omit } from 'lodash';
import {
	FC,
	FCEvent,
	FCPartialEvent, FCPromisedEvent,
	FCSink,
	IFCSink,
	IFiberChannelFactory
} from './fiber-channel-types';
import { AppPkgDescription } from '../db/account';

type WithPromiseId = { _promiseIdRequest?: string; _promiseIdResponse?: string };

export default class FiberChannelFactory implements IFiberChannelFactory {

	private _channel = new Subject<FCEvent<any> & WithPromiseId | FCPromisedEvent<any, any> & WithPromiseId>();
	private _id = 0;

	public getAppFiberChannelSink({ name, version }: AppPkgDescription): FCSink {
		const subject = new Subject<FCPartialEvent<any> | FCPartialEvent<any> & WithPromiseId >();
		subject.subscribe((ev) => {
			this._channel.next({ ...ev, from: name, version: version });
		});
		return (ev: FCPartialEvent<any>): void | Promise<any> => {
			if (ev.asPromise) {
				return new Promise((resolve) => {
					const id = `${++this._id}`;
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
			subject.next({ ...ev, data: ev.data || {} });
		};
	}

	public getAppFiberChannel({ name, version }: AppPkgDescription): FC {
		const subject = new Subject<FCEvent<any> | FCPromisedEvent<any, any>>();
		this._channel.pipe(
			filter(({ to }) => !to || to === name)
		).subscribe((ev) => {
			if (ev.asPromise) {
				subject.next({
					...omit(
						ev,
						['_promiseIdResponse',  '_promiseIdRequest']
					),
					sendResponse: (data: any) => {
						this._channel.next({
							to: ev.from,
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
		const subject = new Subject<FCEvent<any> | FCEvent<any> & WithPromiseId >();
		subject.subscribe((ev) => {
			this._channel.next({ ...ev });
		});
		return (ev: FCEvent<any>): void | Promise<any> => {
			if (ev.asPromise) {
				return new Promise((resolve) => {
					const id = `${++this._id}`;
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
			subject.next({ ...ev });
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
							to: ev.from,
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

}
