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
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import BootstrapperContext from './bootstrapper-context';
import I18nProvider from '../i18n/i18n-provider';
import ShellStoreContext from '../store/shell-store-context';
import ShellThemeProvider from '../shell/shell-theme-provider';
import AppLoaderContextProvider from '../app/app-loader-context-provider';
import AppLoaderMounter from '../app/app-loader-mounter';

export default function BootstrapperContextProvider({
	children,
	fiberChannelFactory,
	i18nFactory,
	shellNetworkService,
	shellStore,
	shellStorePersistor,
	storeFactory,
}) {
	return (
		<Provider
			context={ShellStoreContext}
			store={shellStore}
		>
			<PersistGate loading={null} persistor={shellStorePersistor}>
				<BootstrapperContext.Provider
					value={{
						fiberChannelFactory,
						i18nFactory,
						shellNetworkService,
						storeFactory,
					}}
				>
					<ShellThemeProvider>
						<I18nProvider i18n={i18nFactory.getShellI18n()}>
							<AppLoaderContextProvider>
								{ children }
								<AppLoaderMounter />
							</AppLoaderContextProvider>
						</I18nProvider>
					</ShellThemeProvider>
				</BootstrapperContext.Provider>
			</PersistGate>
		</Provider>
	);
}
