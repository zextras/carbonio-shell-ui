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
import { AppPkgDescription } from '../db/account';

export type FCPartialEvent<T extends {} | string> = {
	to?: string;
	event: string;
	data: T;
};

export type FCEvent<T extends {} | string> = FCPartialEvent<T> & {
	from: string;
	version: string;
};

export type FCSink = <T extends {} | string>(event: string | FCPartialEvent<T>, data?: T) => void;
export type IFCSink = <T extends {} | string>(event: FCEvent<T>) => void;
export type FC = Observable<FCEvent<any>>;

export interface IFiberChannelFactory {
	getAppFiberChannelSink(appPackageDescription: AppPkgDescription): FCSink;
	getAppFiberChannel(appPackageDescription: AppPkgDescription): FC;
	getInternalFiberChannelSink(): IFCSink;
	getInternalFiberChannel(): FC;
}
