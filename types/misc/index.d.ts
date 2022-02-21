/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Store } from '@reduxjs/toolkit';
import { To } from 'history';
import { i18n } from 'i18next';
import { ComponentType } from 'react';
import { CarbonioModule, PanelMode } from '../apps';

export interface II18nFactory {
	_cache: { [pkg: string]: i18n };
	locale: string;
	setLocale(locale: string): void;
	getShellI18n(): i18n;
	getAppI18n(appPkgDescription: CarbonioModule): i18n;
}

export type DRPropValues = 'auto' | 'enabled' | 'disabled';

// eslint-disable-next-line @typescript-eslint/ban-types
export type PackageDependentFunction = (app: string) => Function;
// eslint-disable-next-line @typescript-eslint/ban-types

export type ContextBridgeState = {
	packageDependentFunctions: Record<string, PackageDependentFunction>;
	// eslint-disable-next-line @typescript-eslint/ban-types
	functions: Record<string, Function>;
	add: (content: Partial<Omit<ContextBridgeState, 'add'>>) => void;
};

export type IShellWindow = Window & {
	__ZAPP_SHARED_LIBRARIES__: { [name: string]: any };
	__ZAPP_HMR_EXPORT__: { [pkgName: string]: (appClass: ComponentType) => void };
	// __ZAPP_HMR_HANDLERS__: { [pkgName: string]: (handlers: RequestHandlersList) => void };
};

export type LoadedAppRuntime = AppInjections & {
	pkg: CarbonioModule;
};

export type LoadedAppsCache = {
	[pkgName: string]: LoadedAppRuntime;
};

export type AppInjections = {
	store: Store<any>;
};

export type ShellModes = 'carbonio' | 'carbonioStandalone' | 'carbonioAdmin';

export type HistoryParams =
	| {
			path: To;
			route?: string;
	  }
	| string;
export type UtilityBarStore = {
	mode: PanelMode;
	setMode: (mode: PanelMode) => void;
	current?: string;
	setCurrent: (current: string) => void;
	secondaryBarState: boolean;
	setSecondaryBarState: (state: boolean) => void;
};
