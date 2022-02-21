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
	pkg: ZextrasModule;
};

export type LoadedAppsCache = {
	[pkgName: string]: LoadedAppRuntime;
};

export type AppInjections = {
	store: Store<any>;
};

export type AccountProps = {
	accountId?: string;
	type?: string;
	id?: number;
	email?: string;
	label?: string;
	personaLabel?: string;
	identityId?: string;
};

export type IdentityProps = {
	id: string;
	type: string;
	identityId: string | number;
	fromAddress?: string;
	identityName?: string;
	fromDisplay?: string;
	recoveryAccount?: string;
	replyToDisplay?: string;
	replyToAddress?: string;
	replyToEnabled?: string;
	saveToSent?: string;
	sentMailFolder?: string;
	whenInFoldersEnabled?: string;
	whenSentToEnabled?: string;
	whenSentToAddresses?: string;
};

export type Folder = {
	id: string;
	uuid: string;
	name: string;
	path: string | undefined;
	parent: string;
	parentUuid: string;
	unreadCount: number;
	size: number;
	itemsCount: number;
	synced: boolean;
	absParent: string;
	items: Folder[];
	level: number;
	to: string;
	color: string;
	rgb: string;
	rid?: string;
	isSharedFolder?: boolean;
	owner?: string;
	zid?: string;
	acl?: unknown;
	perm?: string;
	retentionPolicy?: unknown;
};

export type CreateModalProps = {
	background: string;
	centered: boolean;
	children: React.ReactElement;
	confirmColor: string;
	confirmLabel: string;
	copyLabel: string;
	customFooter: React.ReactElement;
	disablePortal: boolean;
	dismissLabel: string;
	hideFooter: boolean;
	maxHeight: string;
	onClose: () => void;
	onConfirm: () => void;
	onSecondaryAction: () => void;
	optionalFooter: React.ReactElement;
	secondaryActionLabel: string;
	showCloseIcon: boolean;
	size: string;
	title: string;
	type: string;
	zIndex: number;
};
