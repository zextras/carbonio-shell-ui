/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useMemo } from 'react';

import styled from '@emotion/styled';
import { Container, Spinner } from '@zextras/carbonio-design-system';
import { map, find } from 'lodash';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

import { AppContextProvider } from '../boot/app/app-context-provider';
import { IS_FOCUS_MODE } from '../constants';
import { useAppList, useAppStore, useRoutes } from '../store/app';

const BoardsRouterContainer = styled(Container)`
	flex-grow: 1;
	flex-basis: 0;
	min-width: 0.0625rem;
	max-height: ${IS_FOCUS_MODE ? '100vh' : 'calc(100vh - 3.75rem)'};
	overflow-y: auto;
`;

const FirstAppRedirect = (): React.ReactNode => {
	const apps = useAppList();
	const routes = useRoutes();
	const location = useLocation();
	const mainRoute = useMemo(
		() => find(routes, (r) => apps[0]?.name === r.app)?.route,
		[apps, routes]
	);
	return mainRoute && location?.pathname === '/' ? <Navigate to={`${mainRoute}`} /> : null;
};

const AppViewContainer = (): React.JSX.Element => {
	const appViews = useAppStore((s) => s.views.appView);
	const routes = useMemo(
		() => [
			...map(appViews, (view) => (
				<Route
					key={view.id}
					path={`${view.route}/*`}
					element={
						<AppContextProvider pkg={view.app}>
							<view.component />
						</AppContextProvider>
					}
				/>
			))
		],
		[appViews]
	);

	return (
		<BoardsRouterContainer>
			<Container mainAlignment="flex-start">
				<Routes>
					{routes}
					<Route path="/*" element={<Spinner color={'gray0'} />} />
					<Route path="/" element={<FirstAppRedirect />} />
				</Routes>
			</Container>
		</BoardsRouterContainer>
	);
};

export default AppViewContainer;
