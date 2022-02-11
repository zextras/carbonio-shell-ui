/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { FC, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { map, toUpper } from 'lodash';
import { Accordion, Tooltip, IconButton } from '@zextras/carbonio-design-system';
import { SETTINGS_APP_ID } from '../constants';
import { useAppStore } from '../store/app';
import { pushHistory } from '../history/hooks';

export const SettingsSidebar: FC<{ expanded: boolean }> = ({ expanded }) => {
	const settingsViews = useAppStore((s) => s.views.settings);
	const history = useHistory();
	const items = useMemo(
		() =>
			settingsViews.map((view) => ({
				id: view.route,
				label: view.label,
				icon: view.icon,
				onClick: (e: MouseEvent): void => {
					e.stopPropagation();
					history.push(`/${SETTINGS_APP_ID}/${view.route}`);
				}
			})),
		[history, settingsViews]
	);
	const collapsedItems = useMemo(
		() =>
			settingsViews.map((v) => (
				<Tooltip label={v.label} placement="right" key={v.id}>
					<IconButton
						icon={v.icon}
						onClick={(): void => pushHistory(`/${SETTINGS_APP_ID}/${v.route}`)}
						size="large"
					/>
				</Tooltip>
			)),
		[settingsViews]
	);
	return expanded ? <Accordion items={items} /> : <>{collapsedItems}</>;
};
