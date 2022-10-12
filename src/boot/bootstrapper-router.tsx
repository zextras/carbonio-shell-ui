/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ModalManagerContext, SnackbarManagerContext } from '@zextras/carbonio-design-system';
import React, { FC, useContext, useEffect } from 'react';
import { BrowserRouter, Route, Switch, useHistory, useParams } from 'react-router-dom';
import { BASENAME, IS_STANDALONE } from '../constants';
import ShellView from '../shell/shell-view';
import { useAppStore } from '../store/app';
import { useBridge } from '../store/context-bridge';
import AppLoaderMounter from './app/app-loader-mounter';

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

const StandaloneListener: FC = () => {
	const { route } = useParams<{ route?: string }>();
	useEffect(() => {
		if (route) useAppStore.setState({ standalone: route });
	}, [route]);
	return null;
};

const BootstrapperRouter: FC = () => (
	<BrowserRouter basename={BASENAME}>
		{IS_STANDALONE && (
			<Switch>
				<Route path={'/:route'}>
					<StandaloneListener />
				</Route>
			</Switch>
		)}
		<ContextBridge />
		<AppLoaderMounter />
		<ShellView />
	</BrowserRouter>
);
export default BootstrapperRouter;
