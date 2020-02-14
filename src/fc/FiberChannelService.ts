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

import { Observable, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';

import { version } from '../../package.json';
import { IFCEvent, IFCPartialEvent, IFCSink } from './IFiberChannel';
import { IFiberChannelService } from './IFiberChannelService';

export default class FiberChannelService implements IFiberChannelService {

	private _fiberChannel: Subject<IFCEvent<any>> = new Subject<IFCEvent<any>>();

	constructor() {
		const sharedBC = new BroadcastChannel(`${PACKAGE_NAME}_sw`);
		sharedBC.addEventListener('message', (e) => {
			if (typeof e.data._source === 'undefined' || e.data._source !== FC_EVENT_SOURCE) {
				this._fiberChannel.next(e.data);
			}
		});
		this._fiberChannel.pipe(
			filter((e) => (typeof e._source === 'undefined'))
		)
			.subscribe(
			(e) => sharedBC.postMessage({ ...e, _source: FC_EVENT_SOURCE })
			);
	}

	public getFiberChannelForExtension(name: string): Observable<IFCEvent<any>> {
		return this._fiberChannel
			.pipe(
				filter(({ to }) => !to || to === name)
			);
	}

	public getFiberChannelSinkForExtension(name: string, version: string): IFCSink {
		const subject = new Subject<IFCPartialEvent<any>>();
		subject.subscribe((ev) => this._fiberChannel.next({ ...ev, from: name, version: version }));
		return (ev: string | IFCPartialEvent<any>, data: any = {}): void => {
			if (typeof ev === 'string') {
				subject.next({ event: ev, data });
			} else {
				subject.next(ev);
			}
		};
	}

	public getInternalFC(): Observable<IFCEvent<any>> {
		return this.getFiberChannelForExtension(PACKAGE_NAME);
	}

	public getInternalFCSink(): IFCSink {
		return this.getFiberChannelSinkForExtension(PACKAGE_NAME, version);
	}

}
