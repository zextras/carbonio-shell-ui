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
import {
	FC,
	FCEvent,
	FCPartialEvent, FCPromisedEvent,
	FCSink,
	IFCSink,
	IFiberChannelFactory
} from './fiber-channel-types';
import { AppPkgDescription } from '../db/account';

export default class FiberChannelFactory implements IFiberChannelFactory {

	private _channel = new Subject<FCEvent<any> | FCPromisedEvent<any, any>>();

	public getAppFiberChannelSink({ name, version }: AppPkgDescription): FCSink {
		const subject = new Subject<FCPartialEvent<any> | FCPartialEvent<any> & { sendResponse: (data: any) => void }>();
		subject.subscribe((ev) => {
			this._channel.next({ ...ev, from: name, version: version });
		});
		return (ev: FCPartialEvent<any>): void | Promise<any> => {
			if (ev.asPromise) {
				return new Promise((resolve) => {
					subject.next({
						...ev,
						sendResponse: resolve
					});
				});
			}
			subject.next({ ...ev, data: ev.data || {} });
		};
	}

	public getAppFiberChannel({ name }: AppPkgDescription): FC {
		return this._channel.pipe(
			filter(({ to }) => !to || to === name)
		);
	}

	public getInternalFiberChannelSink(): IFCSink {
		const subject = new Subject<FCEvent<any> | FCEvent<any> & { sendResponse: (data: any) => void }>();
		subject.subscribe((ev) => {
			this._channel.next(ev);
		});
		return (ev: FCEvent<any>): void | Promise<any> => {
			if (ev.asPromise) {
				return new Promise((resolve) => {
					subject.next({
						...ev,
						sendResponse: resolve
					});
				});
			}
			subject.next(ev);
		};
	}

	public getInternalFiberChannel(): FC {
		return this._channel.asObservable();
	}

}
