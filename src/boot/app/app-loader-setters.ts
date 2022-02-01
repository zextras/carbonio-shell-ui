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
export const getAppSetters = (pkg: CarbonioModule): Record<string, Function> => ({
	setAppContext: useAppStore.getState().setters.setAppContext(pkg.name),
	addRoute: (route: Partial<AppRouteDescriptor>) =>
		useAppStore.getState().setters.addRoute(normalizeRoute(route, pkg)),
	setRouteVisibility: (routeId: string, visible: boolean) =>
		useAppStore.getState().setters.setRouteVisibility(routeId, visible),
	removeRoute: (routeId: string) => useAppStore.getState().setters.removeRoute(routeId),
	// add board
	addBoardView: (data: Partial<BoardView>) =>
		useAppStore.getState().setters.addBoardView(normalizeBoardView(data, pkg)),
	// remove board
	removeBoardView: useAppStore.getState().setters.removeBoardView,
	//
	// add settings
	addSettingsView: (data: Partial<SettingsView>) =>
		useAppStore.getState().setters.addSettingsView(normalizeSettingsView(data, pkg)),
	// remove settings
	removeSettingsView: useAppStore.getState().setters.removeSettingsView,
	//
	// add search
	addSearchView: (data: Partial<SearchView>) =>
		useAppStore.getState().setters.addSearchView(normalizeSearchView(data, pkg)),
	// remove search
	removeSearchView: useAppStore.getState().setters.removeSearchView,
	//
	// add utility
	addUtilityView: (data: Partial<UtilityView>) =>
		useAppStore.getState().setters.addUtilityView(normalizeUtilityView(data, pkg)),
	// remove utility
	removeUtilityView: useAppStore.getState().setters.removeUtilityView,
	//
	// add primaryAccessory
	addPrimaryAccessoryView: (data: Partial<PrimaryAccessoryView>) =>
		useAppStore
			.getState()
			.setters.addPrimaryAccessoryView(normalizePrimaryAccessoryView(data, pkg)),
	// remove primaryAccessory
	removePrimaryAccessoryView: useAppStore.getState().setters.removePrimaryAccessoryView,
	//
	// add secondaryAccessory
	addSecondaryAccessoryView: (data: Partial<SecondaryAccessoryView>) =>
		useAppStore
			.getState()
			.setters.addSecondaryAccessoryView(normalizeSecondaryAccessoryView(data, pkg)),
	// remove secondaryAccessory
	removeSecondaryAccessoryView: useAppStore.getState().setters.removeSecondaryAccessoryView,
	registerHooks: useIntegrationsStore.getState().registerHooks,
	registerFunctions: useIntegrationsStore.getState().registerFunctions,
	registerActions: useIntegrationsStore.getState().registerActions,
	registerComponents: useIntegrationsStore.getState().registerComponents(pkg.name)
});
