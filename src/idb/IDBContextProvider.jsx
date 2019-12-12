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

import React from 'react';
import IdbContext from './IdbContext';

const IDBContextProvider = ({ idbService, children }) => {
	return (
		<IdbContext.Provider
			value={ {
				createIdbService: (n) => idbService.createIdbService(n),
				openDb: () => idbService.openDb()
			} }
		>
			{ children }
		</IdbContext.Provider>
	);
};
export default IDBContextProvider;
