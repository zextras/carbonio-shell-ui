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

import React, { FC, ReactElement, useContext, useEffect, useRef, useState } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { Subscription } from 'rxjs';
import { forOwn } from 'lodash';

import RouterContext from './RouterContext';
import { IRouteData } from "./IRouterService";
import I18nContextProvider from '../i18n/I18nContextProvider';
import { II18nService } from '../i18n/II18nService';

interface IRouterProps {
	i18nSrvc: II18nService;
	contentClass: string;
	toolbarClass: string;
}

const Router: FC<IRouterProps> = ({ contentClass, toolbarClass, i18nSrvc, children }) => {
	const [routeData, setRouteData] = useState<IRouteData>({});
	const routerCtx = useContext(RouterContext);
	const routeDataSubRef = useRef<Subscription>();

	useEffect(() => {
		routeDataSubRef.current = routerCtx.routes.subscribe(setRouteData);

		return (): void => {
			if (routeDataSubRef.current) {
				routeDataSubRef.current.unsubscribe();
				routeDataSubRef.current = undefined;
			}
		};
	}, [routerCtx.routes]);

	const routes: Array<ReactElement> = [];
	forOwn(
		routeData,
		(v, k) => {
			routes.push(
				<Route
					key={`${k}-route`}
					path={k}
					component={() =>
						<I18nContextProvider i18nService={i18nSrvc} namespace={routeData[k].pkgName}>
							<v.component key={k} {...v.defProps}/>
						</I18nContextProvider>
					}
				/>
			)
		}
	);

	return (
		<BrowserRouter>
			{ children }
			<main className={contentClass}>
				<div className={toolbarClass} />
				{ routes }
			</main>
		</BrowserRouter>
	);
};
export default Router;
