/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
// The 'useXXX' functions actually return hooks
/* eslint-disable react-hooks/rules-of-hooks */

import {
	AppRouteDescriptor,
	BoardView,
	CarbonioModule,
	PrimaryAccessoryView,
	SearchView,
	SecondaryAccessoryView,
	SettingsView,
	UtilityView
} from '../../../types';
import { getEditSettingsForApp } from '../../network/edit-settings';
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
import { useIntegrationsStore } from '../../store/integrations/store';

// eslint-disable-next-line @typescript-eslint/ban-types
export const getAppSetters = (pkg: CarbonioModule): Record<string, Function> => {
	const appSetters = useAppStore.getState().setters;
	const integrations = useIntegrationsStore.getState();
	return {
		updatePrimaryBadge: appSetters.updatePrimaryBadge,
		updateUtilityBadge: appSetters.updateUtilityBadge,
		setAppContext: appSetters.setAppContext(pkg.name),
		addRoute: (route: Partial<AppRouteDescriptor>) =>
			appSetters.addRoute(normalizeRoute(route, pkg)),
		setRouteVisibility: (routeId: string, visible: boolean) =>
			appSetters.setRouteVisibility(routeId, visible),
		removeRoute: (routeId: string) => appSetters.removeRoute(routeId),
		// add board
		addBoardView: (data: Partial<BoardView>) =>
			appSetters.addBoardView(normalizeBoardView(data, pkg)),
		// remove board
		removeBoardView: appSetters.removeBoardView,
		//
		// add settings
		addSettingsView: (data: Partial<SettingsView>) =>
			appSetters.addSettingsView(normalizeSettingsView(data, pkg)),
		// remove settings
		removeSettingsView: appSetters.removeSettingsView,
		//
		// add search
		addSearchView: (data: Partial<SearchView>) =>
			appSetters.addSearchView(normalizeSearchView(data, pkg)),
		// remove search
		removeSearchView: appSetters.removeSearchView,
		//
		// add utility
		addUtilityView: (data: Partial<UtilityView>) =>
			appSetters.addUtilityView(normalizeUtilityView(data, pkg)),
		// remove utility
		removeUtilityView: appSetters.removeUtilityView,
		//
		// add primaryAccessory
		addPrimaryAccessoryView: (data: Partial<PrimaryAccessoryView>) =>
			appSetters.addPrimaryAccessoryView(normalizePrimaryAccessoryView(data, pkg)),
		// remove primaryAccessory
		removePrimaryAccessoryView: appSetters.removePrimaryAccessoryView,
		//
		// add secondaryAccessory
		addSecondaryAccessoryView: (data: Partial<SecondaryAccessoryView>) =>
			appSetters.addSecondaryAccessoryView(normalizeSecondaryAccessoryView(data, pkg)),
		// remove secondaryAccessory
		removeSecondaryAccessoryView: appSetters.removeSecondaryAccessoryView,
		registerHooks: integrations.registerHooks,
		removeHooks: integrations.removeHooks,
		registerFunctions: integrations.registerFunctions,
		removeFunctions: integrations.removeFunctions,
		registerActions: integrations.registerActions,
		removeActions: integrations.removeActions,
		registerComponents: integrations.registerComponents(pkg.name),
		removeComponents: integrations.removeComponents,
		editSettings: getEditSettingsForApp(pkg.name)
	};
};
