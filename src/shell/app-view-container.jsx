/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useMemo } from 'react';
import { Route, Switch } from 'react-router-dom';
import styled from 'styled-components';
import { map } from 'lodash';
import { Container } from '@zextras/carbonio-design-system';
import AppContextProvider from '../boot/app/app-context-provider';
import { useAppStore } from '../store/app/store';

const _BoardsRouterContainer = styled(Container)`
	flex-grow: 1;
	flex-basis: 0;
	min-width: 1px;
	max-height: calc(100vh - 60px);
	overflow-y: auto;
`;

export default function AppViewContainer() {
	const appViews = useAppStore((s) => s.views.appViews);
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
			</Container>
		</_BoardsRouterContainer>
	);
}
