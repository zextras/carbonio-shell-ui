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

import React from 'react';
import { SharedUIComponentsContext } from '../shared-ui-components-context';

const SharedUIComponentsContextProvider = jest
	.fn()
	.mockImplementation(({ children }) => (
		<SharedUIComponentsContext.Provider value={{}}>{children}</SharedUIComponentsContext.Provider>
	));

export default SharedUIComponentsContextProvider;
