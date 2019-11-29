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

import React, { FC } from 'react';

import IdbContext from './IdbContext';
import IdbService from './IdbService';
import { IIdbExtensionService } from './IIdbExtensionService';
import { IDBPDatabase } from 'idb';
import { IShellIdbSchema } from './IShellIdbSchema';

interface IIdbContextProviderProps {
	idbService: IdbService;
}

const IdbContextProvider: FC<IIdbContextProviderProps> = ({ idbService, children }) => {
	return (
		<IdbContext.Provider
			value={ {
				createIdbService: (n): IIdbExtensionService<any> => idbService.createIdbService(n),
				openDb: (): Promise<IDBPDatabase<IShellIdbSchema>> => idbService.openDb()
			} }
		>
			{ children }
		</IdbContext.Provider>
	);
};
export default IdbContextProvider;
