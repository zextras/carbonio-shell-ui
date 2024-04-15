/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { getEditSettingsForApp } from '../../network/edit-settings';
import type { AppActions as StoreAppSetters } from '../../store/app';
import { useAppStore } from '../../store/app';
import {
	normalizeRoute,
	normalizeSettingsView,
	normalizeSearchView,
	normalizeUtilityView,
	normalizePrimaryAccessoryView,
	normalizeSecondaryAccessoryView,
	normalizeBoardView
} from '../../store/app/utils';
import type { IntegrationActions } from '../../store/integrations/store';
import { useIntegrationsStore } from '../../store/integrations/store';
import type {
	AppRouteDescriptor,
	BoardView,
	CarbonioModule,
	PrimaryAccessoryView,
	SearchView,
	SecondaryAccessoryView,
	SettingsView,
	UtilityView
} from '../../types/apps';

export type AppDependantSetters = {
	setAppContext: ReturnType<StoreAppSetters['setAppContext']>;
	addRoute: (data: Partial<AppRouteDescriptor>) => ReturnType<StoreAppSetters['addRoute']>;
	addBoardView: (data: Partial<BoardView>) => ReturnType<StoreAppSetters['addBoardView']>;
	addSettingsView: (data: Partial<SettingsView>) => ReturnType<StoreAppSetters['addSettingsView']>;
	addSearchView: (data: Partial<SearchView>) => ReturnType<StoreAppSetters['addSearchView']>;
	addUtilityView: (data: Partial<UtilityView>) => ReturnType<StoreAppSetters['addUtilityView']>;
	addPrimaryAccessoryView: (
		data: Partial<PrimaryAccessoryView>
	) => ReturnType<StoreAppSetters['addPrimaryAccessoryView']>;
	addSecondaryAccessoryView: (
		data: Partial<SecondaryAccessoryView>
	) => ReturnType<StoreAppSetters['addSecondaryAccessoryView']>;
	registerComponents: ReturnType<IntegrationActions['registerComponents']>;
	editSettings: ReturnType<typeof getEditSettingsForApp>;
};

export const getAppDependantSetters = (pkg: CarbonioModule): AppDependantSetters => {
	const appStore = useAppStore.getState();
	const integrations = useIntegrationsStore.getState();
	return {
		setAppContext: appStore.setAppContext(pkg.name),
		addRoute: (route: Partial<AppRouteDescriptor>) => appStore.addRoute(normalizeRoute(route, pkg)),
		addBoardView: (data: Partial<BoardView>) =>
			appStore.addBoardView(normalizeBoardView(data, pkg)),
		addSettingsView: (data: Partial<SettingsView>) =>
			appStore.addSettingsView(normalizeSettingsView(data, pkg)),
		addSearchView: (data: Partial<SearchView>) =>
			appStore.addSearchView(normalizeSearchView(data, pkg)),
		addUtilityView: (data: Partial<UtilityView>) =>
			appStore.addUtilityView(normalizeUtilityView(data, pkg)),
		addPrimaryAccessoryView: (data: Partial<PrimaryAccessoryView>) =>
			appStore.addPrimaryAccessoryView(normalizePrimaryAccessoryView(data, pkg)),
		addSecondaryAccessoryView: (data: Partial<SecondaryAccessoryView>) =>
			appStore.addSecondaryAccessoryView(normalizeSecondaryAccessoryView(data, pkg)),
		registerComponents: integrations.registerComponents(pkg.name),
		/** @deprecated */
		editSettings: getEditSettingsForApp(pkg.name)
	};
};

export const {
	updatePrimaryBadge,
	updateUtilityBadge,
	setRouteVisibility,
	removeRoute,
	removeBoardView,
	removeSettingsView,
	removeSearchView,
	removeUtilityView,
	removePrimaryAccessoryView,
	removeSecondaryAccessoryView
} = useAppStore.getState();

export const {
	registerFunctions,
	removeFunctions,
	registerActions,
	removeActions,
	removeComponents
} = useIntegrationsStore.getState();
