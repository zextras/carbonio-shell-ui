/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { FC, useMemo } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { map } from 'lodash';
import { SETTINGS_APP_ID } from '../constants';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import AppContextProvider from '../boot/app/app-context-provider';
import { useAppStore } from '../store/app';

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
		<Switch>
			{routes}
			<Redirect from={`/${SETTINGS_APP_ID}`} exact strict to={`/${SETTINGS_APP_ID}/general`} />
		</Switch>
	);
};
