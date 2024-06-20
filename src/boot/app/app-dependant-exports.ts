/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { reduce } from 'lodash';

import { getEditSettingsForApp } from '../../network/edit-settings';
import { getSoapFetch, getXmlSoapFetch } from '../../network/fetch';
import type { AppActions as StoreAppSetters } from '../../store/app';
import { getApp, getAppContext, getAppContextHook, getAppHook, useAppStore } from '../../store/app';
import {
	normalizeBoardView,
	normalizePrimaryAccessoryView,
	normalizeRoute,
	normalizeSearchView,
	normalizeSecondaryAccessoryView,
	normalizeSettingsView,
	normalizeUtilityView
} from '../../store/app/utils';
import { addBoard } from '../../store/boards';
import type { ContextBridgeState } from '../../store/context-bridge';
import { useContextBridge } from '../../store/context-bridge';
import { getI18n, getTFunction } from '../../store/i18n/hooks';
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

export type AppDependantExports = {
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
	getI18n: ReturnType<typeof getI18n>;
	t: ReturnType<typeof getTFunction>;
	soapFetch: ReturnType<typeof getSoapFetch>;
	xmlSoapFetch: ReturnType<typeof getXmlSoapFetch>;
	useAppContext: ReturnType<typeof getAppContextHook>;
	getAppContext: ReturnType<typeof getAppContext>;
	useApp: ReturnType<typeof getAppHook>;
	getApp: ReturnType<typeof getApp>;
	addBoard: ReturnType<typeof addBoard>;
	/**
	 * @deprecated Use hooks to access to functions which require context
	 */
	getBridgedFunctions: () => ContextBridgeState['functions'] & {
		[K in keyof ContextBridgeState['packageDependentFunctions']]: ReturnType<
			ContextBridgeState['packageDependentFunctions'][K]
		>;
	};
};

export const getAppDependantExports = (pkg: CarbonioModule): AppDependantExports => {
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
		editSettings: getEditSettingsForApp(pkg.name),
		getI18n: getI18n(pkg.name),
		t: getTFunction(pkg.name),
		soapFetch: getSoapFetch(pkg.name),
		xmlSoapFetch: getXmlSoapFetch(pkg.name),
		useAppContext: getAppContextHook(pkg.name),
		getAppContext: getAppContext(pkg.name),
		useApp: getAppHook(pkg.name),
		getApp: getApp(pkg.name),
		addBoard: addBoard(pkg.name),
		getBridgedFunctions: (): ReturnType<AppDependantExports['getBridgedFunctions']> => {
			const { packageDependentFunctions, functions } = useContextBridge.getState();
			return {
				...functions,
				...reduce(
					packageDependentFunctions,
					(acc, f, name) => ({ ...acc, [name]: f(pkg.name) }),
					{}
				)
			};
		}
	};
};
