/*
 * *** BEGIN LICENSE BLOCK *****
 * Copyright (C) 2011-2021 Zextras
 *
 *  The contents of this file are subject to the Zextras EULA;
 * you may not use this file except in compliance with the EULA.
 * You may obtain a copy of the EULA at
 * http://www.zextras.com/zextras-eula.html
 * *** END LICENSE BLOCK *****
 */

import React, { FC, Suspense, useMemo, lazy } from 'react';
import { Route, Switch } from 'react-router-dom';
import { map } from 'lodash';
import LoadingView from '../bootstrap/loading-view';
import { useAppList } from '../app-store/hooks';
import { SETTINGS_APP_ID } from '../constants';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const GeneralSettings = lazy(() => import('./general-settings'));

export const SettingsAppView: FC = () => {
	const apps = useAppList();
	const routes = useMemo(
		() =>
			map(apps, (app) =>
				app.views?.settings ? (
					<Route key={app.core.package} exact path={`/${SETTINGS_APP_ID}/${app.core.package}`}>
						{/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
						{/* @ts-ignore */}
						<app.views.settings />
					</Route>
				) : null
			),
		[apps]
	);
	console.log(SETTINGS_APP_ID);
	return (
		<Switch>
			<Route key={SETTINGS_APP_ID} exact path={`/${SETTINGS_APP_ID}`}>
				<Suspense fallback={<LoadingView />}>
					<GeneralSettings />
				</Suspense>
			</Route>
			{routes}
		</Switch>
	);
};
