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
	const [appsCache, appsLoaded] = useAppsCache();
	const [appContextCache, dispatchAppContext] = useReducer(appContextReducer, appContextCacheInitialState);

	useEffect(() => {
		const subscription = combineLatest(
			reduce(
				appsCache,
				(acc, app) => {
					acc.push(
						app.appContext.pipe(
							rxMap((appContext) => ({ appContext, app }))
						)
					);
					return acc;
				},
				[]
			)
		)
			.subscribe((_appContexts) => {
				dispatchAppContext({
					type: 'set-app-context',
					appsCtxts: reduce(
						_appContexts,
						(acc, { appContext, app }) => {
							acc[app.pkg.package] = appContext;
							return acc;
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
	}, [appsCache, dispatchAppContext]);

	return (
		<AppContextCache.Provider
			value={appContextCache}
		>
			{ children }
		</AppContextCache.Provider>
	);
}
