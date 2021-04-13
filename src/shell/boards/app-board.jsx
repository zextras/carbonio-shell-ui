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
import React, { Suspense, useContext, useEffect, useMemo, useState } from 'react';
import { Route, Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import styled from 'styled-components';
import { reduce } from 'lodash';
import { combineLatest } from 'rxjs';
import { map as rxMap } from 'rxjs/operators';
import { useAppsCache } from '../../app/app-loader-context';
import LoadingView from '../../bootstrap/loading-view';
import AppContextProvider from '../../app/app-context-provider';
import { BoardValueContext, BoardSetterContext } from './board-context';

// eslint-disable-next-line
const _container = styled.div`
	display: ${(props) => (props.show ? 'block' : 'none')};
	height: 100%;
	width: 100%;
	overflow-y: auto;
`;

export default function AppBoard({ idx }) {
	const { boards, currentBoard } = useContext(BoardValueContext);
	const { updateBoard } = useContext(BoardSetterContext);
	const { cache } = useAppsCache();
	const [routes, setRoutes] = useState([]);

	useEffect(() => {
		const subscription = combineLatest(
			reduce(
				cache,
				(acc, app) => {
					acc.push(app.routes.pipe(rxMap((appRoutes) => ({ appRoutes, app }))));
					return acc;
				},
				[]
			)
		).subscribe((allAppRoutes) => {
			setRoutes(
				reduce(
					allAppRoutes,
					(acc, { appRoutes, app }) => {
						reduce(
							appRoutes,
							(r, appRoute) => {
								const RouteView = appRoute.view;
								r.push(
									<Route
										key={`${app.pkg.package}|${appRoute.route}`}
										exact
										path={`/${app.pkg.package}${appRoute.route}`}
									>
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
		});

		return () => {
			if (subscription) {
				subscription.unsubscribe();
			}
		};
	}, [cache]);

	const history = useMemo(() => createMemoryHistory(), []);
	// eslint-disable-next-line
	useEffect(() => {
		return history.listen((l, a) => {
			updateBoard(idx, `${l.pathname}${l.search}${l.hash}`);
		});
	}, [history, idx, updateBoard]);

	useEffect(() => {
		const l = history.location;
		if (`${l.pathname}${l.search}${l.hash}` !== boards[idx].url) {
			history.push(boards[idx].url);
		}
	}, [history, idx, boards]);

	return (
		// eslint-disable-next-line
		<_container show={currentBoard === idx}>
			<Router key={idx} history={history}>
				{routes}
			</Router>
		</_container>
	);
}
