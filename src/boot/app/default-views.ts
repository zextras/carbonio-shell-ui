/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
/* eslint-disable no-param-reassign */

import type { TFunction } from 'i18next';
import { size } from 'lodash';

import type { AppRouteDescriptor, SettingsView } from '../../../types';
import { SEARCH_APP_ID, SETTINGS_APP_ID, SHELL_APP_ID } from '../../constants';
import { SearchAppView } from '../../search/search-app-view';
import { WrappedAccountsSettings } from '../../settings/accounts-settings';
import GeneralSettings from '../../settings/general-settings';
import { settingsSubSections } from '../../settings/general-settings-sub-sections';
import { SettingsAppView } from '../../settings/settings-app-view';
import { SettingsSidebar } from '../../settings/settings-sidebar';
import { useAccountStore } from '../../store/account';
import { useAppStore } from '../../store/app';

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
	component: WrappedAccountsSettings,
	icon: 'PersonOutline',
	label: t('settings.accounts', 'Accounts'),
	position: 1
});

const searchRouteDescriptor = (t: TFunction): AppRouteDescriptor => ({
	id: SEARCH_APP_ID,
	app: SEARCH_APP_ID,
	route: SEARCH_APP_ID,
	appView: SearchAppView,
	badge: {
		show: false
	},
	label: t('search.app', 'Search'),
	position: 15,
	visible: true,
	primaryBar: 'SearchModOutline'
});

const settingsRouteDescriptor = (t: TFunction): AppRouteDescriptor => ({
	id: SETTINGS_APP_ID,
	app: SETTINGS_APP_ID,
	route: SETTINGS_APP_ID,
	appView: SettingsAppView,
	badge: {
		show: false
	},
	label: t('settings.app', 'Settings'),
	position: 16,
	visible: true,
	primaryBar: 'SettingsModOutline',
	secondaryBar: SettingsSidebar
});

export const registerDefaultViews = (t: TFunction): void => {
	const { attrs } = useAccountStore.getState().settings;
	if (size(attrs) > 0 && attrs.zimbraFeatureOptionsEnabled !== 'FALSE') {
		useAppStore.getState().setters.addRoute(settingsRouteDescriptor(t));
		useAppStore.getState().setters.addSettingsView(settingsGeneralView(t));
		useAppStore.getState().setters.addSettingsView(settingsAccountsView(t));
	}
	useAppStore.getState().setters.addRoute(searchRouteDescriptor(t));
};
