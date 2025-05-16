/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useEffect } from 'react';

import { SnackbarManager } from '@zextras/carbonio-design-system';
import { Route, Routes, useParams } from 'react-router-dom';

import AppLoaderMounter from './app/app-loader-mounter';
import { DefaultViewsRegister } from './app/default-views';
import { Loader } from './loader';
import { ShellI18nextProvider } from './shell-i18n-provider';
import { ThemeProvider } from './theme-provider';
import { IS_FOCUS_MODE } from '../constants';
import { NotificationPermissionChecker } from '../notification/NotificationPermissionChecker';
import ShellView from '../shell/shell-view';
import { useAppStore } from '../store/app/store';
import { TrackerProvider } from '../tracker/provider';

const FocusModeListener = (): null => {
	const { route } = useParams<{ route?: string }>();
	useEffect(() => {
		if (route) useAppStore.setState({ focusMode: route });
	}, [route]);
	return null;
};

const Bootstrapper = (): React.JSX.Element => (
	<ThemeProvider>
		<ShellI18nextProvider>
			<TrackerProvider>
				<SnackbarManager>
					<Loader />
					{IS_FOCUS_MODE && (
						<Routes>
							<Route path={'/:route/*'} element={<FocusModeListener />} />
						</Routes>
					)}
					<DefaultViewsRegister />
					<NotificationPermissionChecker />
					<AppLoaderMounter />
					<ShellView />
				</SnackbarManager>
			</TrackerProvider>
		</ShellI18nextProvider>
	</ThemeProvider>
);

export default Bootstrapper;
