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
import AppContext from './app-context';
import { useAppsCache } from './app-loader-context';
import { useFiberChannelFactory } from '../bootstrap/bootstrapper-context';
import AppErrorCatcher from './app-error-catcher';

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
			<AppErrorCatcher>
				{ children }
			</AppErrorCatcher>
		</AppContext.Provider>
	);
}
