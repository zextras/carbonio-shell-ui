/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useContext, useEffect } from 'react';

import { Container, Row } from '@zextras/carbonio-design-system';
import { PreviewManager } from '@zextras/carbonio-ui-preview';
import styled from 'styled-components';

import AppViewContainer from './app-view-container';
import { BoardContainer } from './boards/board-container';
import ShellContextProvider from './shell-context-provider';
import ShellHeader from './shell-header';
import ShellPrimaryBar from './shell-primary-bar';
import ShellSecondaryBar from './shell-secondary-bar';
import { ThemeCallbacksContext } from '../boot/theme-provider';
import { IS_STANDALONE } from '../constants';
import { useDarkReaderResultValue } from '../dark-mode/use-dark-reader-result-value';
import { useCurrentRoute } from '../history/hooks';
import { goToLogin } from '../network/utils';
import { useAccountStore } from '../store/account';
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
	min-width: 60rem;
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

const useLoginRedirection = (allowUnauthenticated?: boolean): void => {
	const auth = useAccountStore((s) => s.authenticated);
	useEffect(() => {
		if (IS_STANDALONE && !auth && !allowUnauthenticated) {
			goToLogin();
		}
	}, [allowUnauthenticated, auth]);
};

interface ShellComponentProps {
	allowUnauthenticated?: boolean;
	hideShellHeader?: boolean;
}

const ShellComponent = ({
	allowUnauthenticated,
	hideShellHeader
}: ShellComponentProps): React.JSX.Element => {
	useLoginRedirection(allowUnauthenticated);
	return (
		<Background>
			<DarkReaderListener />
			{!(IS_STANDALONE && hideShellHeader) && (
				<ShellHeader>
					<ShellUtilityBar />
				</ShellHeader>
			)}
			<Row crossAlignment="unset" style={{ position: 'relative', flexGrow: '1' }}>
				<Container
					orientation="horizontal"
					background="gray5"
					width="fit"
					height="fill"
					mainAlignment="flex-start"
					crossAlignment="flex-start"
				>
					<ShellPrimaryBar />
					<ShellSecondaryBar />
				</Container>
				<AppViewContainer />
				<ShellUtilityPanel />
			</Row>
			<BoardContainer />
		</Background>
	);
};

const MemoShell = React.memo(ShellComponent);

const ShellView = (): React.JSX.Element => {
	const activeRoute = useCurrentRoute();
	const allowUnauthenticated = activeRoute?.standalone?.allowUnauthenticated;
	const hideShellHeader = activeRoute?.standalone?.hideShellHeader;
	return (
		<ShellContextProvider>
			<PreviewManager>
				<MemoShell allowUnauthenticated={allowUnauthenticated} hideShellHeader={hideShellHeader} />
			</PreviewManager>
		</ShellContextProvider>
	);
};

export default ShellView;
