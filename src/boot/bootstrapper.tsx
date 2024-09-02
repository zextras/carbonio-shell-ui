/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useEffect } from 'react';

import { SnackbarManager } from '@zextras/carbonio-design-system';
import { BrowserRouter, Route, Switch, useParams } from 'react-router-dom';

import AppLoaderMounter from './app/app-loader-mounter';
import { DefaultViewsRegister } from './app/default-views';
import { ContextBridge } from './context-bridge';
import { Loader } from './loader';
import { TrackerProvider } from './posthog';
import ShellI18nextProvider from './shell-i18n-provider';
import { ThemeProvider } from './theme-provider';
import { BASENAME, IS_FOCUS_MODE } from '../constants';
import { NotificationPermissionChecker } from '../notification/NotificationPermissionChecker';
import ShellView from '../shell/shell-view';
import { useAppStore } from '../store/app/store';

const FocusModeListener = (): null => {
	const { route } = useParams<{ route?: string }>();
	useEffect(() => {
		if (route) useAppStore.setState({ focusMode: route });
	}, [route]);
	return null;
};

const Bootstrapper = (): React.JSX.Element => (
	<TrackerProvider>
		<ThemeProvider>
			<ShellI18nextProvider>
				<BrowserRouter basename={BASENAME}>
					<SnackbarManager>
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
					</SnackbarManager>
				</BrowserRouter>
			</ShellI18nextProvider>
		</ThemeProvider>
	</TrackerProvider>
);

export default Bootstrapper;
