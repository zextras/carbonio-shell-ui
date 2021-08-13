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

import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import BootstrapperContext from './bootstrapper-context';
import ShellStoreContext from '../store/shell-store-context';
import AppLoaderContextProvider from '../app/app-loader-context-provider';
import ThemeLoaderMounter from '../app/theme-loader-mounter';
import BoardContextProvider from '../shell/boards/board-context-provider';

export default function BootstrapperContextProvider({
	children,
	fiberChannelFactory,
	i18nFactory,
	shellNetworkService,
	shellStore,
	shellStorePersistor,
	storeFactory
}) {
	return (
		<Provider context={ShellStoreContext} store={shellStore}>
			<BootstrapperContext.Provider
				value={{
					fiberChannelFactory,
					i18nFactory,
					shellNetworkService,
					storeFactory
				}}
			>
				<I18nextProvider i18n={i18nFactory.getShellI18n()}>
					<AppLoaderContextProvider>
						<BoardContextProvider>{children}</BoardContextProvider>
						<ThemeLoaderMounter />
					</AppLoaderContextProvider>
				</I18nextProvider>
			</BootstrapperContext.Provider>
		</Provider>
	);
}
