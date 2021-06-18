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

import React, { useCallback, useEffect, useMemo, useState, useContext } from 'react';
import { Row, Responsive } from '@zextras/zapp-ui';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { find, get } from 'lodash';
import AppViewContainer from './app-view-container';
import ShellContextProvider from './shell-context-provider';
import ShellHeader from './shell-header';
import ShellNavigationBar from './shell-navigation-bar';
import ShellMenuPanel from './shell-menu-panel';
import AppBoardWindow from './boards/app-board-window';
import { ThemeCallbacksContext } from '../bootstrap/shell-theme-context-provider';
import { useDispatch, useSessionState, useUserAccounts } from '../store/shell-store-hooks';
import { verifySession } from '../store/session-slice';
import { doLogout } from '../store/accounts-slice';

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

function DRListener() {
	const { setDarkReaderState } = useContext(ThemeCallbacksContext);
	const [{ settings }] = useUserAccounts();
	useEffect(() => {
		const darkreaderState =
			find(settings?.props ?? [], ['name', 'zappDarkreaderMode'])?._content ?? 'auto';
		setDarkReaderState(darkreaderState);
	}, [setDarkReaderState, settings]);
	return null;
}

export function Shell() {
	const history = useHistory();
	const dispatch = useDispatch();

	const [userOpen, setUserOpen] = useState(false);
	const [navOpen, setNavOpen] = useState(true);
	const [mobileNavOpen, setMobileNavOpen] = useState(false);
	const [t] = useTranslation();

	const accounts = useUserAccounts();
	const sessionState = useSessionState();
	const doLogoutCbk = useCallback(
		(ev) => {
			ev.preventDefault();
			dispatch(doLogout()).then(() => history.push({ pathname: '/' }));
		},
		[dispatch, history]
	);

	const userMenuTree = useMemo(
		() => [
			{
				label: t('logout'),
				icon: 'LogOut',
				onClick: doLogoutCbk
			}
		],
		[doLogoutCbk, t]
	);

	useEffect(() => {
		if (sessionState === 'init' && accounts.length > 0) {
			dispatch(verifySession());
		}
	}, [accounts, sessionState, dispatch]);

	return (
		<Background>
			<DRListener />
			<ShellHeader
				userBarIsOpen={userOpen}
				mobileNavIsOpen={mobileNavOpen}
				onMobileMenuClick={() => setMobileNavOpen(!mobileNavOpen)}
				onUserClick={() => setUserOpen(!userOpen)}
			/>
			<Row crossAlignment="unset" flexGrow="1" style={{ position: 'relative' }}>
				<ShellNavigationBar
					navigationBarIsOpen={navOpen}
					mobileNavIsOpen={mobileNavOpen}
					onCollapserClick={() => setNavOpen(!navOpen)}
					userMenuTree={userMenuTree}
				/>
				<AppViewContainer />
				<ShellMenuPanel menuIsOpen={userOpen} tree={userMenuTree} />
			</Row>
			<Responsive mode="desktop">
				<AppBoardWindow />
			</Responsive>
		</Background>
	);
}

export default function ShellView() {
	return (
		<ShellContextProvider>
			<Shell />
		</ShellContextProvider>
	);
}
