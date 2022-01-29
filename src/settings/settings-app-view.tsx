/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { FC, Suspense, useMemo, lazy } from 'react';
import { Route, Switch } from 'react-router-dom';
import { map } from 'lodash';
import { SETTINGS_APP_ID } from '../constants';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import AppContextProvider from '../boot/app/app-context-provider';
import { Spinner } from '../ui-extras/spinner';
import { RouteLeavingGuard } from '../ui-extras/nav-guard';
import { useAppStore } from '../store/app';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const GeneralSettings = lazy(() => import('./general-settings'));

export const SettingsAppView: FC = () => {
	const settingsViews = useAppStore((s) => s.views.settings);
	const routes = useMemo(
		() =>
			map(settingsViews, (view) => (
				<Route key={view.route} exact path={`/${SETTINGS_APP_ID}/${view.route}`}>
					<AppContextProvider pkg={view.app}>
						<view.component />
					</AppContextProvider>
				</Route>
			)),
		[settingsViews]
	);
	return (
		<>
			{/* <RouteLeavingGuard
				when
				title={t('settings.leave.title', 'Are you sure you want to leave this page?')}
			>
				<Text>{t('settings.leave.warning', 'Any unsaved change will be lost')}</Text>
			</RouteLeavingGuard> */}
			<Switch>
				<Route key={SETTINGS_APP_ID} exact path={`/${SETTINGS_APP_ID}`}>
					<Suspense fallback={<Spinner />}>
						<GeneralSettings />
					</Suspense>
				</Route>
				{routes}
			</Switch>
		</>
	);
};
