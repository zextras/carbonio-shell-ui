/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
/* eslint-disable no-param-reassign */

import produce from 'immer';
import { TFunction } from 'i18next';
import { SEARCH_APP_ID, SETTINGS_APP_ID } from '../../constants';
import { useAppStore } from '../../store/app';
import { SearchAppView } from '../../search/search-app-view';
import { SettingsAppView } from '../../settings/settings-app-view';
import { SettingsSidebar } from '../../settings/settings-sidebar';
import { AppState, PrimaryBarView, SHELL_APP_ID } from '../../../types';
import GeneralSettings from '../../settings/general-settings';
import { isAdmin, isClient } from '../../multimode';
import Feedback from '../../reporting/feedback';

const settingsRoute = {
	route: SETTINGS_APP_ID,
	id: SETTINGS_APP_ID,
	app: SETTINGS_APP_ID
};
const settingsPrimaryBar = (t: TFunction): PrimaryBarView => ({
	id: SETTINGS_APP_ID,
	app: SETTINGS_APP_ID,
	route: SETTINGS_APP_ID,
	component: 'SettingsModOutline',
	position: 16,
	visible: true,
	label: t('settings.app', 'Settings'),
	badge: {
		show: false
	}
});
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
	route: 'general',
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
const searchPrimaryBar = (t: TFunction): PrimaryBarView => ({
	id: SEARCH_APP_ID,
	app: SEARCH_APP_ID,
	route: SEARCH_APP_ID,
	component: 'SearchModOutline',
	position: 15,
	visible: true,
	label: t('search.app', 'Search'),
	badge: {
		show: false
	}
});
const searchAppView = {
	id: SEARCH_APP_ID,
	app: SEARCH_APP_ID,
	route: SEARCH_APP_ID,
	component: SearchAppView
};

const feedbackBoardView = {
	id: 'feedback',
	app: SHELL_APP_ID,
	component: Feedback,
	route: 'feedback'
};
export const registerDefaultViews = (t: TFunction): void => {
	useAppStore.setState(
		produce((s: AppState) => {
			if (isAdmin()) {
				s.routes = {
					[SETTINGS_APP_ID]: settingsRoute
				};
				s.views.primaryBar = [settingsPrimaryBar(t)];
				s.views.secondaryBar = [settingsSecondaryBar];
				s.views.appView = [settingsAppView];
			}
			if (isClient()) {
				s.routes = {
					[SEARCH_APP_ID]: searchRoute,
					[SETTINGS_APP_ID]: settingsRoute
				};
				s.views.primaryBar = [searchPrimaryBar(t), settingsPrimaryBar(t)];
				s.views.secondaryBar = [settingsSecondaryBar];
				s.views.appView = [searchAppView, settingsAppView];
				s.views.settings = [settingsGeneralView];
			}
			s.views.board = [feedbackBoardView];
		})
	);
};
