/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useCallback, useMemo } from 'react';

import type { ContainerProps } from '@zextras/carbonio-design-system';
import { Container } from '@zextras/carbonio-design-system';
import { filter, findIndex, map, sortBy } from 'lodash';
import { Route, Switch } from 'react-router-dom';
import styled from 'styled-components';

import { Collapser } from './collapser';
import { AppContextProvider } from '../boot/app/app-context-provider';
import { useCurrentRoute } from '../history/hooks';
import { useAppStore } from '../store/app';
import type { AppRoute } from '../types/apps';
import { useUtilityBarStore } from '../utility-bar/store';
import { checkRoute } from '../utility-bar/utils';

const SidebarContainer = styled(Container)<ContainerProps & { sidebarIsOpen?: boolean }>`
	min-width: 3rem;
	max-width: 19.625rem;
	width: ${({ sidebarIsOpen }): number => (sidebarIsOpen ? 19.625 : 3)}rem;
	transition: width 300ms;
	overflow-x: hidden;
`;

const ShellSecondaryBarComponent = ({
	activeRoute
}: {
	activeRoute?: AppRoute;
}): React.ReactNode => {
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
				data-testid="SideSecondaryBarContainer"
				sidebarIsOpen={isOpen}
				role="menu"
				height="fill"
				orientation="vertical"
				mainAlignment="space-between"
				onClick={isOpen ? undefined : onCollapserClick}
				style={{
					maxHeight: 'calc(100vh - 3.75rem)',
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

const MemoShellSecondaryBar = React.memo(ShellSecondaryBarComponent);

const ShellSecondaryBar = (): React.JSX.Element => {
	const activeRoute = useCurrentRoute();
	return <MemoShellSecondaryBar activeRoute={activeRoute} />;
};

export default ShellSecondaryBar;
