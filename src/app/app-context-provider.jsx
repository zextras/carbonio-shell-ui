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

import React, { useEffect, useMemo, useReducer } from 'react';
import { combineLatest } from 'rxjs';
import { reduce } from 'lodash';
import { map as rxMap } from 'rxjs/operators';
import AppContext from './app-context';
import { useAppsCache } from './app-loader-context';
import { useFiberChannelFactory, useI18nFactory } from '../bootstrap/bootstrapper-context';
import AppErrorCatcher from './app-error-catcher';
import I18nProvider from '../i18n/i18n-provider';

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

export default function AppContextProvider({ pkg, children }) {
	const [appsCache, appsLoaded] = useAppsCache();
	const fiberChannelFactory = useFiberChannelFactory();
	const i18nFactory = useI18nFactory();
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
						[]
					)
				});
			});

		return () => {
			if (subscription) {
				subscription.unsubscribe();
			}
		};
	}, [appsCache, dispatchAppContext]);

	const memoizedContextFcns = useMemo(() => ({
		pkg,
		fiberChannelSink: fiberChannelFactory.getAppFiberChannelSink(pkg),
		fiberChannel: fiberChannelFactory.getAppFiberChannel(pkg)
	}), [pkg, fiberChannelFactory]);

	const value = useMemo(() => ({
		...memoizedContextFcns,
		appCtxt: appContextCache[pkg.package]
	}), [pkg, memoizedContextFcns, appContextCache]);

	const i18n = useMemo(() => i18nFactory.getAppI18n(pkg), [i18nFactory, pkg]);

	return (
		<AppContext.Provider
			value={value}
		>
			<I18nProvider i18n={i18n}>
				<AppErrorCatcher>
					{ children }
				</AppErrorCatcher>
			</I18nProvider>
		</AppContext.Provider>
	);
}
