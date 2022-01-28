/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { FC, useMemo } from 'react';
import { findIndex, map } from 'lodash';
import styled from 'styled-components';
import { Route, Switch } from 'react-router-dom';
import { Container } from '@zextras/carbonio-design-system';
import AppContextProvider from '../boot/app/app-context-provider';
import { Collapser } from './collapser';
import { useAppStore } from '../store/app/store';
import { AppRoute } from '../../types';

const SidebarContainer = styled(Container)`
	min-width: 48px;
	max-width: 314px;
	width: ${({ sidebarIsOpen }): number => (sidebarIsOpen ? 314 : 48)}px;
	transition: width 300ms;
	overflow-x: hidden;
`;

type SecondaryBarProps = {
	sidebarIsOpen: boolean;
	onCollapserClick: () => void;
	activeRoute: AppRoute;
};

const ShellSecondaryBar: FC<SecondaryBarProps> = ({
	sidebarIsOpen,
	onCollapserClick,
	activeRoute
}) => {
	const secondaryBarViews = useAppStore((s) => s.views.secondaryBar);
	const secondaryBarAccessoryViews = useAppStore((s) => s.views.secondaryBarAccessories);
	const disabled = useMemo(
		() => findIndex(secondaryBarViews, (view) => view.id === activeRoute.id) < 0,
		[activeRoute.id, secondaryBarViews]
	);
	return disabled ? null : (
		<>
			<SidebarContainer
				sidebarIsOpen={sidebarIsOpen}
				role="menu"
				height="fill"
				orientation="vertical"
				mainAlignment="flex-start"
				onClick={sidebarIsOpen ? undefined : onCollapserClick}
				style={{
					maxHeight: 'calc(100vh - 48px)',
					overflowY: 'auto'
				}}
			>
				<Switch>
					{map(secondaryBarViews, (view) => (
						<Route key={`/${view.id}`} path={`/${view.route}`}>
							<AppContextProvider pkg={view.app}>
								<Container mainAlignment="flex-start">
									<view.component expanded={sidebarIsOpen} />
								</Container>
							</AppContextProvider>
						</Route>
					))}
				</Switch>
			</SidebarContainer>
			<Collapser onClick={onCollapserClick} open={sidebarIsOpen} />
		</>
	);
};

export default ShellSecondaryBar;
