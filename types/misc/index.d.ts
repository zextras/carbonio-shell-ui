

import { Reducer, Store } from '@reduxjs/toolkit';
import { i18n } from 'i18next';
import { FunctionComponent } from 'react';
import { LinkProps } from 'react-router-dom';
import { RuntimeAppData } from '../apps';
import { ZextrasModule } from '../account';

export interface II18nFactory {
	_cache: { [pkg: string]: i18n };
	locale: string;
	setLocale(locale: string): void;
	getShellI18n(): i18n;
	getAppI18n(appPkgDescription: ZextrasModule): i18n;
}

// export type DevUtilsContext = {
// 	i18nFactory: II18nFactory;
// 	mswjs?: SetupWorkerApi;
// };

export type DRPropValues = 'auto' | 'enabled' | 'disabled';

// eslint-disable-next-line @typescript-eslint/ban-types
export type PackageDependentFunction = (app: string) => Function;
// eslint-disable-next-line @typescript-eslint/ban-types
export type RouteDependentFunction = (route: string) => Function;

export type ContextBridgeState = {
	packageDependentFunctions: Record<string, PackageDependentFunction>;
	routeDependentFunctions: Record<string, RouteDependentFunction>;
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
	'@zextras/zapp-shell': {
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
	'@zextras/zapp-ui': unknown;
	msw?: unknown;
	faker?: unknown;
};

export type LoadedAppRuntime = AppInjections & {
	pkg: ZextrasModule;
};

export type LoadedAppsCache = {
	[pkgName: string]: LoadedAppRuntime;
};

export type AppInjections = {
	store: Store<any>;
};
