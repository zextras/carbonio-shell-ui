/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { FC, useMemo } from 'react';
import { Redirect, Route, Switch, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { map, find } from 'lodash';
import { Container } from '@zextras/carbonio-design-system';
import AppContextProvider from '../boot/app/app-context-provider';
import { useAppList, useAppStore, useRoutes } from '../store/app';

const _BoardsRouterContainer = styled(Container)`
	flex-grow: 1;
	flex-basis: 0;
	min-width: 0.0625rem;
	max-height: calc(100vh - 3.75rem);
	overflow-y: auto;
`;

const FirstAppRedirect: FC = () => {
	const apps = useAppList();
	const routes = useRoutes();
	const location = useLocation();
	const mainRoute = useMemo(
		() => find(routes, (r) => apps[0]?.name === r.app)?.route,
		[apps, routes]
	);
	return mainRoute && location?.pathname === '/' ? (
		<Redirect exact strict from="/" to={`/${mainRoute}`} />
	) : null;
};

const AppViewContainer: FC = () => {
	const appViews = useAppStore((s) => s.views.appView);
	const routes = useMemo(
		() => [
			...map(appViews, (view) => (
				<Route key={view.id} path={`/${view.route}`}>
					<AppContextProvider key={view.app} pkg={view.app}>
						<view.component />
					</AppContextProvider>
				</Route>
			))
		],
		[appViews]
	);

	return (
		<_BoardsRouterContainer>
			<Container mainAlignment="flex-start">
				<Switch>{routes}</Switch>
				<FirstAppRedirect />
			</Container>
		</_BoardsRouterContainer>
	);
};

export default AppViewContainer;
