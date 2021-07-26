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

import React, { useEffect, useMemo, useState } from 'react';
import AppLoaderContext from './app-loader-context';
import {
	useFiberChannelFactory,
	useShellNetworkService,
	useStoreFactory
} from '../bootstrap/bootstrapper-context';
import { loadApps, loadThemes, unloadAppsAndThemes } from './app-loader';
import AppContextCacheProvider from './app-context-cache-provider';
import { useUserAccounts } from '../store/shell-store-hooks';
import { checkUpdate } from '../update-log/check-update';
import ChangeLogModal from '../update-log/change-log-modal';

export default function AppLoaderContextProvider({ children }) {
	const shellNetworkService = useShellNetworkService();
	const accounts = useUserAccounts();
	const fiberChannelFactory = useFiberChannelFactory();
	const storeFactory = useStoreFactory();
	const [showUpdateModal, setShowUpdateModal] = useState(false);
	useEffect(() => {
		console.log(
			'%cLOADING APPS',
			'font-size: 1rem; color: white; background: #2b73d2; padding: 0.5rem; font-family: sans-serif; border-radius: 0.1rem; width: 100%'
		);
		if (accounts.length < 1) {
			unloadAppsAndThemes();
		} else {
			loadApps(accounts, fiberChannelFactory, shellNetworkService, storeFactory);
		}
	}, [accounts, fiberChannelFactory, shellNetworkService, storeFactory]);
	return (
		<>
			{/* {showUpdateModal ? <ChangeLogModal cache={value.apps.cache} /> : null} */}
			{children}
		</>
	);
}
