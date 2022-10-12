/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Grid } from '@mui/material';
import { ModalManager, SnackbarManager } from '@zextras/carbonio-design-system';
import { PreviewManager } from '@zextras/carbonio-ui-preview';
import { find } from 'lodash';
import React, { FC, useContext, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { AppRoute, DRPropValues } from '../../types';
import { ThemeCallbacksContext } from '../boot/theme-provider';
import { IS_STANDALONE, SHELL_APP_ID } from '../constants';
import { useCurrentRoute } from '../history/hooks';
import { goToLogin } from '../network/go-to-login';
import { useAccountStore, useUserSettings } from '../store/account';
import { ShellUtilityBar, ShellUtilityPanel } from '../utility-bar';
import { BREAKPOINT_SIZE, useMobileView } from '../utils/utils';
import AppViewContainer from './app-view-container';
import { BoardContainer } from './boards/board-container';
import ShellContextProvider from './shell-context-provider';
import ShellHeader from './shell-header';
import ShellNavigationBar from './shell-navigation-bar';

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

const ShellComponent: FC<{
	allowUnauthenticated?: string;
	hideShellHeader?: string;
	activeRoute: AppRoute;
}> = ({ allowUnauthenticated, hideShellHeader, activeRoute }) => {
	const [mobileNavOpen, setMobileNavOpen] = useState(false);
	useLoginRedirection(allowUnauthenticated);
	const isMobileView = useMobileView();
	const isSearchView = activeRoute?.app === 'search';
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
			<Grid container sx={{ display: 'flex', height: '100%' }}>
				<Grid
					item
					xxs={isSearchView ? 0 : BREAKPOINT_SIZE.XXS}
					xs={isSearchView ? 0 : BREAKPOINT_SIZE.XS}
					sm={isSearchView ? 0 : BREAKPOINT_SIZE.SM}
					md={isSearchView ? 0 : BREAKPOINT_SIZE.MD}
					lg={isSearchView ? 0 : BREAKPOINT_SIZE.LG}
					xl={isSearchView ? 0 : BREAKPOINT_SIZE.XL}
					sx={{ height: '100%', display: isMobileView && !mobileNavOpen ? 'none' : 'block' }}
				>
					<ShellNavigationBar mobileNavIsOpen={mobileNavOpen} activeRoute={activeRoute} />
				</Grid>
				<AppViewContainer />
				<ShellUtilityPanel />
			</Grid>
			{isMobileView && <BoardContainer />}
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
							activeRoute={activeRoute}
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
