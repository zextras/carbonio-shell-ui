/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useMemo } from 'react';
import { map } from 'lodash';
import { Accordion, Collapse, Container, Padding } from '@zextras/carbonio-design-system';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppList } from '../store/app/hooks';
import { useUserAccount } from '../store/account/hooks';
import AppContextProvider from '../boot/app/app-context-provider';
import { SEARCH_APP_ID, SETTINGS_APP_ID } from '../constants';
import { SettingsSidebar } from '../settings/settings-sidebar';

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
						id: `${app.core.name}-wrap`,
						label: app.core.display,
						icon: app.icon,
						onClick: () => history.push(`/${app.core.route}`),
						items: app.views?.sidebar
							? [
									{
										id: app.core.name,
										label: app.core.display,
										icon: app.icon,
										onClick: () => history.push(`/${app.core.route}`),
										sidebar: app.views?.sidebar,
										CustomComponent: SidebarComponent
									}
							  ]
							: []
					})),
					{
						id: `${SEARCH_APP_ID}-wrap`,
						label: t('search.app', 'Search'),
						icon: 'SearchModOutline',
						onClick: () => history.push(`/${SEARCH_APP_ID}`),
						items: []
					},
					{
						id: `${SETTINGS_APP_ID}-wrap`,
						label: t('settings.app', 'Settings'),
						icon: 'SettingsModOutline',
						onClick: () => history.push(`/${SETTINGS_APP_ID}`),
						items: [
							{
								id: SETTINGS_APP_ID,
								label: t('settings.app', 'Settings'),
								icon: 'SettingsModOutline',
								onClick: () => history.push(`/${SETTINGS_APP_ID}`),
								CustomComponent: SettingsSidebar
							}
						]
					}
				]
			}
		],
		[account?.displayName, account?.id, account?.name, apps, history, t]
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
						<Padding vertical="medium">{/* <UserQuota mobileView={true}/> */}</Padding>
					</Container>
				</Container>
			</Collapse>
		</Container>
	);
}
