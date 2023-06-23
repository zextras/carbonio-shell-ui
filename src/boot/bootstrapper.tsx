/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { FC, useEffect } from 'react';

import {
	ModalManager,
	SnackbarManager,
	useModal,
	useSnackbar
} from '@zextras/carbonio-design-system';
import { useTranslation } from 'react-i18next';
import { BrowserRouter, Route, Switch, useHistory, useParams } from 'react-router-dom';

import AppLoaderMounter from './app/app-loader-mounter';
import { registerDefaultViews } from './app/default-views';
import { Loader } from './loader';
import ShellI18nextProvider from './shell-i18n-provider';
import { ThemeProvider } from './theme-provider';
import { BASENAME, IS_STANDALONE } from '../constants';
import { NotificationPermissionChecker } from '../notification/NotificationPermissionChecker';
import ShellView from '../shell/shell-view';
import { useAppStore } from '../store/app';
import { useBridge } from '../store/context-bridge';

const ContextBridge = (): null => {
	const history = useHistory();
	const createSnackbar = useSnackbar();
	const createModal = useModal();
	useBridge({
		functions: {
			getHistory: () => history,
			createSnackbar,
			createModal
		}
	});
	return null;
};

const StandaloneListener = (): null => {
	const { route } = useParams<{ route?: string }>();
	useEffect(() => {
		if (route) useAppStore.setState({ standalone: route });
	}, [route]);
	return null;
};

const DefaultViewsRegister = (): null => {
	const [t] = useTranslation();
	useEffect(() => {
		registerDefaultViews(t);
	}, [t]);
	return null;
};

const Bootstrapper: FC = () => (
	<ThemeProvider>
		<ShellI18nextProvider>
			<BrowserRouter basename={BASENAME}>
				<SnackbarManager>
					<ModalManager>
						<Loader />
						{IS_STANDALONE && (
							<Switch>
								<Route path={'/:route'}>
									<StandaloneListener />
								</Route>
							</Switch>
						)}
						<DefaultViewsRegister />
						<NotificationPermissionChecker />
						<ContextBridge />
						<AppLoaderMounter />
						<ShellView />
					</ModalManager>
				</SnackbarManager>
			</BrowserRouter>
		</ShellI18nextProvider>
	</ThemeProvider>
);

export default Bootstrapper;
