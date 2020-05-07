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

import React, { useContext, useEffect, useMemo, useState } from 'react';
import AppContext from './app-context';
import { useAppsCache } from './app-loader-context-provider';
import { useFiberChannelFactory } from '../bootstrap/bootstrapper-context-provider';

export function useAppPkg() {
	const { pkg } = useContext(AppContext);
	return pkg;
}

export function useAppContext() {
	return useContext(AppContext);
}

export function useFiberChannel() {
	const { fiberChannelSink, fiberChannel } = useContext(AppContext);
	return { fiberChannelSink, fiberChannel };
}

export default function AppContextProvider({ pkg, children }) {
	const [appsCache, appsLoaded] = useAppsCache();
	const fiberChannelFactory = useFiberChannelFactory();
	const [appCtxt, setAppCtxt] = useState({});

	useEffect(() => {
		const sub = appsCache[pkg.package].appContext.subscribe(setAppCtxt);
		return () => sub.unsubscribe();
	}, [appsCache, pkg]);

	const value = useMemo(() => ({
		pkg,
		fiberChannelSink: fiberChannelFactory.getAppFiberChannelSink(pkg),
		fiberChannel: fiberChannelFactory.getAppFiberChannel(pkg),
		...appCtxt
	}), [pkg, appCtxt, fiberChannelFactory]);

	return (
		<AppContext.Provider
			value={value}
		>
			{ children }
		</AppContext.Provider>
	);
}
