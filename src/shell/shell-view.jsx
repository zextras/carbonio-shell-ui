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

import React, { useCallback, useEffect, useState } from 'react';
import { Row, Responsive } from '@zextras/zapp-ui';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import BoardsRouterContainer from './boards/boards-router-container';
import AppLoaderContextProvider from '../app/app-loader-context-provider';
import ShellThemeProvider from './shell-theme-provider';
import ShellContextProvider from './shell-context-provider';
import SharedUiComponentsContextProvider
	from '../shared-ui-components/shared-ui-components-context-provider';
import BoardContextProvider from './boards/board-context-provider';
import { useTranslation } from '../i18n/hooks';
import ShellHeader from './shell-header';
import ShellNavigationBar from './shell-navigation-bar';
import ShellMenuPanel from './shell-menu-panel';
import AppBoardWindow from './boards/app-board-window';
import AppLoaderMounter from '../app/app-loader-mounter';
import { useDispatch, useSessionState, useUserAccounts } from '../store/shell-store-hooks';
import { verifySession } from '../store/session-slice';
import { doLogout } from '../store/accounts-slice';

export default function ShellView() {
	return (
		<ShellThemeProvider>
			<ShellContextProvider>
				<BoardContextProvider>
					<AppLoaderContextProvider>
						<SharedUiComponentsContextProvider>
							<Shell />
						</SharedUiComponentsContextProvider>
						<AppLoaderMounter />
					</AppLoaderContextProvider>
				</BoardContextProvider>
			</ShellContextProvider>
		</ShellThemeProvider>
	);
}

const Background = styled.div`
	background: ${({ theme }) => theme.palette.gray6.regular};
	display: flex;
	flex-direction: column;
	height: 100%;
	min-height: 100%;
	max-height: 100%;
	width: 100%;
	min-width: 100%;
	max-width: 100%;
`;

export function Shell() {
	const history = useHistory();
	const dispatch = useDispatch();

	const [userOpen, setUserOpen] = useState(false);
	const [navOpen, setNavOpen] = useState(true);
	const [mobileNavOpen, setMobileNavOpen] = useState(false);
	const { t } = useTranslation();

	const accounts = useUserAccounts();
	const sessionState = useSessionState();

	const doLogoutCbk = useCallback((ev) => {
		ev.preventDefault();
		dispatch(
			doLogout()
		)
			.then(() => history.push({ pathname: '/' }));
	}, []);

	const quota = 30;
	const userMenuTree = [
		{
			label: t('Logout'),
			icon: 'LogOut',
			folders: [],
			click: doLogoutCbk
		}
	];

	useEffect(() => {
		if (sessionState === 'init' && accounts.length > 0) {
			dispatch(
				verifySession()
			);
		}
	}, [accounts, sessionState, dispatch]);

	return (
		<Background>
			<ShellHeader
				userBarIsOpen={userOpen}
				mobileNavIsOpen={mobileNavOpen}
				onMobileMenuClick={() => setMobileNavOpen(!mobileNavOpen)}
				onUserClick={() => setUserOpen(!userOpen)}
				quota={quota}
			/>
			<Row crossAlignment="unset" flexGrow="1" style={{ position: 'relative' }}>
				<ShellNavigationBar
					navigationBarIsOpen={navOpen}
					mobileNavIsOpen={mobileNavOpen}
					onCollapserClick={() => setNavOpen(!navOpen)}
					userMenuTree={userMenuTree}
					quota={quota}
				/>
				<BoardsRouterContainer />
				<ShellMenuPanel menuIsOpen={userOpen} tree={userMenuTree} />
			</Row>
			<Responsive mode="desktop">
				<AppBoardWindow />
			</Responsive>
		</Background>
	);
}
