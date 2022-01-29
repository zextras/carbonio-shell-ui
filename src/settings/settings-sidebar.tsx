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
import { useApps, useAppStore } from '../store/app';

export const SettingsSidebar: FC = () => {
	const apps = useApps();
	const settingsViews = useAppStore((s) => s.views.settings);
	const history = useHistory();
	const [t] = useTranslation();
	const items = useMemo(
		() => [
			{
				id: 'general',
				label: t('settings.general_tab', 'General'),
				icon: 'Settings2Outline',
				onClick: (e: MouseEvent): void => {
					e.stopPropagation();
					history.push(`/${SETTINGS_APP_ID}`);
				}
			},
			...map(settingsViews, (view) => ({
				id: view.route,
				label: apps[view.app].displayName,
				icon: apps[view.app].icon,
				onClick: (e: MouseEvent): void => {
					e.stopPropagation();
					history.push(`/${SETTINGS_APP_ID}/${view.route}`);
				}
			}))
		],
		[apps, history, settingsViews, t]
	);
	return <Accordion items={items} />;
};
