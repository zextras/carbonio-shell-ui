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

import React, { useContext, Suspense, lazy } from 'react';
import { BrowserRouter, useHistory } from 'react-router-dom';
import { SnackbarManagerContext, ModalManagerContext } from '@zextras/zapp-ui';
import AppLoaderMounter from './app/app-loader-mounter';
import { useContextBridge } from '../store/context-bridge';
import LoadingView from './loading-view';

export const LazyShellView = lazy(() =>
	import(/* webpackChunkName: "shell-view" */ '../shell/shell-view')
);

const ContextBridge = () => {
	const history = useHistory();
	const createSnackbar = useContext(SnackbarManagerContext);
	const createModal = useContext(ModalManagerContext);
	useContextBridge({
		functions: {
			getHistory: () => history,
			createSnackbar,
			createModal,
			historyGoBack: () => history.goBack()
		},
		routeDependentFunctions: {
			historyPush: (route) => (location) => {
				if (typeof location === 'string') {
					history.replace(`/${route}${location}`);
				} else {
					history.replace({ ...location, pathname: `/${route}${location.pathname}` });
				}
			},
			historyReplace: (route) => (location) => {
				if (typeof location === 'string') {
					history.replace(`/${route}${location}`);
				} else {
					history.replace({ ...location, pathname: `/${route}${location.pathname}` });
				}
			}
		}
	});
	return null;
};

export default function BootstrapperRouter() {
	return (
		<BrowserRouter basename={BASE_PATH}>
			<ContextBridge />
			<AppLoaderMounter />
			<Suspense fallback={<LoadingView />}>
				<LazyShellView />
			</Suspense>
		</BrowserRouter>
	);
}
