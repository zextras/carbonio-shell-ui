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

import React from 'react';
import { Subject } from 'rxjs';
import AppContext from '../app-context';
// eslint-disable-next-line
const AppContextProvider = jest.fn().mockImplementation(({ children }) => {
	return (
		<AppContext.Provider
			value={{
				pkg: {},
				fiberChannelSink: () => undefined,
				fiberChannel: new Subject(),
			}}
		>
			{ children }
		</AppContext.Provider>
	);
});
export default AppContextProvider;
