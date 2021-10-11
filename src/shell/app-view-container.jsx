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
import AppContextProvider from '../app/app-context-provider';
import { useApps } from '../app-store/hooks';

const _BoardsRouterContainer = styled(Container)`
	flex-grow: 1;
	flex-basis: 0;
	min-width: 1px;
	max-height: calc(100vh - 60px);
	overflow-y: auto;
`;

export default function AppViewContainer() {
	const apps = useApps();
	const routes = useMemo(
		() =>
			map(apps, (app, appId) =>
				app.views?.app ? (
					<Route key={appId} path={`/${appId}`}>
						<AppContextProvider key={appId} pkg={appId}>
							<app.views.app />
						</AppContextProvider>
					</Route>
				) : null
			),
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
