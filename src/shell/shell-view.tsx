/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Responsive, Row } from '@zextras/carbonio-design-system';
import { PreviewManager } from '@zextras/carbonio-ui-preview';
import { find, size } from 'lodash';
import React, { FC, useContext, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { AppRoute, DRPropValues } from '../../types';
import { ThemeCallbacksContext } from '../boot/theme-provider';
import { IS_STANDALONE, SHELL_APP_ID } from '../constants';
import { useCurrentRoute } from '../history/hooks';
import { goToLogin } from '../network/go-to-login';
import { useAccountStore, useUserSettings } from '../store/account';
import { ShellUtilityBar, ShellUtilityPanel } from '../utility-bar';
import AppViewContainer from './app-view-container';
import { BoardContainer } from './boards/board-container';
import ShellContextProvider from './shell-context-provider';
import ShellHeader from './shell-header';
import ShellNavigationBar from './shell-navigation-bar';
import { useLoginConfigStore } from '../store/login';

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
	const { carbonioWebUiDarkMode } = useLoginConfigStore();

	const settingReceived = useMemo(
		() => size(settings.prefs) > 0 || size(settings.attrs) > 0 || size(settings.props) > 0,
		[settings]
	);

	const currentDRMSetting = useMemo(() => {
		const result = find(settings?.props ?? [], {
			name: 'zappDarkreaderMode',
			zimlet: SHELL_APP_ID
		})?._content as DRPropValues;
		if (result) {
			return result;
		}

		return (
			(carbonioWebUiDarkMode === undefined && 'auto') ||
			(carbonioWebUiDarkMode && 'enabled') ||
			'disabled'
		);
	}, [settings, carbonioWebUiDarkMode]);

	useEffect(() => {
		if (currentDRMSetting && settingReceived) {
			setDarkReaderState(currentDRMSetting);
		}
	}, [currentDRMSetting, setDarkReaderState, settingReceived]);
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
				<BoardContainer />
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
			<PreviewManager>
				<MemoShell allowUnauthenticated={allowUnauthenticated} hideShellHeader={hideShellHeader} />
			</PreviewManager>
		</ShellContextProvider>
	);
};

export default ShellView;
