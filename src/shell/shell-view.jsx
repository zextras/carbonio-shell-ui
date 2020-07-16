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

import React, { useCallback, useState } from 'react';
import { Row, extendTheme, ThemeProvider, Responsive } from '@zextras/zapp-ui';
import { useHistory } from 'react-router-dom';
import PanelsRouterContainer from './panels/panels-router-container';
import AppLoaderContextProvider from '../app/app-loader-context-provider';
import ShellContextProvider from './shell-context-provider';
import SharedUiComponentsContextProvider
	from '../shared-ui-components/shared-ui-components-context-provider';
import { useShellDb, useShellNetworkService } from '../bootstrap/bootstrapper-context';
import { useTranslation } from '../i18n/hooks';
import ShellHeader from './shell-header';
import ShellNavigationBar from './shell-navigation-bar';
import ShellMenuPanel from './shell-menu-panel';
import AppPanelWindow from './panels/app-panel-window';

export default function ShellView() {
	return (
		<ThemeProvider theme={extendTheme({ palette: {light: {}, dark: {}}})}>
			<ShellContextProvider>
				<AppLoaderContextProvider>
					<SharedUiComponentsContextProvider>
						<Shell />
					</SharedUiComponentsContextProvider>
				</AppLoaderContextProvider>
			</ShellContextProvider>
		</ThemeProvider>
	);
}

export function Shell() {
	const db = useShellDb();
	const history = useHistory();
	const network = useShellNetworkService();

	const [userOpen, setUserOpen] = useState(false);
	const [navOpen, setNavOpen] = useState(true);
	const [mobileNavOpen, setMobileNavOpen] = useState(false);
	const { t } = useTranslation();

	const doLogout = useCallback((ev) => {
		ev.preventDefault();
		db.accounts.clear()
			.then(() => network.doLogout())
			.then( () => history.push({ pathname: '/' }));
	}, [db, network, history]);

	const quota = 30;
	const userMenuTree = [
		{
			label: t('Logout'),
			icon: 'LogOut',
			folders: [],
			click: doLogout
		}
	];

	return (
		<>
			<ShellHeader
				userBarIsOpen={userOpen}
				mobileNavIsOpen={mobileNavOpen}
				onMobileMenuClick={() => setMobileNavOpen(!mobileNavOpen)}
				onUserClick={() => setUserOpen(!userOpen)}
				quota={quota}
			/>
			<Row crossAlignment="unset" flexGrow="1" style={{position: 'relative'}}>
				<ShellNavigationBar
					navigationBarIsOpen={navOpen}
					mobileNavIsOpen={mobileNavOpen}
					onCollapserClick={() => setNavOpen(!navOpen)}
					userMenuTree={userMenuTree}
					quota={quota}
				/>
				<PanelsRouterContainer />
				<ShellMenuPanel menuIsOpen={userOpen} tree={userMenuTree} />
			</Row>
			<Responsive mode="desktop">
				<AppPanelWindow />
			</Responsive>
		</>
	);
}
