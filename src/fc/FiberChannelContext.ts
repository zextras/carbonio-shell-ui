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

/* eslint-disable @typescript-eslint/no-unused-vars */

import { createContext, Context } from 'react';

import { IFiberChannelContext } from './IFiberChannelContext';
import { Observable } from 'rxjs';
import { IFCEvent } from './IFiberChannel';

const context: Context<IFiberChannelContext> = createContext<IFiberChannelContext>({
	internalFC: new Observable<IFCEvent<any>>(),
	internalFCSink: (ev) => undefined,
	getFiberChannelForExtension: (name) => {
		throw new Error('FiberChannelContext not initialized');
	},
	getFiberChannelSinkForExtension: (name, version) => {
		throw new Error('FiberChannelContext not initialized');
	}
});
export default context;
