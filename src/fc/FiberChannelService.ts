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
import { IInternalFiberChannelService } from './IFiberChannelService';

export default class FiberChannelService implements IInternalFiberChannelService {

	private _fiberChannel: Subject<IFCEvent<any>> = new Subject<IFCEvent<any>>();

	public getInsecureFC(): Observable<IFCEvent<any> & { _fromSw?: boolean; _fromShell?: boolean }> {
		return this._fiberChannel;
	}

	public getInsecureFCSink(fromSw: boolean, fromShell: boolean): IFCSink {
		return (ev, _?) => {
			const tagged: IFCEvent<any> & { _fromSw?: boolean; _fromShell?: boolean } = { ...ev as IFCEvent<any> };
			if (fromSw) tagged._fromSw = true;
			if (fromShell) tagged._fromShell = true;
			this._fiberChannel.next(tagged);
		}
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
