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

import React, { useContext } from 'react';
import { BrowserRouter, useHistory } from 'react-router-dom';
import { SnackbarManagerContext, ModalManagerContext } from '@zextras/zapp-ui';
import BootstrapperRouterContent from './bootstrapper-router-content';
import AppLoaderMounter from '../app/app-loader-mounter';
import { useContextBridge } from '../app-store/context-bridge';
import { useUserAccount } from '../account/hooks';

const ContextBridge = () => {
	const history = useHistory();
	const account = useUserAccount();
	const createSnackbar = useContext(SnackbarManagerContext);
	const createModal = useContext(ModalManagerContext);
	useContextBridge({
		functions: {
			getAccounts: () => account,
			getHistory: () => history,
			createSnackbar,
			createModal,
			historyGoBack: () => history.goBack()
		},
		packageDependentFunctions: {
			historyPush: (pkg) => (location) => {
				if (typeof location === 'string') {
					history.replace(`/${pkg}${location}`);
				} else {
					history.replace({ ...location, pathname: `/${pkg}${location.pathname}` });
				}
			},
			historyReplace: (pkg) => (location) => {
				if (typeof location === 'string') {
					history.replace(`/${pkg}${location}`);
				} else {
					history.replace({ ...location, pathname: `/${pkg}${location.pathname}` });
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
			<BootstrapperRouterContent />
		</BrowserRouter>
	);
}
