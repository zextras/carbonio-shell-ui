/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
/* eslint-disable no-param-reassign */

import produce from 'immer';
import { SEARCH_APP_ID, SETTINGS_APP_ID } from '../../constants';
import { useAppStore } from '../../store/app';
import { SearchAppView } from '../../search/search-app-view';
import { SettingsAppView } from '../../settings/settings-app-view';
import { SettingsSidebar } from '../../settings/settings-sidebar';
import { AppState, SHELL_APP_ID } from '../../../types';
import GeneralSettings from '../../settings/general-settings';

const settingsRoute = {
	route: SETTINGS_APP_ID,
	id: SETTINGS_APP_ID,
	app: SETTINGS_APP_ID
};
const settingsPrimaryBar = {
	id: SETTINGS_APP_ID,
	app: SETTINGS_APP_ID,
	route: SETTINGS_APP_ID,
	component: 'SettingsModOutline',
	position: 16,
	visible: true,
	label: 'Settings',
	badge: {
		show: false
	}
};
const settingsSecondaryBar = {
	id: SETTINGS_APP_ID,
	app: SETTINGS_APP_ID,
	route: SETTINGS_APP_ID,
	component: SettingsSidebar
};

const settingsAppView = {
	id: SETTINGS_APP_ID,
	app: SETTINGS_APP_ID,
	route: SETTINGS_APP_ID,
	component: SettingsAppView
};
const settingsGeneralView = {
	id: 'general',
	route: '/general',
	app: SHELL_APP_ID,
	component: GeneralSettings,
	icon: 'SettingsModOutline',
	label: 'General',
	position: 1
};

const searchRoute = {
	route: SEARCH_APP_ID,
	id: SEARCH_APP_ID,
	app: SEARCH_APP_ID
};
const searchPrimaryBar = {
	id: SEARCH_APP_ID,
	app: SEARCH_APP_ID,
	route: SEARCH_APP_ID,
	component: 'SearchModOutline',
	position: 15,
	visible: true,
	label: 'Search',
	badge: {
		show: false
	}
};
const searchAppView = {
	id: SEARCH_APP_ID,
	app: SEARCH_APP_ID,
	route: SEARCH_APP_ID,
	component: SearchAppView
};

export const registerDefaultViews = (): void => {
	useAppStore.setState(
		produce((s: AppState) => {
			s.routes = {
				[SEARCH_APP_ID]: searchRoute,
				[SETTINGS_APP_ID]: settingsRoute
			};
			s.views.primaryBar = [searchPrimaryBar, settingsPrimaryBar];
			s.views.secondaryBar = [settingsSecondaryBar];
			s.views.appView = [searchAppView, settingsAppView];
			s.views.settings = [settingsGeneralView];
		})
	);
};
