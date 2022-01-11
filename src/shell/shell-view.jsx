/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
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
import { useAppStore } from '../store/app/store';
import AppContextProvider from '../boot/app/app-context-provider';
import { useUserAccount, useUserSettings } from '../store/account/hooks';
import { useAccountStore } from '../store/account/store';
import { CHATS_APP_ID } from '../constants';

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
	return account && first ? <Redirect from="/" to={`/${first?.core?.route}`} /> : null;
};

export function Shell() {
	const [chatPanelMode, setChatPanelMode] = useState('closed'); // values: 'closed', 'overlap', 'open'
	const [navOpen, setNavOpen] = useState(true);
	const [mobileNavOpen, setMobileNavOpen] = useState(false);
	const ChatsViews = useAppStore((state) => state.apps[CHATS_APP_ID]?.views?.chatbar);

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
				{ChatsViews && <ChatsViews.icon mode={chatPanelMode} setMode={setChatPanelMode} />}
			</ShellHeader>
			<Row crossAlignment="unset" style={{ position: 'relative', flexGrow: '1' }}>
				<ShellNavigationBar
					navigationBarIsOpen={navOpen}
					mobileNavIsOpen={mobileNavOpen}
					onCollapserClick={() => setNavOpen(!navOpen)}
				/>
				<AppViewContainer />
				{ChatsViews && (
					<AppContextProvider pkg={CHATS_APP_ID}>
						<ShellMenuPanel mode={chatPanelMode} setMode={setChatPanelMode}>
							<ChatsViews.sidebar mode={chatPanelMode} setMode={setChatPanelMode} />
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
