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

import React, { useEffect, useReducer } from 'react';
import { combineLatest } from 'rxjs';
import { reduce } from 'lodash';
import { map as rxMap } from 'rxjs/operators';
import { useAppsCache } from './app-loader-context';
import AppContextCache from './app-context-cache-context';

const appContextCacheInitialState = {};

function appContextReducer(state, { type, ...rest }) {
	switch (type) {
		case 'set-app-context': {
			return {
				...rest.appsCtxts
			};
		}
		default:
			throw new Error();
	}
}

export default function AppContextCacheProvider({ children }) {
	const { cache } = useAppsCache();
	const [appContextCache, dispatchAppContext] = useReducer(
		appContextReducer,
		appContextCacheInitialState
	);

	useEffect(() => {
		const subscription = combineLatest(
			reduce(
				cache,
				(acc, app) => {
					acc.push(app.appContext.pipe(rxMap((appContext) => ({ appContext, app }))));
					return acc;
				},
				[]
			)
		).subscribe((_appContexts) => {
			dispatchAppContext({
				type: 'set-app-context',
				appsCtxts: reduce(
					_appContexts,
					(r, { appContext, app }) => {
						r[app.pkg.package] = appContext;
						return r;
					},
					{}
				)
			});
		});

		return () => {
			if (subscription) {
				subscription.unsubscribe();
			}
		};
	}, [cache, dispatchAppContext]);

	return <AppContextCache.Provider value={appContextCache}>{children}</AppContextCache.Provider>;
}
