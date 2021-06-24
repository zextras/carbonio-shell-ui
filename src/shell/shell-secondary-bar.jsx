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
import { Route, Switch, useHistory } from 'react-router-dom';
import { Collapse, Collapser, Container, Accordion } from '@zextras/zapp-ui';
import { useUserAccounts } from '../store/shell-store-hooks';
import { useApps } from '../app-store/hooks';
import AppContextProvider from '../app/app-context-provider';

const SidebarSwitch = ({ item }) =>
	item.sidebar ? (
		<Route key={`/${item.id}`} path={`/${item.id}`}>
			<AppContextProvider pkg={item.id}>
				<item.sidebar />
			</AppContextProvider>
		</Route>
	) : null;

export default function ShellSecondaryBar({ navigationBarIsOpen, onCollapserClick, activeApp }) {
	const apps = useApps();
	const disabled = useMemo(() => activeApp && !apps[activeApp]?.views?.sidebar, [activeApp, apps]);
	const history = useHistory();
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
					onClick: () => history.push(`/${app.core.package}`),
					sidebar: app.views?.sidebar,
					CustomComponent: SidebarSwitch
				}))
			})),
		[accounts, apps, history]
	);
	return disabled ? null : (
		<>
			<Collapse orientation="horizontal" open={navigationBarIsOpen} maxSize="256px">
				<Container
					role="menu"
					width={256}
					height="fill"
					orientation="vertical"
					mainAlignment="flex-start"
					style={{
						maxHeight: 'calc(100vh - 48px)',
						overflowY: 'auto'
					}}
				>
					<Switch>
						<Accordion items={items} />
					</Switch>
				</Container>
			</Collapse>
			<Collapser clickCallback={onCollapserClick} />
		</>
	);
}
