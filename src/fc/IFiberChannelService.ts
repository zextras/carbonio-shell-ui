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

import { Observable } from 'rxjs';
import { IFCEvent, IFCSink } from './IFiberChannel';

export interface IFiberChannelService {
	getFiberChannelForExtension(name: string): Observable<IFCEvent<any>>;
	getFiberChannelSinkForExtension(name: string, version: string): IFCSink;
	getInternalFC(): Observable<IFCEvent<any>>;
	getInternalFCSink(): IFCSink;
}
