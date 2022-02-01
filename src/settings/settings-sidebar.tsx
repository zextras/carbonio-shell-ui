/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { FC, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { map } from 'lodash';
import { Accordion } from '@zextras/carbonio-design-system';
import { useTranslation } from 'react-i18next';
import { SETTINGS_APP_ID } from '../constants';
import { useAppStore } from '../store/app';

export const SettingsSidebar: FC = () => {
	const settingsViews = useAppStore((s) => s.views.settings);
	const history = useHistory();
	const [t] = useTranslation();
	const items = useMemo(
		() => [
			...map(settingsViews, (view) => ({
				id: view.route,
				label: view.label,
				icon: view.icon,
				onClick: (e: MouseEvent): void => {
					e.stopPropagation();
					history.push(`/${SETTINGS_APP_ID}${view.route}`);
				}
			}))
		],
		[history, settingsViews]
	);
	return <Accordion items={items} />;
};
