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

/* eslint-disable react/no-array-index-key */
import React, { useMemo } from 'react';
import { map } from 'lodash';
import styled from 'styled-components';
import { Route, Switch, useHistory } from 'react-router-dom';
import { Container, Accordion } from '@zextras/zapp-ui';
import { useUserAccounts } from '../store/shell-store-hooks';
import { useApps } from '../app-store/hooks';
import AppContextProvider from '../app/app-context-provider';
import { Collapser } from './collapser';

const SidebarSwitch = ({ item, sidebarIsOpen }) =>
	item.sidebar ? (
		<Route key={`/${item.id}`} path={`/${item.id}`}>
			<AppContextProvider pkg={item.id}>
				<Container>
					<item.sidebar expanded={item.sidebarIsOpen} />
				</Container>
			</AppContextProvider>
		</Route>
	) : null;

const SidebarContainer = styled(Container)`
	min-width: 40px;
	max-width: 256px;
	width: ${({ sidebarIsOpen }) => (sidebarIsOpen ? 256 : 40)}px;
	transition: width 300ms;
`;

export default function ShellSecondaryBar({ sidebarIsOpen, onCollapserClick, activeApp }) {
	const apps = useApps();
	const disabled = useMemo(() => activeApp && !apps[activeApp]?.views?.sidebar, [activeApp, apps]);
	const accounts = useUserAccounts();
	const items = useMemo(
		() =>
			map(accounts, (account) => ({
				id: account.id,
				label: account?.displayName ?? account?.name,
				icon: 'PersonOutline',
				open: true,
				items: map(apps, (app) => ({
					id: app.core.package,
					label: app.core.name,
					icon: app.icon,
					// eslint-disable-next-line @typescript-eslint/no-empty-function
					onClick: () => {},
					sidebar: app.views?.sidebar,
					sidebarIsOpen,
					CustomComponent: SidebarSwitch
				}))
			})),
		[accounts, apps, sidebarIsOpen]
	);
	return disabled ? null : (
		<>
			<SidebarContainer
				sidebarIsOpen={sidebarIsOpen}
				role="menu"
				height="fill"
				orientation="vertical"
				mainAlignment="flex-start"
				style={{
					maxHeight: 'calc(100vh - 48px)',
					overflowY: 'auto'
				}}
			>
				<Switch>
					<Accordion items={items} background="gray4" />
				</Switch>
			</SidebarContainer>
			<Collapser onClick={onCollapserClick} open={sidebarIsOpen} />
		</>
	);
}
