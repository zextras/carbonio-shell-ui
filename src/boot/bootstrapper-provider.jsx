/*
 * *** BEGIN LICENSE BLOCK *****
 * Copyright (C) 2011-2021 Zextras
 *
 *  The contents of this file are subject to the Zextras EULA;
 * you may not use this file except in compliance with the EULA.
 * You may obtain a copy of the EULA at
 * http://www.zextras.com/zextras-eula.html
 * *** END LICENSE BLOCK *****
 */

import React from 'react';
import { I18nextProvider } from 'react-i18next';
import BoardContextProvider from '../shell/boards/board-context-provider';
import { BootstrapperContext } from './bootstrapper-context';

export default function BootstrapperContextProvider({ children, i18nFactory, storeFactory }) {
	return (
		<BootstrapperContext.Provider
			value={{
				storeFactory,
				i18nFactory
			}}
		>
			<I18nextProvider i18n={i18nFactory.getShellI18n()}>
				<BoardContextProvider>{children}</BoardContextProvider>
			</I18nextProvider>
		</BootstrapperContext.Provider>
	);
}
