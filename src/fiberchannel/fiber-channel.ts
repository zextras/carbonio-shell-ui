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
	FCPartialEvent,
	FCSink,
	IFCSink,
	IFiberChannelFactory
} from './fiber-channel-types';
import { AppPkgDescription } from '../db/account';

export default class FiberChannelFactory implements IFiberChannelFactory {

	private _channel = new Subject<FCEvent<any>>();

	public getAppFiberChannelSink({ name, version }: AppPkgDescription): FCSink {
		const subject = new Subject<FCPartialEvent<any>>();
		subject.subscribe((ev) => this._channel.next({ ...ev, from: name, version: version }));
		return (ev: string | FCPartialEvent<any>, data?: any): void => {
			if (typeof ev === 'string') {
				subject.next({ event: ev, data: data || {} });
			} else {
				subject.next({ ...ev, data: ev.data || data || {} });
			}
		};
	}

	public getAppFiberChannel({ name }: AppPkgDescription): FC {
		return this._channel.pipe(
			filter(({ to }) => !to || to === name)
		);
	}

	public getInternalFiberChannelSink(): IFCSink {
		const subject = new Subject<FCEvent<any>>();
		subject.subscribe((ev) => this._channel.next({ ...ev }));
		return (ev: FCEvent<any>): void => subject.next(ev);
	}

	public getInternalFiberChannel(): FC {
		return this._channel.asObservable();
	}

}
