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
import { loadApps, loadThemes, unloadAppsAndThemes } from './app-loader';
import AppContextCacheProvider from './app-context-cache-provider';
import { useUserAccounts } from '../store/shell-store-hooks';
import {checkUpdate} from '../update-log/check-update'
import ChangeLogModal from '../update-log/change-log-modal';


export default function AppLoaderContextProvider({ children }) {
	const shellNetworkService = useShellNetworkService();
	const accounts = useUserAccounts();
	const fiberChannelFactory = useFiberChannelFactory();
	const storeFactory = useStoreFactory();
	const [[appsCache, appsLoaded], setAppsCache] = useState([{}, false]);
	const [showUpdateModal, setShowUpdateModal] = useState(false);
	const [[themesCache, themesLoaded], setThemeCache] = useState([{}, false]);

	useEffect(() => {
		console.log('Accounts changed, un/loading Apps and Themes!');
		let canSet = true;
		if (accounts.length < 1) {
			unloadAppsAndThemes()
				.then(() => {
					if (!canSet) return;
					setAppsCache([{}, false]);
					setThemeCache([{}, false]);
				})
				.catch();
		}
		else {
			loadApps(
				accounts,
				fiberChannelFactory,
				shellNetworkService,
				storeFactory
			)
				.then(
					(_appsCache) => loadThemes(
						accounts,
						fiberChannelFactory,
					)
						.then((_themesCache) => [_appsCache, _themesCache])
				)
				.then(([_appsCache, _themesCache]) => {
					if (!canSet) return;
					setShowUpdateModal(checkUpdate());
					setAppsCache([_appsCache, true]);
					setThemeCache([_themesCache, true]);
				});
		}
		return () => {
			canSet = false;
		};
	}, [accounts, fiberChannelFactory, shellNetworkService, storeFactory]);

	const value = useMemo(() => ({
		apps: { cache: appsCache, loaded: appsLoaded },
		themes: { cache: themesCache, loaded: themesLoaded },
		showUpdateModal
	}), [
		appsCache,
		appsLoaded,
		themesCache,
		themesLoaded,
		showUpdateModal
	]);

	return (
		<AppLoaderContext.Provider
			value={value}
		>
			<AppContextCacheProvider>
				{showUpdateModal ? <ChangeLogModal cache={value.apps.cache} /> : null}
				{ children }
			</AppContextCacheProvider>
		</AppLoaderContext.Provider>
	);
}


