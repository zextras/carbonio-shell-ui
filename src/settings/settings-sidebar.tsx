/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useMemo } from 'react';

import { Accordion, Button, Tooltip } from '@zextras/carbonio-design-system';
import { map } from 'lodash';
import { useLocation, useNavigate } from 'react-router-dom';

import { SETTINGS_APP_ID } from '../constants';
import { useAppStore } from '../store/app';

export const SettingsSidebar = ({
	expanded
}: React.PropsWithChildren<{ expanded: boolean }>): React.JSX.Element => {
	const settingsViews = useAppStore((s) => s.views.settings);
	const location = useLocation();
	const navigate = useNavigate();
	const items = useMemo(
		() =>
			settingsViews.map((view) => ({
				id: view.route,
				label: view.label,
				icon: view.icon,
				active: location.pathname === `/${SETTINGS_APP_ID}/${view.route}` && location.search === '',
				onClick: (e: KeyboardEvent | React.SyntheticEvent): void => {
					e.stopPropagation();
					navigate(view.route);
				},
				items: map(view.subSections, (item) => ({
					...item,
					active: location.search === `?section=${item.id}`,
					onClick: (e: KeyboardEvent | React.SyntheticEvent): void => {
						e.stopPropagation();
						navigate(`${view.route}?section=${item.id}`, { replace: true });
					}
				}))
			})),
		[navigate, location.pathname, location.search, settingsViews]
	);
	const collapsedItems = useMemo(
		() =>
			settingsViews.map((v) => {
				const active =
					location.pathname === `/${SETTINGS_APP_ID}/${v.route}` ||
					location.pathname.startsWith(`/${SETTINGS_APP_ID}/${v.route}/`);
				return (
					<Tooltip label={v.label} placement="right" key={v.id}>
						<Button
							icon={v.icon}
							onClick={(): void => navigate(v.route)}
							backgroundColor={active ? 'highlight' : 'transparent'}
							labelColor="text"
							size="large"
						/>
					</Tooltip>
				);
			}),
		[navigate, location.pathname, settingsViews]
	);
	return expanded ? <Accordion items={items} /> : <>{collapsedItems}</>;
};
