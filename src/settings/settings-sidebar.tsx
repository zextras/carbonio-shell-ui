/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { FC, useMemo } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Accordion, Tooltip, IconButton } from '@zextras/carbonio-design-system';
import { map, startsWith } from 'lodash';
import { SETTINGS_APP_ID } from '../constants';
import { useAppStore } from '../store/app';

export const SettingsSidebar: FC<{ expanded: boolean }> = ({ expanded }) => {
	const settingsViews = useAppStore((s) => s.views.settings);
	const history = useHistory();
	const location = useLocation();
	const items = useMemo(
		() =>
			settingsViews.map((view) => ({
				id: view.route,
				label: view.label,
				icon: view.icon,
				active: location.pathname === `/${SETTINGS_APP_ID}/${view.route}` && location.search === '',
				disableHover:
					location.pathname === `/${SETTINGS_APP_ID}/${view.route}` && location.search === '',
				onClick: (e: MouseEvent): void => {
					e.stopPropagation();
					history.push(`/${SETTINGS_APP_ID}/${view.route}`);
				},
				items: map(view.subSections, (item) => ({
					...item,
					active: location.search === `?section=${item.id}`,
					disableHover: location.search === `?section=${item.id}`,
					onClick: (e: MouseEvent): void => {
						e.stopPropagation();
						history.replace(`/${SETTINGS_APP_ID}/${view.route}?section=${item.id}`);
						setTimeout(() => document.querySelector(`#${item.id}`)?.scrollIntoView(), 1);
					}
				}))
			})),
		[history, location.pathname, location.search, settingsViews]
	);
	const collapsedItems = useMemo(
		() =>
			settingsViews.map((v) => (
				<Tooltip label={v.label} placement="right" key={v.id}>
					<IconButton
						icon={v.icon}
						onClick={(): void => history.push(`/${SETTINGS_APP_ID}/${v.route}`)}
						size="large"
						iconColor={startsWith(location.pathname, `/${SETTINGS_APP_ID}/${v.route}`)}
					/>
				</Tooltip>
			)),
		[history, location.pathname, settingsViews]
	);
	return expanded ? <Accordion items={items} /> : <>{collapsedItems}</>;
};
