/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useEffect, useState, useContext } from 'react';
import { Row, Responsive, ModalManager, SnackbarManager } from '@zextras/carbonio-design-system';
import styled from 'styled-components';
import { find } from 'lodash';
import AppViewContainer from './app-view-container';
import ShellContextProvider from './shell-context-provider';
import ShellHeader from './shell-header';
import ShellNavigationBar from './shell-navigation-bar';
import AppBoardWindow from './boards/app-board-window';
import { ThemeCallbacksContext } from '../boot/theme-provider';
import { useAppStore } from '../store/app';
import { useUserSettings } from '../store/account';
import { ShellUtilityBar, ShellUtilityPanel } from './shell-utility-bar';
import { useCurrentRoute } from '../history/hooks';

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

export function Shell() {
	const [chatPanelMode, setChatPanelMode] = useState('closed'); // values: 'closed', 'overlap', 'open'
	const [navOpen, setNavOpen] = useState(true);
	const [mobileNavOpen, setMobileNavOpen] = useState(false);
	const [current, setCurrent] = useState(undefined);
	const activeRoute = useCurrentRoute();

	useEffect(() => {
		setNavOpen((n) => !(n && chatPanelMode === 'open'));
	}, [chatPanelMode]);

	const showUtilityBar = useAppStore((s) => s.views.utilityBar.length > 0);
	return (
		<Background>
			<DarkReaderListener />
			{/* <MainAppRerouter /> */}
			<ShellHeader
				activeRoute={activeRoute}
				mobileNavIsOpen={mobileNavOpen}
				onMobileMenuClick={() => setMobileNavOpen(!mobileNavOpen)}
			>
				{showUtilityBar && (
					<ShellUtilityBar
						mode={chatPanelMode}
						setMode={setChatPanelMode}
						current={current}
						setCurrent={setCurrent}
					/>
				)}
			</ShellHeader>
			<Row crossAlignment="unset" style={{ position: 'relative', flexGrow: '1' }}>
				<ShellNavigationBar
					activeRoute={activeRoute}
					navigationBarIsOpen={navOpen}
					mobileNavIsOpen={mobileNavOpen}
					onCollapserClick={() => setNavOpen(!navOpen)}
				/>
				<AppViewContainer />
				{showUtilityBar && (
					<ShellUtilityPanel
						mode={chatPanelMode}
						setMode={setChatPanelMode}
						current={current}
						setCurrent={setCurrent}
					/>
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
