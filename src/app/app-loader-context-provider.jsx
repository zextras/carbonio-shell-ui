/*
 * *** BEGIN LICENSE BLOCK *****
 * Copyright (C) 2011-2020 ZeXtras
 *
 * The contents of this file are subject to the ZeXtras EULA;
 * you may not use this file except in compliance with the EULA.
 * You may obtain a copy of the EULA at
 * http://www.zextras.com/zextras-eula.html
 * *** END LICENSE BLOCK *****
 */

import React, { useEffect, useMemo, useState } from 'react';
import AppLoaderContext from './app-loader-context';
import { useFiberChannelFactory, useUserAccounts } from '../bootstrap/bootstrapper-context';
import { loadApps } from './app-loader';

export default function AppLoaderContextProvider({ children }) {
	const { accounts, accountLoaded } = useUserAccounts();
	const fiberChannelFactory = useFiberChannelFactory();
	const [[appsCache, appsLoaded], setAppsCache] = useState([{}, false]);

	useEffect(() => {
		if (!accountLoaded || accounts.length < 1) return;
		console.log('Accounts changed, un/loading apps!');
		let canSet = true;
		setAppsCache([{}, false]);
		loadApps(
			accounts,
			fiberChannelFactory,
		)
			.then((cache) => {
				if (!canSet) return;
				setAppsCache([cache, true]);
			}); // eslint-disable-next-line
		return () => {
			canSet = false;
		};
	}, [accounts, accountLoaded, fiberChannelFactory, setAppsCache]);

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
			{ children }
		</AppLoaderContext.Provider>
	);
}
