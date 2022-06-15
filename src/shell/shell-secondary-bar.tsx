/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { FC, useCallback, useMemo } from 'react';
import { filter, findIndex, map, sortBy } from 'lodash';
import styled from 'styled-components';
import { Route, Switch } from 'react-router-dom';
import { Container, ContainerProps } from '@zextras/carbonio-design-system';
import AppContextProvider from '../boot/app/app-context-provider';
import { Collapser } from './collapser';
import { useAppStore } from '../store/app';
import { AppRoute } from '../../types';
import { useUtilityBarStore } from '../utility-bar';
import { checkRoute } from '../utility-bar/utils';

const SidebarContainer = styled(Container)<ContainerProps & { sidebarIsOpen?: boolean }>`
	min-width: 48px;
	max-width: 314px;
	width: ${({ sidebarIsOpen }): number => (sidebarIsOpen ? 314 : 48)}px;
	transition: width 300ms;
	overflow-x: hidden;
`;

type SecondaryBarProps = {
	activeRoute: AppRoute;
};

const ShellSecondaryBar: FC<SecondaryBarProps> = ({ activeRoute }) => {
	const isOpen = useUtilityBarStore((s) => s.secondaryBarState);
	const setIsOpen = useUtilityBarStore((s) => s.setSecondaryBarState);
	const onCollapserClick = useCallback(() => setIsOpen(!isOpen), [isOpen, setIsOpen]);
	const secondaryBarViews = useAppStore((s) => s.views.secondaryBar);
	const secondaryBarAccessoryViews = useAppStore((s) => s.views.secondaryBarAccessories);
	const accessories = useMemo(
		() =>
			sortBy(
				filter(secondaryBarAccessoryViews, (v) => checkRoute(v, activeRoute)),
				'position'
			),
		[activeRoute, secondaryBarAccessoryViews]
	);
	const disabled = useMemo(
		() => findIndex(secondaryBarViews, (view) => view.id === activeRoute?.id) < 0,
		[activeRoute?.id, secondaryBarViews]
	);
	return disabled ? null : (
		<>
			<SidebarContainer
				sidebarIsOpen={isOpen}
				role="menu"
				height="fill"
				orientation="vertical"
				mainAlignment="space-between"
				onClick={isOpen ? undefined : onCollapserClick}
				style={{
					maxHeight: 'calc(100vh - 48px)',
					overflowY: 'auto'
				}}
			>
				<Container mainAlignment="flex-start">
					<Switch>
						{map(secondaryBarViews, (view) => (
							<Route key={view.id} path={`/${view.route}`}>
								<AppContextProvider pkg={view.app}>
									<view.component expanded={isOpen} />
								</AppContextProvider>
							</Route>
						))}
					</Switch>
				</Container>
				<Container mainAlignment="flex-end" height="fit">
					{accessories.map((view) => (
						<AppContextProvider key={view.id} pkg={view.app}>
							<view.component expanded={isOpen} />
						</AppContextProvider>
					))}
				</Container>
			</SidebarContainer>
			<Collapser onClick={onCollapserClick} open={isOpen} />
		</>
	);
};

export default ShellSecondaryBar;
