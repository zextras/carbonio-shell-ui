/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { FC, useContext } from 'react';
import { BrowserRouter, useHistory } from 'react-router-dom';
import { SnackbarManagerContext, ModalManagerContext } from '@zextras/carbonio-design-system';
import AppLoaderMounter from './app/app-loader-mounter';
import { useBridge } from '../store/context-bridge';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import ShellView from '../shell/shell-view';
import { BASENAME } from '../constants';

const ContextBridge: FC = () => {
	const history = useHistory();
	// eslint-disable-next-line @typescript-eslint/ban-types
	const createSnackbar = useContext(SnackbarManagerContext) as Function;
	// eslint-disable-next-line @typescript-eslint/ban-types
	const createModal = useContext(ModalManagerContext) as Function;
	useBridge({
		functions: {
			getHistory: () => history,
			createSnackbar,
			createModal
		}
	});
	return null;
};

const BootstrapperRouter: FC = () => (
	<BrowserRouter basename={BASENAME}>
		<ContextBridge />
		<AppLoaderMounter />
		<ShellView />
	</BrowserRouter>
);

export default BootstrapperRouter;
