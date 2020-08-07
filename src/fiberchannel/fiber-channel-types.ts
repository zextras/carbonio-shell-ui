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

import { Observable } from 'rxjs';
import { AppPkgDescription, FCEvent, FCPromisedEvent, FCSink } from '../../types';


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
