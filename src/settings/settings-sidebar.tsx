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

import React, { FC, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { reduce } from 'lodash';
import { Accordion } from '@zextras/zapp-ui';
import { useTranslation } from 'react-i18next';
import { useAppList } from '../store/app/hooks';
import { SETTINGS_APP_ID } from '../constants';

export const SettingsSidebar: FC = () => {
	const apps = useAppList();
	const history = useHistory();
	const [t] = useTranslation();
	const items = useMemo(
		() =>
			reduce(
				apps,
				// TODO: add type when the DS is converted to ts
				(acc: Array<unknown>, app) => {
					if (app.views?.settings) {
						acc.push({
							id: app.core.name,
							label: app.core.display,
							icon: app.icon,
							onClick: (e: MouseEvent): void => {
								e.stopPropagation();
								history.push(`/${SETTINGS_APP_ID}/${app.core.route}`);
							}
						});
					}
					return acc;
				},
				[
					{
						id: 'general',
						label: t('settings.general_tab', 'General'),
						icon: 'Settings2Outline',
						onClick: (e: MouseEvent): void => {
							e.stopPropagation();
							history.push(`/${SETTINGS_APP_ID}`);
						}
					}
				]
			),
		[apps, history, t]
	);
	return <Accordion items={items} />;
};
