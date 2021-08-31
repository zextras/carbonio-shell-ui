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
import { map } from 'lodash';
import { Accordion, Collapse, Container, Padding } from '@zextras/zapp-ui';
import { useHistory } from 'react-router-dom';
import { useAppList } from '../store/app/hooks';
import { useUserAccount } from '../store/account/hooks';
import { UserQuota } from './user-quota';
import AppContextProvider from '../boot/app/app-context-provider';

const SidebarComponent = ({ item }) =>
	item.sidebar ? (
		<AppContextProvider pkg={item.id}>
			<item.sidebar />
		</AppContextProvider>
	) : null;
export default function ShellMobileNav({ mobileNavIsOpen, menuTree }) {
	const apps = useAppList();
	const history = useHistory();
	const account = useUserAccount();
	const items = useMemo(
		() => [
			{
				id: account?.id,
				label: account?.displayName ?? account?.name,
				icon: 'PersonOutline',
				open: true,
				items: map(apps, (app) => ({
					id: `${app.core.package}-wrap`,
					label: app.core.name,
					icon: app.icon,
					onClick: () => history.push(`/${app.core.package}`),
					items: app.views?.sidebar
						? [
								{
									id: app.core.package,
									label: app.core.name,
									icon: app.icon,
									onClick: () => history.push(`/${app.core.package}`),
									sidebar: app.views?.sidebar,
									CustomComponent: SidebarComponent
								}
						  ]
						: []
				}))
			}
		],
		[account?.displayName, account?.id, account?.name, apps, history]
	);
	return (
		<Container
			height="fill"
			width="fit"
			background="gray5"
			style={{
				position: 'absolute',
				left: 0,
				top: 0,
				zIndex: 3
			}}
		>
			<Collapse orientation="horizontal" open={mobileNavIsOpen} crossSize="100%">
				<Container
					width={256 + 48 + 12}
					height="fill"
					orientation="vertical"
					mainAlignment="space-between"
					style={{
						maxHeight: 'calc(100vh - 48px)',
						overflowY: 'auto'
					}}
				>
					<Container width="fill" height="fit" orientation="vertical" mainAlignment="space-between">
						<Accordion items={items} />
					</Container>
					<Container width="fill" height="fit" orientation="vertical" mainAlignment="flex-end">
						<Accordion items={menuTree} />
						<Padding vertical="medium">
							<UserQuota />
						</Padding>
					</Container>
				</Container>
			</Collapse>
		</Container>
	);
}
