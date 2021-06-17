/*
 * *** BEGIN LICENSE BLOCK *****
 * Copyright (C) 2011-2020 Zextras
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
import { useAppList } from '../app-store/hooks';

const _BoardsRouterContainer = styled(Container)`
	flex-grow: 1;
	flex-basis: 0;
	min-width: 1px;
	max-height: calc(100vh - 48px);
	overflow-y: auto;
`;

export default function AppViewContainer() {
	const apps = useAppList();
	const routes = useMemo(
		() =>
			map(apps, (app) => (
				<Route key={app.core.package} path={`/${app.core.package}`}>
					<AppContextProvider key={app.core.package} pkg={app.core.package}>
						<app.views.app />
					</AppContextProvider>
				</Route>
			)),
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
