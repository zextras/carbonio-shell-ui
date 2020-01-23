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

import React, { useContext } from 'react';
import { render } from 'react-dom';
import { createStyles, makeStyles, useTheme } from '@material-ui/core/styles';
import { AppBar, CssBaseline, Divider, SwipeableDrawer, Drawer, IconButton, Toolbar, Hidden, Grid } from '@material-ui/core';
import { ChevronLeft, ChevronRight, Menu, Search, ArrowDropDown } from '@material-ui/icons';
import clsx from 'clsx';
import { hot } from 'react-hot-loader/root';
import LoginPage from './view/LoginPage';
import Sidebar from './ui/Sidebar';
import SessionService from './session/SessionService';
import RouterService from './router/RouterService';
import OfflineService from './offline/OfflineService';
import ScreenSizeService from './screenSize/ScreenSizeService';
import ExtensionService from './extension/ExtensionService';
import FiberChannelService from './fc/FiberChannelService';
import SessionContext from './session/SessionContext';
import SessionContextProvider from './session/SessionContextProvider';
import RouterContextProvider from './router/RouterContextProvider';
import Router from './router/Router';
import OfflineContextProvider from './offline/OfflineContextProvider';
import ScreenSizeContextProvider from './screenSize/ScreenSizeContextProvider';
import FiberChannelContextProvider from './fc/FiberChannelContextProvider';
import UserMenu from './ui/UserMenu';
import MainMenu from './router/MainMenu';
import ThemeContextProvider from './theme/ThemeContextProvider';
import ThemeService from './theme/ThemeService';
import NetworkService from './network/NetworkService';
import IdbService from './idb/IdbService';
import { SyncService } from './sync/SyncService';
import SyncContextProvider from './sync/SyncContextProvider';
import SyncStatusIcon from './sync/ui/SyncStatusIcon';
import I18nService from './i18n/I18nService';
import I18nContextProvider from './i18n/I18nContextProvider';
import I18nContext from './i18n/I18nContext';
import { CreateButton } from './ui/CreateButton';
import { ThemeProvider, extendTheme } from '@zextras/zapp-ui';
import { ServiceWorkerService } from './serviceworker/ServiceWorkerService';

const drawerWidth = '75vw';

const useStyles = makeStyles((theme) =>
	createStyles({
		root: {
			display: 'flex',
			height: '100%'
		},
		appBar: {
			zIndex: theme.zIndex.drawer + 1,
			transition: theme.transitions.create([ 'width', 'margin' ], {
				easing: theme.transitions.easing.sharp,
				duration: theme.transitions.duration.leavingScreen
			})
		},
		appBarShift: {
			marginLeft: drawerWidth,
			width: `calc(100% - ${ drawerWidth }px)`,
			transition: theme.transitions.create([ 'width', 'margin' ], {
				easing: theme.transitions.easing.sharp,
				duration: theme.transitions.duration.enteringScreen
			})
		},
		menuButton: {
			marginRight: theme.spacing(2)
		},
		title: {
			flexGrow: 1
		},
		hide: {
			display: 'none'
		},
		drawer: {
			width: drawerWidth,
			flexShrink: 0,
			whiteSpace: 'nowrap'
		},
		drawerOpen: {
			width: drawerWidth,
			transition: theme.transitions.create('width', {
				easing: theme.transitions.easing.sharp,
				duration: theme.transitions.duration.enteringScreen
			})
		},
		drawerClose: {
			transition: theme.transitions.create('width', {
				easing: theme.transitions.easing.sharp,
				duration: theme.transitions.duration.leavingScreen
			}),
			overflowX: 'hidden',
			width: theme.spacing(7)
		},
		toolbar: {
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'flex-end',
			padding: 0,
			...theme.mixins.toolbar
		},
		content: {
			flexGrow: 1,
			height: '100vh'
		},
		logo: {
			height: 36
		},
		creationAndSearchContainer: {
			marginLeft: 192
		},
		creationAndSearchGrid: {
			display: 'flex',
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'flex-start'
		},
		searchInput: {
			backgroundColor: '#fff',
			height: 36,
			width: '100%',
			display: 'flex',
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'space-between',
			padding: theme.spacing(1),
			color: theme.palette.text.disabled,
			'& input': {
				width: '100%',
				border: 'hidden'
			}
		},
		appBarIconsContainer: {
			display: 'flex',
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'flex-end'
		}
	})
);

const Shell = hot(({ i18nService }) => {
	const [ open, setOpen ] = React.useState(false);
	const classes = useStyles();
	const theme = useTheme();
	const sessionCtx = useContext(SessionContext);
	const { t } = useContext(I18nContext);

	if (!sessionCtx.isLoggedIn) {
		return (
			<LoginPage/>
		);
	}

	const handleDrawerOpen = () => {
		setOpen(true);
	};

	const handleDrawerClose = () => {
		setOpen(false);
	};

	const toggleDrawer = (open) => (event) => {
		if (
			event &&
			event.type === 'keydown' &&
			(event.key === 'Tab' || event.key === 'Shift')
		) {
			return;
		}
		setOpen(open);
	};

	return (
		<div className={classes.root}>
			<CssBaseline/>
			<Router
				i18nSrvc={i18nService}
				contentClass={classes.content}
				toolbarClass={classes.toolbar}
			>
				<AppBar
					position="fixed"
					className={clsx(classes.appBar, {
						[classes.appBarShift]: open,
					})}
				>
					<Toolbar>
						<Hidden mdUp>
							<IconButton
								color="inherit"
								aria-label="open drawer"
								onClick={handleDrawerOpen}
								edge="start"
								className={clsx(classes.menuButton, {
									[classes.hide]: open,
								})}
							>
								<Menu/>
							</IconButton>
						</Hidden>
						<img className={classes.logo} src="/asset/logo-zextras.svg" alt="Zextras Logo" />
						<Grid container className={classes.creationAndSearchContainer}>
							<Grid item xs={8} md={6} className={classes.creationAndSearchGrid}>
								<CreateButton i18nSrvc={i18nService} />
								<div className={classes.searchInput}>
									<Search/>
									<input type="text"/>
									<ArrowDropDown />
								</div>
							</Grid>
							<Grid item xs={4} md={6} className={classes.appBarIconsContainer}>
								<SyncStatusIcon />
								<UserMenu />
							</Grid>
						</Grid>
					</Toolbar>
				</AppBar>
				<Hidden mdUp>
					<SwipeableDrawer
						onOpen={toggleDrawer(true)}
						onClose={toggleDrawer(false)}
						variant="temporary"
						className={clsx(classes.drawer, {
							[classes.drawerOpen]: open,
							[classes.drawerClose]: !open,
						})}
						classes={{
							paper: clsx({
								[classes.drawerOpen]: open,
								[classes.drawerClose]: !open,
							}),
						}}
						open={open}
					>
						<div className={classes.toolbar}>
							<IconButton onClick={handleDrawerClose}>
								{theme.direction === 'rtl' ? <ChevronRight/> : <ChevronLeft/>}
							</IconButton>
						</div>
						<Divider/>
						<MainMenu drawerOpen={open}/>
					</SwipeableDrawer>
				</Hidden>
				<Hidden smDown>
					<div>
						<div className={clsx([classes.toolbar])}/>
						<Drawer
							variant="permanent"
							className={clsx([classes.drawer, classes.drawerClose])}
							open={false}
						>
							<div className={classes.toolbar}/>
							<MainMenu drawerOpen={open}/>
						</Drawer>
						<Sidebar/>
					</div>
				</Hidden>
			</Router>
		</div>
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
										<ThemeProvider theme={ extendTheme({}) }>
											<I18nContextProvider i18nService={ i18nSrvc } namespace={ 'com_zextras_zapp_shell' }>
												<Shell i18nService={ i18nSrvc }/>
											</I18nContextProvider>
										</ThemeProvider>
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
