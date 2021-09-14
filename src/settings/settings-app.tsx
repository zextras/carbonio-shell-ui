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
import { TFunction } from 'react-i18next';
import { SettingsAppView } from './settings-app-view';
import { SettingsSidebar } from './settings-sidebar';
import { SETTINGS_APP_ID } from '../constants';
import { ZextrasModule } from '../../types';

export const getSettingsCore = (t: TFunction): ZextrasModule => ({
	priority: 1,
	name: SETTINGS_APP_ID,
	version: '0.0.0',
	js_entrypoint: '',
	route: 'settings',
	commit: '',
	display: 'Settings'
});

export const settingsAppData = {
	icon: 'SettingsModOutline',
	views: {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		app: SettingsAppView,
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		sidebar: SettingsSidebar
	}
};
