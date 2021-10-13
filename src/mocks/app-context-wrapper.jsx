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
import React, { useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import { configureStore, createSlice } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
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
	ctxt,
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
			store: configureStore({
				devTools: {
					name: _pkg.name
				},
				reducer: reducer || { _useless: _uselessSlice.reducer },
				preloadedState
			})
		};

		return {
			appContext: {
				pkg: _pkg,
				...ctxt.current
			},
			pkg: _pkg,
			i18nFactory: new I18nFactory()
		};
	}, [packageName, packageVersion, ctxt, reducer, preloadedState, history]);

	const i18n = useMemo(() => i18nFactory.getAppI18n(pkg), [i18nFactory, pkg]);

	return (
		<Provider store={appContext.store}>
			<I18nextProvider i18n={i18n}>{children}</I18nextProvider>
		</Provider>
	);
}
