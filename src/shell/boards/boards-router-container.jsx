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

import React, { Suspense, useEffect, useState } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { reduce, forEach, minBy, filter } from 'lodash';
import { combineLatest } from 'rxjs';
import { map as rxMap } from 'rxjs/operators';
import { Container } from '@zextras/zapp-ui';
import { useAppsCache } from '../../app/app-loader-context';
import LoadingView from '../../bootstrap/loading-view';
import AppContextProvider from '../../app/app-context-provider';

const _BoardsRouterContainer = styled(Container)`
	flex-grow: 1;
	flex-basis: 0;
	min-width: 1px;
	max-height: calc(100vh - 48px);
	overflow-y: auto;
`;

export default function BoardsRouterContainer() {
	const { cache, loaded } = useAppsCache();
	const [routes, setRoutes] = useState([]);
	const [mainRoute, setMainRoute] = useState();
	const history = useHistory();
	useEffect(() => {
		let timedRouting;
		if (loaded && history.location.pathname === '/' && mainRoute) {
			timedRouting = setTimeout(() => history.push(mainRoute), 500);
		}
		return () => {
			if (timedRouting) {
				clearTimeout(timedRouting);
			}
		}
	}, [history, loaded, mainRoute])
	useEffect(() => {
		const subscriptions = [
			combineLatest(
				reduce(
					cache,
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
										const RouteView = appRoute.view;
										r.push(
											<Route key={`${app.pkg.package}|${appRoute.route}`} exact path={`/${app.pkg.package}${appRoute.route}`}>
												<Suspense fallback={<LoadingView />}>
													<AppContextProvider key={app.pkg.package} pkg={app.pkg}>
														<RouteView />
													</AppContextProvider>
												</Suspense>
											</Route>
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
				}),
			combineLatest(
				reduce(
					cache,
					(acc, app) => {
						acc.push(
							app.mainMenuItems.pipe(
								rxMap((mainRoutes) => ({ mainRoutes, app }))
							)
						);
						return acc;
					},
					[]
				)
			)
				.subscribe((allMainRoutes) => {
					const fastest = minBy(
						filter(
							allMainRoutes,
							({ mainRoutes }) => mainRoutes.length > 0
						),
						({ app }) => app.pkg.priority
					);
					if (fastest) {
						const route = `${fastest?.app?.pkg?.package}${fastest?.mainRoutes?.[0].to}`;
						setMainRoute(
							route
						);
					}
				}),
		];
		return () => {
			if (subscriptions && subscriptions.length > 0) {
				forEach(subscriptions, (s) => s.unsubscribe());
			}
		};
	}, [cache]);

	return (
		<_BoardsRouterContainer>
			<Switch>
				{ routes }
			</Switch>
		</_BoardsRouterContainer>
	);
}
