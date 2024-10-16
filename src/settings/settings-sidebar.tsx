/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useMemo } from 'react';

import { Accordion, IconButton, Tooltip } from '@zextras/carbonio-design-system';
import { map } from 'lodash';
import { useHistory, useLocation } from 'react-router-dom';

import { SETTINGS_APP_ID } from '../constants';
import { useAppStore } from '../store/app';

export const SettingsSidebar = ({
	expanded
}: React.PropsWithChildren<{ expanded: boolean }>): React.JSX.Element => {
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
				onClick: (e: KeyboardEvent | React.SyntheticEvent): void => {
					e.stopPropagation();
					history.push(`/${SETTINGS_APP_ID}/${view.route}`);
				},
				items: map(view.subSections, (item) => ({
					...item,
					active: location.search === `?section=${item.id}`,
					disableHover: location.search === `?section=${item.id}`,
					onClick: (e: KeyboardEvent | React.SyntheticEvent): void => {
						e.stopPropagation();
						history.replace(`/${SETTINGS_APP_ID}/${view.route}?section=${item.id}`);
					}
				}))
			})),
		[history, location.pathname, location.search, settingsViews]
	);
	const collapsedItems = useMemo(
		() =>
			settingsViews.map((v) => (
				<Tooltip label={v.label} placement="right" key={v.id}>
					<div>
						<IconButton
							icon={v.icon}
							onClick={(): void => history.push(`/${SETTINGS_APP_ID}/${v.route}`)}
							size="large"
						/>
					</div>
				</Tooltip>
			)),
		[history, settingsViews]
	);
	return expanded ? <Accordion items={items} /> : <>{collapsedItems}</>;
};
