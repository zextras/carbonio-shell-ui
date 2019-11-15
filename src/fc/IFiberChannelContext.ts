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

export interface IFiberChannelContext {
  internalFC: Observable<IFCEvent<unknown>> | undefined;
  internalFCSink: IFCSink | undefined;
  getFiberChannelForExtension: ExtensionsFCGetter | undefined;
  getFiberChannelSinkForExtension: ExtensionFCSinkGetter | undefined;
}

type ExtensionsFCGetter = (name: string) => Observable<IFCEvent<unknown>>;
type ExtensionFCSinkGetter = (name: string, version: string) => IFCSink;
