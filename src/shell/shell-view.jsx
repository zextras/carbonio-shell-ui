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

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Row } from '@zextras/zapp-ui';
import PanelsRouterContainer from './panels/panels-router-container';
import AppLoaderContextProvider from '../app/app-loader-context-provider';
import MainMenu from './main-menu';
import ShellContextProvider from './shell-context-provider';
import ShellSecondaryBar from './shell-secondary-bar';
import ShellHeader from './shell-header';
import AppPanelWindow from './panels/app-panel-window';
import SharedUiComponentsContextProvider
	from '../shared-ui-components/shared-ui-components-context-provider';
import { Button, extendTheme, ThemeProvider } from '@zextras/zapp-ui';
import { useAppsCache } from '../app/app-loader-context';
import { reduce } from 'lodash';
import { useBehaviorSubject } from './hooks';

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

function Shell() {
	const [userOpen, setUserOpen] = useState(false);
	const [navOpen, setNavOpen] = useState(true);

	return (
		<>
			<ShellHeader
				userBarIsOpen={userOpen}
				navigationBarIsOpen={navOpen}
				onMenuClick={() => setNavOpen(!navOpen)}
				onUserClick={() => setUserOpen(!userOpen)}
			/>
			<Row crossAlignment="unset" flexGrow="1">
				<MainMenu
					navigationBarIsOpen={navOpen}
					onCollapserClick={() => setNavOpen(!navOpen)}
				/>
				<PanelsRouterContainer />
			</Row>
			<AppPanelWindow />
		</>
	);
}
