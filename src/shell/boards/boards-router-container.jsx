/*
 * *** BEGIN LICENSE BLOCK *****
 * Copyright (C) 2011-2020 ZeXtras
 *
 * The contents of this file are subject to the ZeXtras EULA;
 * you may not use this file except in compliance with the EULA.
 * You may obtain a copy of the EULA at
 * http://www.zextras.com/zextras-eula.html
 * *** END LICENSE BLOCK *****
 */

import React, { useEffect, useState } from 'react';
import { Switch } from 'react-router-dom';
import styled from 'styled-components';
import { reduce } from 'lodash';
import { combineLatest } from 'rxjs';
import { map as rxMap } from 'rxjs/operators';
import { Container } from '@zextras/zapp-ui';
import { useAppsCache } from '../../app/app-loader-context';
import AppBoardRoute from '../../app/app-board-route';

const _BoardsRouterContainer = styled(Container)`
	flex-grow: 1;
	flex-basis: 0;
	min-width: 1px;
	max-height: calc(100vh - 48px);
	overflow-y: auto;
`;

export default function BoardsRouterContainer() {
	const [appsCache] = useAppsCache();
	const [routes, setRoutes] = useState([]);

	useEffect(() => {
		const subscription = combineLatest(
			reduce(
				appsCache,
				(acc, app) => {
					acc.push(
						app.routes.pipe(
							rxMap((appRoutes) => ({ appRoutes, app }))
						)
					);
					return acc;
				},
				[]
			)
		)
			.subscribe((allAppRoutes) => {
				setRoutes(
					reduce(
						allAppRoutes,
						(acc, { appRoutes, app }) => {
							reduce(
								appRoutes,
								(r, appRoute) => {
									r.push(
										<AppBoardRoute key={appRoute.route} pkg={app.pkg} route={appRoute} />
									);
									return r;
								},
								acc
							);
							return acc;
						},
						[]
					)
				);
			});

		return () => {
			if (subscription) {
				subscription.unsubscribe();
			}
		};
	}, [appsCache, setRoutes]);

	return ( // eslint-disable-next-line
		<_BoardsRouterContainer>
			<Switch>
				{ routes }
			</Switch>
		</_BoardsRouterContainer>
	);
}
