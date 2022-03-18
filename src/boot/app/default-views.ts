/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
/* eslint-disable no-param-reassign */

import produce from 'immer';
import { TFunction } from 'i18next';
import { useAppStore } from '../../store/app';
import { SearchAppView } from '../../search/search-app-view';
import { SettingsAppView } from '../../settings/settings-app-view';
import { SettingsSidebar } from '../../settings/settings-sidebar';
import { AppState, PrimaryBarView, SettingsView } from '../../../types';
import GeneralSettings from '../../settings/general-settings';
import { isAdmin, isClient } from '../../multimode';
import Feedback from '../../reporting/feedback';
import DevBoard from '../../dev/dev-board';
import DevBoardTrigger from '../../dev/dev-board-trigger';
import { SEARCH_APP_ID, SETTINGS_APP_ID, SHELL_APP_ID } from '../../constants';
import AccountWrapper from '../../settings/account-wrapper';
import { settingsSubSections } from '../../settings/general-settings-sub-sections';

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
	label: t('settings.general.general', 'General'),
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
const devModeBoardView = {
	id: 'dev-mode',
	app: SHELL_APP_ID,
	component: DevBoard,
	route: 'devtools'
};
const devModeTrigger = {
	id: 'dev-mode-t',
	component: DevBoardTrigger,
	label: 'Dev Tools',
	app: SHELL_APP_ID,
	position: 100
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
				s.views.settings = [settingsGeneralView(t), settingsAccountsView(t)];
			}
			s.views.board = [feedbackBoardView];
			if (__CARBONIO_DEV__) {
				s.views.board.push(devModeBoardView);
				s.views.primaryBarAccessories.push(devModeTrigger);
			}
		})
	);
};
