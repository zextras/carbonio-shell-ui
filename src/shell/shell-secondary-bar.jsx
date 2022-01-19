/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useMemo } from 'react';
import { find, map } from 'lodash';
import styled from 'styled-components';
import { Route, Switch } from 'react-router-dom';
import { Container, Accordion, Padding, Tooltip, Icon } from '@zextras/carbonio-design-system';
import { useTranslation } from 'react-i18next';
import { useUserAccount } from '../store/account/hooks';
import { useApps } from '../store/app/hooks';
import AppContextProvider from '../boot/app/app-context-provider';
import { Collapser } from './collapser';
import { SETTINGS_APP_ID, SEARCH_APP_ID } from '../constants';
import { SettingsSidebar } from '../settings/settings-sidebar';

const SettingsSidebarRoute = ({ item }) => (
	<Route key={`/${item.id}`} path={`/${item.route}`}>
		<Container mainAlignment="flex-start">
			<SettingsSidebar expanded={item.sidebarIsOpen} />
		</Container>
	</Route>
);

const SidebarSwitch = ({ item }) =>
	item.sidebar ? (
		<Route key={`/${item.id}`} path={`/${item.route}`}>
			<AppContextProvider pkg={item.id}>
				<Container mainAlignment="flex-start">
					<item.sidebar expanded={item.sidebarIsOpen} />
				</Container>
			</AppContextProvider>
		</Route>
	) : null;

const SidebarContainer = styled(Container)`
	min-width: 48px;
	max-width: 314px;
	width: ${({ sidebarIsOpen }) => (sidebarIsOpen ? 314 : 48)}px;
	transition: width 300ms;
	overflow-x: hidden;
`;

export default function ShellSecondaryBar({ sidebarIsOpen, onCollapserClick, activeApp }) {
	const apps = useApps();
	const disabled = useMemo(
		() =>
			!(
				activeApp &&
				(find(apps, (app) => app.core.route === activeApp)?.views?.sidebar ||
					activeApp === 'settings')
			),
		[activeApp, apps]
	);
	const account = useUserAccount();
	const [t] = useTranslation();
	const items = useMemo(
		() => [
			{
				id: account?.id,
				label: account?.displayName ?? account?.name,
				level: 0,
				textProps: { weight: 'bold' },
				open: true,
				items: [
					...map(apps, (app) => ({
						id: app.core.name,
						route: app.core.route,
						label: app.core.display,
						icon: app.icon,
						level: 0,
						sidebar: app.views?.sidebar,
						sidebarIsOpen,
						CustomComponent: SidebarSwitch
					})),
					{
						id: SETTINGS_APP_ID,
						route: SETTINGS_APP_ID,
						label: t('settings.app', 'Settings'),
						icon: 'SettingsModOutline',
						level: 0,
						sidebarIsOpen,
						CustomComponent: SettingsSidebarRoute
					},
					{
						id: SEARCH_APP_ID,
						route: SEARCH_APP_ID,
						label: t('search.app', 'Search'),
						icon: 'SearchModOutline',
						level: 0,
						sidebarIsOpen,
						CustomComponent: () => null
					}
				]
			}
		],
		[account?.displayName, account?.id, account?.name, apps, sidebarIsOpen, t]
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
					{sidebarIsOpen ? (
						<Accordion items={items} />
					) : (
						<>
							<Tooltip label={account?.displayName ?? account?.name} placement="right">
								<Padding all="medium">
									<Icon size="large" icon="PersonOutline" />
								</Padding>
							</Tooltip>
							{map(apps, (app) => (
								<SidebarSwitch
									key={app.core.name}
									item={{
										id: app.core.name,
										route: app.core.route,
										label: app.core.display,
										icon: app.icon,
										sidebar: app.views?.sidebar,
										sidebarIsOpen,
										CustomComponent: SidebarSwitch
									}}
								/>
							))}
						</>
					)}
				</Switch>
			</SidebarContainer>
			<Collapser onClick={onCollapserClick} open={sidebarIsOpen} />
		</>
	);
}
