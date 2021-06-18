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
import { I18nextProvider } from 'react-i18next';
import AppContext from './app-context';
import {
	useFiberChannelFactory,
	useI18nFactory,
	useStoreFactory
} from '../bootstrap/bootstrapper-context';
import AppErrorCatcher from './app-error-catcher';
import { useAppContextCache } from './app-context-cache-context';
import { useAppStore } from '../app-store';

export default function AppContextProvider({ pkg, children }) {
	const appContextCache = useAppContextCache();
	const fiberChannelFactory = useFiberChannelFactory();
	const i18nFactory = useI18nFactory();
	const storeFactory = useStoreFactory();
	const app = useAppStore((s) => s.apps[pkg]?.core);
	const memoizedContextFcns = useMemo(
		() => ({
			app,
			fiberChannelSink: fiberChannelFactory.getAppFiberChannelSink(app),
			fiberChannel: fiberChannelFactory.getAppFiberChannel(app)
		}),
		[app, fiberChannelFactory]
	);

	const value = useMemo(
		() => ({
			...memoizedContextFcns,
			appCtxt: appContextCache[app.package]
		}),
		[app, memoizedContextFcns, appContextCache]
	);

	const store = useMemo(() => storeFactory.getStoreForApp(app), [app, storeFactory]);

	const i18n = useMemo(() => i18nFactory.getAppI18n(app), [i18nFactory, app]);
	return (
		<Provider store={store}>
			<AppContext.Provider value={value}>
				<I18nextProvider i18n={i18n}>
					<AppErrorCatcher>{children}</AppErrorCatcher>
				</I18nextProvider>
			</AppContext.Provider>
		</Provider>
	);
}
