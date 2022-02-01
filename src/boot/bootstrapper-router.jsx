/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useContext } from 'react';
import { BrowserRouter, useHistory } from 'react-router-dom';
import { SnackbarManagerContext, ModalManagerContext } from '@zextras/carbonio-design-system';
import AppLoaderMounter from './app/app-loader-mounter';
import { useBridge } from '../store/context-bridge';
import ShellView from '../shell/shell-view';

const ContextBridge = () => {
	const history = useHistory();
	const createSnackbar = useContext(SnackbarManagerContext);
	const createModal = useContext(ModalManagerContext);
	useBridge({
		functions: {
			getHistory: () => history,
			createSnackbar,
			createModal
		}
	});
	return null;
};

export default function BootstrapperRouter() {
	return (
		<BrowserRouter basename="/carbonio/">
			<ContextBridge />
			<AppLoaderMounter />
			<ShellView />
		</BrowserRouter>
	);
}
