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

import React, { useMemo } from 'react';
import { Provider } from 'react-redux';
import AppContext from './app-context';
import { useFiberChannelFactory, useI18nFactory, useStoreFactory } from '../bootstrap/bootstrapper-context';
import AppErrorCatcher from './app-error-catcher';
import I18nProvider from '../i18n/i18n-provider';
import { useAppContextCache } from './app-context-cache-context';

export default function AppContextProvider({ pkg, children }) {
	const appContextCache = useAppContextCache();
	const fiberChannelFactory = useFiberChannelFactory();
	const i18nFactory = useI18nFactory();
	const storeFactory = useStoreFactory();

	const memoizedContextFcns = useMemo(() => ({
		pkg,
		fiberChannelSink: fiberChannelFactory.getAppFiberChannelSink(pkg),
		fiberChannel: fiberChannelFactory.getAppFiberChannel(pkg)
	}), [pkg, fiberChannelFactory]);

	const value = useMemo(() => ({
		...memoizedContextFcns,
		appCtxt: appContextCache[pkg.package]
	}), [pkg, memoizedContextFcns, appContextCache]);

	const store = useMemo(() => storeFactory.getStoreForApp(pkg), [pkg, storeFactory]);

	const i18n = useMemo(() => i18nFactory.getAppI18n(pkg), [i18nFactory, pkg]);

	return (
		<Provider store={store}>
			<AppContext.Provider
				value={value}
			>
				<I18nProvider i18n={i18n}>
					<AppErrorCatcher>
						{ children }
					</AppErrorCatcher>
				</I18nProvider>
			</AppContext.Provider>
		</Provider>
	);
}
