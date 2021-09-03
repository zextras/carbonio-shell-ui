/*
 * *** BEGIN LICENSE BLOCK *****
 * Copyright (C) 2011-2021 Zextras
 *
 *  The contents of this file are subject to the Zextras EULA;
 * you may not use this file except in compliance with the EULA.
 * You may obtain a copy of the EULA at
 * http://www.zextras.com/zextras-eula.html
 * *** END LICENSE BLOCK *****
 */

import React, { useMemo } from 'react';
import { map, reduce } from 'lodash';
import styled from 'styled-components';
import { Route, Switch } from 'react-router-dom';
import { Container, Accordion, IconButton, Padding, Tooltip, Icon } from '@zextras/zapp-ui';
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
	max-width: 264px;
	width: ${({ sidebarIsOpen }) => (sidebarIsOpen ? 264 : 48)}px;
	transition: width 300ms;
	overflow-x: hidden;
`;

export default function ShellSecondaryBar({ sidebarIsOpen, onCollapserClick, activeApp }) {
	const apps = useApps();
	const disabled = useMemo(() => activeApp && !apps[activeApp]?.views?.sidebar, [activeApp, apps]);
	const account = useUserAccount();
	const [t] = useTranslation();
	const items = useMemo(
		() => [
			{
				id: account?.id,
				label: account?.displayName ?? account?.name,
				icon: 'PersonOutline',
				open: true,
				items: [
					...map(apps, (app) => ({
						id: app.core.name,
						route: app.core.route,
						label: app.core.display,
						icon: app.icon,
						sidebar: app.views?.sidebar,
						sidebarIsOpen,
						CustomComponent: SidebarSwitch
					})),
					{
						id: SETTINGS_APP_ID,
						route: SETTINGS_APP_ID,
						label: t('settings', 'Settings'),
						icon: 'SettingsModOutline',
						sidebarIsOpen,
						CustomComponent: SettingsSidebarRoute
					},
					{
						id: SEARCH_APP_ID,
						route: SEARCH_APP_ID,
						label: t('search', 'Search'),
						icon: 'SearchModOutline',
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
