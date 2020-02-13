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
import { createGlobalStyle } from 'styled-components';
import { forOwn, forEach } from 'lodash';
import { BrowserRouter, Route, useRouteMatch } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { Header, Container, NavigationPanel, MenuPanel } from '@zextras/zapp-ui';
import { render } from 'react-dom';
import { hot } from 'react-hot-loader/root';

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
import ScreenSizeContextProvider from './screenSize/ScreenSizeContextProvider';
import FiberChannelContextProvider from './fc/FiberChannelContextProvider';
import ThemeContextProvider from './theme/ThemeContextProvider';
import ThemeService from './theme/ThemeService';
import NetworkService from './network/NetworkService';
import IdbService from './idb/IdbService';
import { SyncService } from './sync/SyncService';
import SyncContextProvider from './sync/SyncContextProvider';
import I18nService from './i18n/I18nService';
import I18nContextProvider from './i18n/I18nContextProvider';
import I18nContext from './i18n/I18nContext';
import RouterContext from './router/RouterContext';
import { ServiceWorkerService } from './serviceworker/ServiceWorkerService';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
  }
`;

function useObservable(observable) {
	const [value, setValue] = useState(observable.value);
	useEffect(() => {
		const sub = observable.subscribe(setValue);
		return () => sub.unsubscribe();
	}, [observable]);
	return value;
}

const _RouteDetector = ({ pkg }) => {
	const routerCtx = useContext(RouterContext);
	const match = useRouteMatch();
	useEffect(
		() => {
			if (match.isExact) routerCtx.currentRoute.next(pkg);
		},
		[ pkg, match, routerCtx ]
	);
	return null;
};

const buildTree = (folders, history) => {
	if (folders && folders.length > 0) {
		const newFolders = [];
		forEach(folders, folder => {
			newFolders.push({
				label: folder.label,
				click: () => history.push(folder.to),
				icon: folder.icon,
				subfolders: buildTree(folder.children, history)
			});
		});
		return newFolders;
	} else return [];
};

const Shell = hot(({ i18nService }) => {
	const [ userOpen, setUserOpen ] = useState(false);
	const [ navOpen, setNavOpen ] = useState(true);
	const sessionCtx = useContext(SessionContext);
	const { t } = useContext(I18nContext);
	const history = useHistory();
	const [ routeData, setRouteData ] = useState({});
	const routeDataSubRef = useRef();

	const routerCtx = useContext(RouterContext);
	const currentApp = useObservable(routerCtx.currentRoute);
	const menuTree = [
		{
			label: t('login.logout', 'Logout'),
			icon: 'LogOut',
			folders: [],
			click: sessionCtx.doLogout
		}
	];

	// Creation Button
	const registeredCreateActions = useObservable(routerCtx.createMenuItems);
	const [createActions, setCreateActions] = useState([]);
	useEffect(() => {
		const newCreateActions = [];
		forEach(registeredCreateActions, action => {
			newCreateActions.push({
				label: action.label,
				icon: action.icon,
				click: () => history.push(action.to)
			});
		});
		setCreateActions(newCreateActions);
	}, [registeredCreateActions, history]);

	// Sidebar
	const mainMenuItems = useObservable(routerCtx.mainMenuItems);
	const [navTree, setNavTree] = useState([]);
	useEffect(() => {
		const newNavTree = [];
		forEach(mainMenuItems, item => {
			newNavTree.push({
				app: item.app,
				label: item.label,
				icon: item.icon,
				click: () => history.push(item.to),
				folders: buildTree(item.children, history)
			});
		});
		setNavTree(newNavTree);
	}, [ history, mainMenuItems]	);

	// Router
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
								<I18nContextProvider i18nService={ i18nService } namespace={ routeData[k].pkgName }>
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
			<Header
				navigationBarIsOpen={navOpen}
				onMenuClick={() => setNavOpen(!navOpen)}
				onUserClick={() => setUserOpen(!userOpen)}
				quota={50}
				userBarIsOpen={userOpen}
				createItems={createActions}
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
				<NavigationPanel
					navigationBarIsOpen={navOpen}
					menuTree={menuTree}
					onCollapserClick={() => setNavOpen(!navOpen)}
					tree={navTree}
					quota={50}
					selectedApp={currentApp}
				/>
					<Container
						height="calc(100vh - 48px)"
						width="fill"
						style={
							{
								overflowY: 'auto'
							}
						}
					>
						{ routes }
					</Container>
				<MenuPanel menuIsOpen={userOpen} tree={menuTree}/>
			</Container>
		</Container>
	);
});

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
	const sessionSrvc = new SessionService(networkSrvc, idbSrvc);
	const screenSizeSrvc = new ScreenSizeService();
	const routerSrvc = new RouterService();
	const offlineSrvc = new OfflineService();
	const i18nSrvc = new I18nService();
	const syncSrvc = new SyncService(
		fiberChannelSrvc,
		idbSrvc,
		serviceWorkerService
	);
	const extensionSrvc = new ExtensionService(
		fiberChannelSrvc,
		routerSrvc,
		networkSrvc,
		idbSrvc,
		offlineSrvc,
		sessionSrvc,
		syncSrvc,
		i18nSrvc,
		serviceWorkerService
	);
	const themeSrvc = new ThemeService(networkSrvc, sessionSrvc);
	render(
		(
			<FiberChannelContextProvider fiberChannelService={ fiberChannelSrvc }>
				<SessionContextProvider sessionService={ sessionSrvc }>
					<RouterContextProvider routerService={ routerSrvc }>
						<OfflineContextProvider offlineService={ offlineSrvc }>
							<ScreenSizeContextProvider screenSizeService={ screenSizeSrvc }>
								<SyncContextProvider syncService={ syncSrvc }>
									<ThemeContextProvider themeService={ themeSrvc }>
										<I18nContextProvider i18nService={ i18nSrvc } namespace={ 'com_zextras_zapp_shell' }>
											<BrowserRouter>
												<Shell i18nService={ i18nSrvc }/>
											</BrowserRouter>
										</I18nContextProvider>
									</ThemeContextProvider>
								</SyncContextProvider>
							</ScreenSizeContextProvider>
						</OfflineContextProvider>
					</RouterContextProvider>
				</SessionContextProvider>
			</FiberChannelContextProvider>
		),
		container
	);
	sessionSrvc.init().then(() => undefined);
}
