/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { FC, useEffect, useMemo } from 'react';

import { ModalManager, SnackbarManager } from '@zextras/carbonio-design-system';
import { useTranslation } from 'react-i18next';
import { BrowserRouter, Route, Switch, useParams } from 'react-router-dom';

import AppLoaderMounter from './app/app-loader-mounter';
import { registerDefaultViews } from './app/default-views';
import { ContextBridge } from './context-bridge';
import { Loader } from './loader';
import { Matomo, MatomoContext } from './matomo-provider';
import ShellI18nextProvider from './shell-i18n-provider';
import { ThemeProvider } from './theme-provider';
import { BASENAME, IS_FOCUS_MODE, MATOMO_SHELL_SITE_ID } from '../constants';
import { NotificationPermissionChecker } from '../notification/NotificationPermissionChecker';
import ShellView from '../shell/shell-view';
import { useAppStore } from '../store/app';

const FocusModeListener = (): null => {
	const { route } = useParams<{ route?: string }>();
	useEffect(() => {
		if (route) useAppStore.setState({ focusMode: route });
	}, [route]);
	return null;
};

export const DefaultViewsRegister = (): null => {
	const [t] = useTranslation();
	useEffect(() => {
		registerDefaultViews(t);
	}, [t]);
	return null;
};

const Bootstrapper: FC = () => {
	const matomoInstance = useMemo(() => new Matomo(MATOMO_SHELL_SITE_ID), []);
	return (
		<MatomoContext.Provider value={matomoInstance}>
			<ThemeProvider>
				<ShellI18nextProvider>
					<BrowserRouter basename={BASENAME}>
						<SnackbarManager>
							<ModalManager>
								<Loader />
								{IS_FOCUS_MODE && (
									<Switch>
										<Route path={'/:route'}>
											<FocusModeListener />
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
		</MatomoContext.Provider>
	);
};

export default Bootstrapper;
