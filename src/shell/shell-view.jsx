/*
 * *** BEGIN LICENSE BLOCK *****
 * Copyright (C) 2011-2021 Zextras
 *
 *  The contents of this file are subject to the Zextras EULA;
 * you may not use this file except in compliance with the EULA.
 * You may obtain a copy of the EULA at
 * http://www.zextras.com/zextras-eula.html
 * *** END LICENSE BLOCK *****
 */

import React, { useEffect, useMemo, useState, useContext } from 'react';
import { Row, Responsive, ModalManager, SnackbarManager } from '@zextras/zapp-ui';
import { Redirect } from 'react-router-dom';
import styled from 'styled-components';
import { find, filter } from 'lodash';
import AppViewContainer from './app-view-container';
import ShellContextProvider from './shell-context-provider';
import ShellHeader from './shell-header';
import ShellNavigationBar from './shell-navigation-bar';
import ShellMenuPanel from './shell-menu-panel';
import AppBoardWindow from './boards/app-board-window';
import { ThemeCallbacksContext } from '../boot/theme-provider';

import { useAppList } from '../store/app/hooks';
import { useAppStore } from '../store/app';
import AppContextProvider from '../boot/app/app-context-provider';
import { useUserAccount, useUserSettings } from '../store/account/hooks';
import { useAccountStore } from '../store/account/account-store';

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

function DarkReaderListener() {
	const { setDarkReaderState } = useContext(ThemeCallbacksContext);
	const settings = useUserSettings();
	useEffect(() => {
		const darkreaderState =
			find(settings?.props ?? [], ['name', 'zappDarkreaderMode'])?._content ?? 'auto';
		setDarkReaderState(darkreaderState);
	}, [setDarkReaderState, settings]);
	return null;
}

const MainAppRerouter = () => {
	const account = useUserAccount();
	const apps = useAppList();
	const first = useMemo(() => filter(apps, (app) => !!app.views?.app)[0], [apps]);
	return account && first ? <Redirect from="/" to={`/${first?.core?.package}`} /> : null;
};

export function Shell() {
	const [chatPanelMode, setChatPanelMode] = useState('closed'); // values: 'closed', 'overlap', 'open'
	const [navOpen, setNavOpen] = useState(true);
	const [mobileNavOpen, setMobileNavOpen] = useState(false);

	useAppStore(console.log);
	useAccountStore(console.log);
	const TeamViews = useAppStore((state) => state.apps.com_zextras_zapp_team?.views?.teambar);

	useEffect(() => {
		setNavOpen((n) => !(n && chatPanelMode === 'open'));
	}, [chatPanelMode]);
	return (
		<Background>
			<DarkReaderListener />
			{/* <MainAppRerouter /> */}
			<ShellHeader
				mobileNavIsOpen={mobileNavOpen}
				onMobileMenuClick={() => setMobileNavOpen(!mobileNavOpen)}
			>
				{TeamViews && <TeamViews.icon mode={chatPanelMode} setMode={setChatPanelMode} />}
			</ShellHeader>
			<Row crossAlignment="unset" flexGrow="1" style={{ position: 'relative' }}>
				<ShellNavigationBar
					navigationBarIsOpen={navOpen}
					mobileNavIsOpen={mobileNavOpen}
					onCollapserClick={() => setNavOpen(!navOpen)}
				/>
				<AppViewContainer />
				{TeamViews && (
					<AppContextProvider pkg="com_zextras_zapp_team">
						<ShellMenuPanel mode={chatPanelMode} setMode={setChatPanelMode}>
							<TeamViews.sidebar mode={chatPanelMode} setMode={setChatPanelMode} />
						</ShellMenuPanel>
					</AppContextProvider>
				)}
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
			<ModalManager>
				<SnackbarManager>
					<Shell />
				</SnackbarManager>
			</ModalManager>
		</ShellContextProvider>
	);
}
