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
import { useApps } from '../app-store/hooks';
import { SETTINGS_APP_ID } from '../constants';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import AppContextProvider from '../app/app-context-provider';
import { Spinner } from '../shell/spinner';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const GeneralSettings = lazy(() => import('./general-settings'));

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

export const SettingsAppView: FC = () => {
	const apps = useApps();
	const routes = useMemo(
		() =>
			map(apps, (app, appId) =>
				app.views?.settings ? (
					<Route key={appId} exact path={`/${SETTINGS_APP_ID}/${appId}`}>
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
		<Switch>
			<Route key={SETTINGS_APP_ID} exact path={`/${SETTINGS_APP_ID}`}>
				<Suspense fallback={<Spinner />}>
					<GeneralSettings />
				</Suspense>
			</Route>
			{routes}
		</Switch>
	);
};
