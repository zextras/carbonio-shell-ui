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

import { Context, createContext } from 'react';
import { IIdbContext } from './IIdbContext';

const context: Context<IIdbContext> = createContext<IIdbContext>({
	createIdbService: (pkgName) => { throw new Error('IdbContext not initialized'); },
	openDb: () =>  new Promise((resolve, reject) => reject(new Error('IdbContext not initialized'))),
});
export default context;
