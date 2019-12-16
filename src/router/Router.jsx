/*
 * *** BEGIN LICENSE BLOCK *****
 * Copyright (C) 2011-2019 ZeXtras
 *
 * The contents of this file are subject to the ZeXtras EULA;
 * you may not use this file except in compliance with the EULA.
 * You may obtain a copy of the EULA at
 * http://www.zextras.com/zextras-eula.html
 * *** END LICENSE BLOCK *****
 */

import React, { useContext, useEffect, useRef, useState } from 'react';
import { BrowserRouter, Route, useRouteMatch } from 'react-router-dom';
import { forOwn } from 'lodash';
import RouterContext from './RouterContext';
import I18nContextProvider from '../i18n/I18nContextProvider';

const _RouteDetector = ({ pkg }) => {
	const routerCtx = useContext(RouterContext);
	const match = useRouteMatch();
	useEffect(
		() => {
			if (match.isExact) routerCtx.currentRoute.next(pkg);
		},
		[ match, routerCtx ]
	);
	return null;
};

const Router = ({ contentClass, toolbarClass, i18nSrvc, children }) => {
	const [ routeData, setRouteData ] = useState({});
	const routerCtx = useContext(RouterContext);
	const routeDataSubRef = useRef();

	useEffect(() => {
		routeDataSubRef.current = routerCtx.routes.subscribe(setRouteData);

		return () => {
			if (routeDataSubRef.current) {
				routeDataSubRef.current.unsubscribe();
				routeDataSubRef.current = undefined;
			}
		};
	}, [ routerCtx.routes ]);

	const routes = [];
	forOwn(
		routeData,
		(v, k) => {
			routes.push(
				<Route
					key={ `${ k }-route` }
					path={ k }
					component={
						() => {
							return (
								<I18nContextProvider i18nService={ i18nSrvc } namespace={ routeData[k].pkgName }>
									<_RouteDetector pkg={ routeData[k].pkgName }/>
									<v.component key={ k } { ...v.defProps }/>
								</I18nContextProvider>
							);
						}
					}
				/>
			);
		}
	);

	return (
		<BrowserRouter>
			{ children }
			<main className={ contentClass }>
				<div className={ toolbarClass }/>
				{ routes }
			</main>
		</BrowserRouter>
	);
};
export default Router;
