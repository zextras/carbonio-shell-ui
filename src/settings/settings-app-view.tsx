/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useMemo } from 'react';

import { map } from 'lodash';
import { Navigate, Route, Routes } from 'react-router-dom';

import { AppContextProvider } from '../boot/app/app-context-provider';
import { useAppStore } from '../store/app';

export const SettingsAppView = (): React.JSX.Element => {
	const settingsViews = useAppStore((s) => s.views.settings);
	const routes = useMemo(
		() =>
			map(settingsViews, (view) => (
				<Route
					key={view.route}
					path={view.route}
					element={
						<AppContextProvider pkg={view.app}>
							<view.component />
						</AppContextProvider>
					}
				/>
			)),
		[settingsViews]
	);
	return (
		<Routes>
			{routes}
			<Route path="/" element={<Navigate to={'general'} />} />
		</Routes>
	);
};
