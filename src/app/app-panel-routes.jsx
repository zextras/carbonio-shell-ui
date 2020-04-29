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

import React, { Suspense } from 'react';
import { reduce } from 'lodash';
import { Route } from 'react-router-dom';
import LoadingView from '../bootstrap/loading-view';
import { useBehaviorSubject } from '../shell/hooks';
import AppContextProvider from './app-context-provider';

function AppPanelRoute({ route, pkg }) {
	const RouteView = route.view;
	return (
		<Route exact path={`/${pkg.package}${route.route}`}>
			<Suspense fallback={<LoadingView />}>
				<RouteView />
			</Suspense>
		</Route>
	);
}

export default function AppPanelRoutes({ app }) {
	const routes = useBehaviorSubject(app.routes);
	const children = reduce(
		routes,
		(r, v, k) => {
			r.push((
				<AppPanelRoute key={v.route} pkg={app.pkg} route={v} />
			));
			return r;
		},
		[]
	);

	return (
		<AppContextProvider pkg={app.pkg}>
			{ children }
		</AppContextProvider>
	);
}
