/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Reducer, Store } from '@reduxjs/toolkit';
import { i18n } from 'i18next';
import { FunctionComponent } from 'react';
import { LinkProps } from 'react-router-dom';
import { RuntimeAppData } from '../apps';
import { CarbonioModule } from '../account';

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
	add: (content: Omit<ContextBridgeState, 'add'>) => void;
};

export type IShellWindow<T, R> = Window & {
	__ZAPP_SHARED_LIBRARIES__: T;
	__ZAPP_HMR_EXPORT__: { [pkgName: string]: (appClass: R) => void };
	// __ZAPP_HMR_HANDLERS__: { [pkgName: string]: (handlers: RequestHandlersList) => void };
};

export type SharedLibrariesAppsMap = {
	'prop-types': unknown;
	react: unknown;
	'react-dom': unknown;
	'react-i18next': unknown;
	'react-redux': unknown;
	'@reduxjs/toolkit': unknown;
	lodash: unknown;
	'react-router-dom': unknown;
	'styled-components': unknown;
	moment: unknown;
	'@zextras/carbonio-shell-ui': {
		[pkgName: string]: unknown & {
			store: {
				store: Store<unknown>;
				setReducer(nextReducer: Reducer): void;
			};
			registerAppData: (data: RuntimeAppData) => void;
			setAppContext: (obj: unknown) => void;
			AppLink: FunctionComponent<LinkProps>;
			Spinner: FunctionComponent;
			FOLDERS: Record<string, string>;
			SHELL_APP_ID: string;
			SETTINGS_APP_ID: string;
			SEARCH_APP_ID: string;
			ACTION_TYPES: Record<string, string>;
			ZIMBRA_STANDARD_COLORS: Array<{ zValue: number; hex: string; zLabel: string }>;
		};
	};
	'@zextras/carbonio-design-system': unknown;
	msw?: unknown;
	faker?: unknown;
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
