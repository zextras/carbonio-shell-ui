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

import React, { useMemo } from 'react';
import { Route, Switch } from 'react-router-dom';
import styled from 'styled-components';
import { map } from 'lodash';
import { Container } from '@zextras/zapp-ui';
import AppContextProvider from '../boot/app/app-context-provider';
import { useApps } from '../store/app/hooks';
import { SEARCH_APP_ID, SETTINGS_APP_ID } from '../constants';
import { SearchAppView } from '../search/search-app-view';
import { SettingsAppView } from '../settings/settings-app-view';

const _BoardsRouterContainer = styled(Container)`
	flex-grow: 1;
	flex-basis: 0;
	min-width: 1px;
	max-height: calc(100vh - 48px);
	overflow-y: auto;
`;

export default function AppViewContainer() {
	const apps = useApps();
	const routes = useMemo(
		() => [
			...map(apps, (app, appId) =>
				app.views?.app ? (
					<Route key={appId} path={`/${app.core.route}`}>
						<AppContextProvider key={appId} pkg={appId}>
							<app.views.app />
						</AppContextProvider>
					</Route>
				) : null
			),
			<Route key={SEARCH_APP_ID} path={`/${SEARCH_APP_ID}`}>
				<SearchAppView />
			</Route>,
			<Route key={SETTINGS_APP_ID} path={`/${SETTINGS_APP_ID}`}>
				<SettingsAppView />
			</Route>
		],
		[apps]
	);

	return (
		<_BoardsRouterContainer>
			<Container mainAlignment="flex-start">
				<Switch>{routes}</Switch>
			</Container>
		</_BoardsRouterContainer>
	);
}
