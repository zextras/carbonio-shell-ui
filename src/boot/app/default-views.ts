/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
/* eslint-disable no-param-reassign */

import produce from 'immer';
import type { TFunction } from 'i18next';
import type { AppState, PrimaryBarView, SettingsView } from '../../../types';
import { SEARCH_APP_ID, SETTINGS_APP_ID, SHELL_APP_ID } from '../../constants';
import Feedback from '../../reporting/feedback';
import { SearchAppView } from '../../search/search-app-view';
import AccountWrapper from '../../settings/account-wrapper';
import GeneralSettings from '../../settings/general-settings';
import { settingsSubSections } from '../../settings/general-settings-sub-sections';
import { SettingsAppView } from '../../settings/settings-app-view';
import { SettingsSidebar } from '../../settings/settings-sidebar';
import { useAppStore } from '../../store/app';

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
const settingsGeneralView = (t: TFunction): SettingsView => ({
	id: 'general',
	route: 'general',
	app: SHELL_APP_ID,
	component: GeneralSettings,
	icon: 'SettingsModOutline',
	label: t('settings.general.general', 'General Settings'),
	position: 1,
	subSections: settingsSubSections(t)
});

const settingsAccountsView = (t: TFunction): SettingsView => ({
	id: 'accounts',
	route: 'accounts',
	app: SHELL_APP_ID,
	component: AccountWrapper,
	icon: 'PersonOutline',
	label: t('settings.accounts', 'Accounts'),
	position: 1
});

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
			s.routes = {
				[SEARCH_APP_ID]: searchRoute,
				[SETTINGS_APP_ID]: settingsRoute
			};
			s.views.primaryBar = [searchPrimaryBar(t), settingsPrimaryBar(t)];
			s.views.secondaryBar = [settingsSecondaryBar];
			s.views.appView = [searchAppView, settingsAppView];
			s.views.settings = [settingsGeneralView(t), settingsAccountsView(t)];
			s.views.board = [feedbackBoardView];
		})
	);
};
