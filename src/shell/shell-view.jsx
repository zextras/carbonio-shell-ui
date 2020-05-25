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

import React from 'react';
import styled from 'styled-components';
import PanelsRouterContainer from './panels/panels-router-container';
import AppLoaderContextProvider from '../app/app-loader-context-provider';
import MainMenu from './main-menu';
import ShellContextProvider from './shell-context-provider';
import ShellSecondaryBar from './shell-secondary-bar';
import ShellHeader from './shell-header';
import AppPanelWindow from './panels/app-panel-window';
import SharedUiComponentsContextProvider
	from '../shared-ui-components/shared-ui-components-context-provider';

const ShellContainer = styled.div`
	display: flex;
	flex-direction: row;
	flex-grow: 1;
	// overflow: hidden;
`;

export default function ShellView() {
	return (
		<ShellContextProvider>
			<AppLoaderContextProvider>
				<SharedUiComponentsContextProvider>
					<ShellHeader />
					<ShellContainer>
						<MainMenu />
						<ShellSecondaryBar />
						<PanelsRouterContainer />
					</ShellContainer>
					<AppPanelWindow />
				</SharedUiComponentsContextProvider>
			</AppLoaderContextProvider>
		</ShellContextProvider>
	);
}
