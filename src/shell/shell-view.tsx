/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useContext, useEffect, useState } from 'react';

import { Row } from '@zextras/carbonio-design-system';
import { PreviewManager } from '@zextras/carbonio-ui-preview';
import styled from 'styled-components';

import AppViewContainer from './app-view-container';
import { BoardContainer } from './boards/board-container';
import ShellContextProvider from './shell-context-provider';
import ShellHeader from './shell-header';
import ShellNavigationBar from './shell-navigation-bar';
import { ThemeCallbacksContext } from '../boot/theme-provider';
import { IS_STANDALONE } from '../constants';
import { useDarkReaderResultValue } from '../dark-mode/use-dark-reader-result-value';
import { ShellUtilityBar } from '../utility-bar/bar';
import { ShellUtilityPanel } from '../utility-bar/panel';

const Background = styled.div`
	background: ${({ theme }): string => theme.palette.gray6.regular};
	display: flex;
	flex-direction: column;
	height: 100%;
	min-height: 100%;
	max-height: 100%;
	width: 100%;
	min-width: 100%;
	max-width: 100%;
`;

function DarkReaderListener(): null {
	const { setDarkReaderState } = useContext(ThemeCallbacksContext);
	const darkReaderResultValue = useDarkReaderResultValue();
	useEffect(() => {
		if (darkReaderResultValue) {
			setDarkReaderState(darkReaderResultValue);
		}
	}, [darkReaderResultValue, setDarkReaderState]);
	return null;
}

const ShellComponent = (): JSX.Element => {
	const [mobileNavOpen, setMobileNavOpen] = useState(false);
	return (
		<Background>
			<DarkReaderListener />
			{!IS_STANDALONE && (
				<ShellHeader
					mobileNavIsOpen={mobileNavOpen}
					onMobileMenuClick={(): void => setMobileNavOpen(!mobileNavOpen)}
				>
					<ShellUtilityBar />
				</ShellHeader>
			)}
			<Row crossAlignment="unset" style={{ position: 'relative', flexGrow: '1' }}>
				<ShellNavigationBar mobileNavIsOpen={mobileNavOpen} />
				<AppViewContainer />
				<ShellUtilityPanel />
			</Row>
			<BoardContainer />
		</Background>
	);
};

const ShellView = (): JSX.Element => (
	<ShellContextProvider>
		<PreviewManager>
			<ShellComponent />
		</PreviewManager>
	</ShellContextProvider>
);

export default ShellView;
