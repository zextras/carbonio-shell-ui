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
import { useHistory } from 'react-router-dom';
import { BehaviorSubject } from 'rxjs';
import { configureStore, createSlice } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { extendTheme, ThemeProvider } from '@zextras/zapp-ui';
import AppContext from '../app/app-context';
import I18nProvider from '../i18n/i18n-provider';
import I18nFactory from '../i18n/i18n-test-factory';

const _uselessSlice = createSlice({
	name: '_useless',
	initialState: {},
	reducers: {}
});

export default function AppContextWrapper({
	packageName,
	packageVersion,
	children,
	ctxt = {},
	reducer,
	preloadedState
}) {
	const history = useHistory();

	const { appContext, i18nFactory, pkg } = useMemo(() => {
		const _pkg = {
			package: packageName,
			version: packageVersion
		};


		// eslint-disable-next-line no-param-reassign
		ctxt.current = {
			history,
			appContext: new BehaviorSubject({}),
			createOptions: new BehaviorSubject([]),
			entryPoint: new BehaviorSubject(null),
			mainMenuItems: new BehaviorSubject([]),
			routes: new BehaviorSubject([]),
			sharedUiComponents: new BehaviorSubject({}),
			store: configureStore({
				devTools: {
					name: _pkg.package,
				},
				reducer: reducer || { _useless: _uselessSlice.reducer },
				preloadedState
			})
		};

		return {
			appContext: {
				_pkg,
				...ctxt.current
			},
			pkg: _pkg,
			i18nFactory: new I18nFactory()
		};
	}, [packageName, packageVersion, ctxt, reducer, preloadedState, history]);

	return (
		<ThemeProvider
			theme={extendTheme({})}
		>
			<Provider store={appContext.store}>
				<AppContext.Provider
					value={appContext}
				>
					<I18nProvider i18n={i18nFactory.getAppI18n(pkg)}>
						{ children }
					</I18nProvider>
				</AppContext.Provider>
			</Provider>
		</ThemeProvider>
	);
}
