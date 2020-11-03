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

import React, { useEffect, useMemo, useState } from 'react';
import AppLoaderContext from './app-loader-context';
import { useFiberChannelFactory, useShellNetworkService, useStoreFactory } from '../bootstrap/bootstrapper-context';
import { loadApps } from './app-loader';
import AppContextCacheProvider from './app-context-cache-provider';
import { useUserAccounts } from '../store/shell-store-hooks';

export default function AppLoaderContextProvider({ children }) {
	const shellNetworkService = useShellNetworkService();
	const accounts = useUserAccounts();
	const fiberChannelFactory = useFiberChannelFactory();
	const storeFactory = useStoreFactory();
	const [[appsCache, appsLoaded], setAppsCache] = useState([{}, false]);

	useEffect(() => {
		if (accounts.length < 1) return;
		console.log('Accounts changed, un/loading apps!');
		let canSet = true;
		setAppsCache([{}, false]);
		loadApps(
			accounts,
			fiberChannelFactory,
			shellNetworkService,
			storeFactory
		)
			.then((cache) => {
				if (!canSet) return;
				setAppsCache([cache, true]);
			}); // eslint-disable-next-line
		return () => {
			canSet = false;
		};
	}, [accounts, fiberChannelFactory, shellNetworkService, storeFactory]);

	const value = useMemo(() => ({
		appsCache,
		appsLoaded
	}), [
		appsCache,
		appsLoaded
	]);

	return (
		<AppLoaderContext.Provider
			value={value}
		>
			<AppContextCacheProvider>
				{ children }
			</AppContextCacheProvider>
		</AppLoaderContext.Provider>
	);
}
