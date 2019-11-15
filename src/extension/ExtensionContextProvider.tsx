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

import ExtensionContext from './ExtensionContext';
import ExtensionService from './ExtensionService';

interface IExtensionContextProvider {
	extensionService: ExtensionService;
}

const ExtensionContextProvider: FC<IExtensionContextProvider> = ({ extensionService, children }) => {

	return (
		<ExtensionContext.Provider
			value={{}}
		>
			{children}
		</ExtensionContext.Provider>
	);
};
export default ExtensionContextProvider;
