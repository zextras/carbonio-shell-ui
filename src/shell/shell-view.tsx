/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useEffect, useState, useContext, FC, useMemo } from 'react';
import { Row, Responsive, ModalManager, SnackbarManager } from '@zextras/carbonio-design-system';
import styled from 'styled-components';
import { find } from 'lodash';
// import { PreviewManager } from '../preview';
import { PreviewManager } from '@zextras/carbonio-ui-preview';
import AppViewContainer from './app-view-container';
import ShellContextProvider from './shell-context-provider';
import ShellHeader from './shell-header';
import ShellNavigationBar from './shell-navigation-bar';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import AppBoardWindow from './boards/app-board-window';
import { ThemeCallbacksContext } from '../boot/theme-provider';
import { useAccountStore, useUserSettings } from '../store/account';
import { ShellUtilityBar, ShellUtilityPanel } from '../utility-bar';
import { useCurrentRoute } from '../history/hooks';
import { IS_STANDALONE, SHELL_APP_ID } from '../constants';
import { goToLogin } from '../network/go-to-login';
import { AppRoute, DRPropValues } from '../../types';

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
	const settings = useUserSettings();
	const currentDRMSetting = useMemo(
		() =>
			find(settings?.props ?? [], {
				name: 'zappDarkreaderMode',
				zimlet: SHELL_APP_ID
			})?._content as DRPropValues,
		[settings]
	);

	useEffect(() => {
		setDarkReaderState(currentDRMSetting);
	}, [currentDRMSetting, setDarkReaderState]);
	return null;
}

const useLoginRedirection = (allowUnauthenticated?: string): void => {
	const auth = useAccountStore((s) => s.authenticated);
	useEffect(() => {
		if (IS_STANDALONE && !auth && !allowUnauthenticated) {
			goToLogin();
		}
	}, [allowUnauthenticated, auth]);
};

const ShellComponent: FC<{ allowUnauthenticated?: string; hideShellHeader?: string }> = ({
	allowUnauthenticated,
	hideShellHeader
}) => {
	const [mobileNavOpen, setMobileNavOpen] = useState(false);
	useLoginRedirection(allowUnauthenticated);
	return (
		<Background>
			<DarkReaderListener />
			{/* <MainAppRerouter /> */}
			{!(IS_STANDALONE && hideShellHeader) && (
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
			<Responsive mode="desktop">
				<AppBoardWindow />
			</Responsive>
		</Background>
	);
};

const MemoShell = React.memo(ShellComponent);

const ShellView: FC = () => {
	const activeRoute = useCurrentRoute() as AppRoute;
	const allowUnauthenticated = activeRoute?.standalone?.allowUnauthenticated as string | undefined;
	const hideShellHeader = activeRoute?.standalone?.hideShellHeader as string | undefined;
	return (
		<ShellContextProvider>
			<ModalManager>
				<SnackbarManager>
					<PreviewManager>
						<MemoShell
							allowUnauthenticated={allowUnauthenticated}
							hideShellHeader={hideShellHeader}
						/>
					</PreviewManager>
				</SnackbarManager>
			</ModalManager>
		</ShellContextProvider>
	);
};

export default ShellView;
