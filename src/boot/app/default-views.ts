/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useEffect, useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import { SEARCH_APP_ID, SETTINGS_APP_ID, SHELL_APP_ID } from '../../constants';
import { SearchAppView } from '../../search/search-app-view';
import { WrappedAccountsSettings } from '../../settings/accounts-settings';
import GeneralSettings from '../../settings/general-settings';
import { useSettingsSubSections } from '../../settings/general-settings-sub-sections';
import { SettingsAppView } from '../../settings/settings-app-view';
import { SettingsSidebar } from '../../settings/settings-sidebar';
import { useAccountStore } from '../../store/account';
import { useAppStore } from '../../store/app';
import type { AppRouteDescriptor, SettingsView } from '../../types/apps';

const useSearchModule = (): void => {
	const [t] = useTranslation();

	const searchRouteDescriptor = useMemo<AppRouteDescriptor>(
		() => ({
			id: SEARCH_APP_ID,
			app: SEARCH_APP_ID,
			route: SEARCH_APP_ID,
			appView: SearchAppView,
			badge: {
				show: false
			},
			label: t('search.app', 'Search'),
			position: 1000,
			visible: true,
			primaryBar: 'SearchModOutline'
		}),
		[t]
	);
	useEffect(() => {
		useAppStore.getState().addRoute(searchRouteDescriptor);

		return (): void => {
			useAppStore.getState().removeRoute(searchRouteDescriptor.id);
		};
	}, [searchRouteDescriptor]);
};

const useSettingsModule = (): void => {
	const [t] = useTranslation();
	const settingsAttrs = useAccountStore((state) => state.settings.attrs);
	const settingsSubSections = useSettingsSubSections();

	const settingsGeneralView = useMemo<SettingsView>(
		() => ({
			id: 'general',
			route: 'general',
			app: SHELL_APP_ID,
			component: GeneralSettings,
			icon: 'SettingsModOutline',
			label: t('settings.general.general', 'General Settings'),
			position: 1,
			subSections: settingsSubSections
		}),
		[settingsSubSections, t]
	);

	const settingsAccountView = useMemo<SettingsView>(
		() => ({
			id: 'accounts',
			route: 'accounts',
			app: SHELL_APP_ID,
			component: WrappedAccountsSettings,
			icon: 'PersonOutline',
			label: t('settings.accounts', 'Accounts'),
			position: 1
		}),
		[t]
	);

	const settingsRouteDescriptor = useMemo<AppRouteDescriptor>(
		() => ({
			id: SETTINGS_APP_ID,
			app: SETTINGS_APP_ID,
			route: SETTINGS_APP_ID,
			appView: SettingsAppView,
			badge: {
				show: false
			},
			label: t('settings.app', 'Settings'),
			position: 1100,
			visible: true,
			primaryBar: 'SettingsModOutline',
			secondaryBar: SettingsSidebar
		}),
		[t]
	);

	useEffect(() => {
		if (
			Object.keys(settingsAttrs).length > 0 &&
			settingsAttrs.zimbraFeatureOptionsEnabled !== 'FALSE'
		) {
			useAppStore.getState().addRoute(settingsRouteDescriptor);
			useAppStore.getState().addSettingsView(settingsGeneralView);
			useAppStore.getState().addSettingsView(settingsAccountView);
		}

		return (): void => {
			useAppStore.getState().removeRoute(settingsRouteDescriptor.id);
			useAppStore.getState().removeSettingsView(settingsGeneralView.id);
			useAppStore.getState().removeSettingsView(settingsAccountView.id);
		};
	}, [settingsAccountView, settingsAttrs, settingsGeneralView, settingsRouteDescriptor, t]);
};

export const DefaultViewsRegister = (): null => {
	useSearchModule();
	useSettingsModule();

	return null;
};
