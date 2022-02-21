/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { FC, Suspense, useMemo, lazy } from 'react';
import { Prompt, Route, Switch } from 'react-router-dom';
import { map } from 'lodash';
import { useApps } from '../store/app/hooks';
import { SETTINGS_APP_ID, ACCOUNTS_APP_ID } from '../constants';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import AppContextProvider from '../boot/app/app-context-provider';
import { Spinner } from '../ui-extras/spinner';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore

const GeneralSettings = lazy(() => import('./general-settings'));
const AccountWrapper = lazy(() => import('./account-wrapper'));

export const SettingsAppView: FC = () => {
	const apps = useApps();

	const routes = useMemo(
		() =>
			map(apps, (app, appId) =>
				app.views?.settings ? (
					<Route key={appId} exact path={`/${SETTINGS_APP_ID}/${app.core.route}`}>
						<AppContextProvider pkg={appId}>
							{/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
							{/* @ts-ignore */}
							<app.views.settings />
						</AppContextProvider>
					</Route>
				) : null
			),
		[apps]
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
				<Route key={SETTINGS_APP_ID} exact path={`/${SETTINGS_APP_ID}/${ACCOUNTS_APP_ID}`}>
					<Suspense fallback={<Spinner />}>
						<AccountWrapper />
					</Suspense>
				</Route>
				{routes}
			</Switch>
		</>
	);
};
