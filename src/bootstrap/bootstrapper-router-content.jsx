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
import { Redirect, Route, Switch } from 'react-router-dom';
import LoadingView from './loading-view';
import { LazyLoginView, LazyLogoutView, LazyShellView } from './bootstrapper-lazy-loader';

export default function BootstrapperRouterContent({ accounts }) {
	return (
		<Suspense fallback={<LoadingView />}>
			<Switch>
				<Route
					path="/login"
					exact
					render={({ location }) =>
						accounts.length > 0 ? (
							<Redirect
								to={{
									pathname: '/',
									state: { from: location }
								}}
							/>
						) : (
							<LazyLoginView />
						)
					}
				/>
				<Route
					path="/logout"
					exact
					render={({ location }) =>
						accounts.length > 0 ? (
							<LazyLogoutView />
						) : (
							<Redirect
								to={{
									pathname: '/login',
									state: { from: location }
								}}
							/>
						)
					}
				/>
				<Route
					path="*"
					render={({ location }) =>
						accounts.length > 0 ? (
							<LazyShellView />
						) : (
							<Redirect
								to={{
									pathname: '/login',
									state: { from: location }
								}}
							/>
						)
					}
				/>
			</Switch>
		</Suspense>
	);
}
