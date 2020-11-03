/*
 * *** BEGIN LICENSE BLOCK *****
 * Copyright (C) 2011-2020 Zextras
 *
 *  The contents of this file are subject to the Zextras EULA;
 * you may not use this file except in compliance with the EULA.
 * You may obtain a copy of the EULA at
 * http://www.zextras.com/zextras-eula.html
 * *** END LICENSE BLOCK *****
 */

import { Observable } from 'rxjs';
import {
	AppPkgDescription, FCEvent, FCPromisedEvent, FCSink
} from '../../types';

// eslint-disable-next-line max-len
export type IFCSink = <T extends {} | string, R extends {} | string>(event: FCEvent<T>) => void | Promise<R>;
export type FC = Observable<FCEvent<any> | FCPromisedEvent<any, any>>;

export interface IFiberChannelFactory {
	getAppFiberChannelSink(appPackageDescription: AppPkgDescription): FCSink;
	getAppFiberChannel(appPackageDescription: AppPkgDescription): FC;
	getInternalFiberChannelSink(): IFCSink;
	getInternalFiberChannel(appPackageDescription: AppPkgDescription): FC;
	getShellFiberChannelSink(): FCSink;
	getShellFiberChannel(): FC;
}
