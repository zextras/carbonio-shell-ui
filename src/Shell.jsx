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

import React, { useContext, useEffect, useRef, useState, useMemo } from 'react';
import { createGlobalStyle } from 'styled-components';
import { forOwn } from 'lodash';
import { BrowserRouter, Route, useRouteMatch } from 'react-router-dom';
import { Container, MenuPanel, Catcher } from '@zextras/zapp-ui';
import { render } from 'react-dom';

import LoginPage from './view/LoginPage';
import SessionService from './session/SessionService';
import RouterService from './router/RouterService';
import OfflineService from './offline/OfflineService';
import ScreenSizeService from './screenSize/ScreenSizeService';
import ExtensionService from './extension/ExtensionService';
import FiberChannelService from './fc/FiberChannelService';
import SessionContext from './session/SessionContext';
import SessionContextProvider from './session/SessionContextProvider';
import RouterContextProvider from './router/RouterContextProvider';
import OfflineContextProvider from './offline/OfflineContextProvider';
import FiberChannelContextProvider from './fc/FiberChannelContextProvider';
import ThemeContextProvider from './theme/ThemeContextProvider';
import ThemeService from './theme/ThemeService';
import NetworkService from './network/NetworkService';
import IdbService from './idb/IdbService';
import { SyncService } from './sync/SyncService';
import I18nService from './i18n/I18nService';
import I18nContextProvider from './i18n/I18nContextProvider';
import I18nContext from './i18n/I18nContext';
import RouterContext from './router/RouterContext';
import { ServiceWorkerService } from './serviceworker/ServiceWorkerService';
import { ItemActionService } from './itemActions/ItemActionService';
import { ItemActionContextProvider } from './itemActions/ItemActionContext';
import ShellNavigationPanel from './view/ShellNavigationPanel';
import ShellHeader from './view/ShellHeader';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
  }
`;

function _RouteDetector({ pkg }) {
	const routerCtx = useContext(RouterContext);
	const match = useRouteMatch();
	useEffect(
		() => {
			console.log('------PKG',pkg);
			if (match.isExact) routerCtx.currentRoute.next(pkg);
		},
		[ pkg, match, routerCtx ]
	);
	return null;
}

function Shell({ i18nService }) {
	const [userOpen, setUserOpen] = useState(false);
	const [navOpen, setNavOpen] = useState(true);
	const sessionCtx = useContext(SessionContext);
	const { t } = useContext(I18nContext);
	const [routeData, setRouteData] = useState({});
	const routeDataSubRef = useRef();

	const routerCtx = useContext(RouterContext);
	const menuTree = [
		{
			label: t('login.logout', 'Logout'),
			icon: 'LogOut',
			folders: [],
			click: sessionCtx.doLogout
		}
	];

	// Router
	useEffect(() => {
		routeDataSubRef.current = routerCtx.routes.subscribe(setRouteData);
		return () => {
			if (routeDataSubRef.current) {
				routeDataSubRef.current.unsubscribe();
				routeDataSubRef.current = undefined;
			}
		};
	}, [routerCtx.routes]);

	const routes = useMemo(
		() => {
			const temp = [];
			forOwn(
				routeData,
				(v, k) => {
					temp.push(
						<Route
							key={`${k}-route`}
							path={k}
							component={
								() => (
										<I18nContextProvider key={`${k}-i18n`} i18nService={i18nService} namespace={routeData[k].pkgName}>
											<_RouteDetector pkg={routeData[k].pkgName}/>
											<Catcher>
												<v.component key={k} {...v.defProps}/>
											</Catcher>
										</I18nContextProvider>
									)
							}
						/>
					);
				}
			);
			return temp;
		},
		[routeData]
	);

	// -----

	if (!sessionCtx.isLoggedIn) {
		return (
			<>
				<GlobalStyle/>
				<LoginPage/>
			</>
		);
	}
	return (
		<Container
			height="fill"
			width="fill"
			orientation="vertical"
		>
			<GlobalStyle/>
			<ShellHeader
				navigationBarIsOpen={navOpen}
				onMenuClick={() => setNavOpen(!navOpen)}
				onUserClick={() => setUserOpen(!userOpen)}
				userBarIsOpen={userOpen}
			/>
			<Container
				orientation="horizontal"
				width="fill"
				height="fill"
				mainAlignment="space-between"
				style={
					{
						position: 'relative',
					}
				}
			>
				<ShellNavigationPanel
					navigationBarIsOpen={navOpen}
					menuTree={menuTree}
					onCollapserClick={() => setNavOpen(!navOpen)}
					quota={50}
				/>
				<Container
					height="calc(100vh - 48px)"
					width="fill"
					style={{
							overflowY: 'auto'
					}}
				>
					{routes}
				</Container>
				<MenuPanel menuIsOpen={userOpen} tree={menuTree}/>
			</Container>
		</Container>
	);
}

export function loadShell(container) {
	const fiberChannelSrvc = new FiberChannelService();
	const serviceWorkerService = new ServiceWorkerService(
		fiberChannelSrvc,
	);
	const idbSrvc = new IdbService();
	const networkSrvc = new NetworkService(
		fiberChannelSrvc.getInternalFCSink(),
		idbSrvc
	);
	const sessionSrvc = new SessionService(
		networkSrvc,
		idbSrvc,
		fiberChannelSrvc
	);
	const screenSizeSrvc = new ScreenSizeService();
	const routerSrvc = new RouterService();
	const offlineSrvc = new OfflineService();
	const i18nSrvc = new I18nService();
	const syncSrvc = new SyncService(
		fiberChannelSrvc,
		idbSrvc,
	);
	const itemActionSrvc = new ItemActionService();
	const extensionSrvc = new ExtensionService(
		fiberChannelSrvc,
		routerSrvc,
		networkSrvc,
		idbSrvc,
		offlineSrvc,
		sessionSrvc,
		syncSrvc,
		i18nSrvc,
		itemActionSrvc
	);
	const themeSrvc = new ThemeService(networkSrvc, sessionSrvc);
	render(
		(
			<FiberChannelContextProvider fiberChannelService={ fiberChannelSrvc }>
				<SessionContextProvider sessionService={ sessionSrvc }>
					<RouterContextProvider routerService={ routerSrvc }>
						<OfflineContextProvider offlineService={ offlineSrvc }>
							{/*<ScreenSizeContextProvider screenSizeService={ screenSizeSrvc }>*/}
								{/*<SyncContextProvider syncService={ syncSrvc }>*/}
									<ThemeContextProvider themeService={ themeSrvc }>
										<I18nContextProvider i18nService={ i18nSrvc } namespace={PACKAGE_NAME}>
											<ItemActionContextProvider itemActionSrvc={itemActionSrvc}>
												<BrowserRouter>
													<Shell i18nService={ i18nSrvc }/>
												</BrowserRouter>
											</ItemActionContextProvider>
										</I18nContextProvider>
									</ThemeContextProvider>
							{/*</SyncContextProvider>*/}
						{/*</ScreenSizeContextProvider>*/}
						</OfflineContextProvider>
					</RouterContextProvider>
				</SessionContextProvider>
			</FiberChannelContextProvider>
		),
		container
	);
	sessionSrvc.init().then(() => undefined);
}
