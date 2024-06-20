/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

// noinspection JSUnusedGlobalSymbols

/**
 * The library to integrate in the Carbonio environment.
 *
 * @remarks
 * The library includes all and only those utils exposed
 * by the shell to the modules at runtime.
 * This utils include all functions required to register the module,
 * plus some other utils to manage the interaction with the both the shell
 * and other modules.
 * There are also some components exposed for creating a consistent UI
 *
 * @packageDocumentation
 */

import type { AppDependantExports } from './boot/app/app-dependant-exports';
import type { report as reportApp } from './reporting/functions';

// TODO: export only what is useful and not internal constants
export * from './constants';
export * from './ui-extras/app-link';
export * from './ui-extras/spinner';
export * from './settings/components/settings-header';
export * from './boot/app/app-direct-exports';

export declare const report: ReturnType<typeof reportApp>;

export declare const setAppContext: AppDependantExports['setAppContext'];
export declare const addRoute: AppDependantExports['addRoute'];
export declare const addBoardView: AppDependantExports['addBoardView'];
export declare const addSettingsView: AppDependantExports['addSettingsView'];
export declare const addSearchView: AppDependantExports['addSearchView'];
export declare const addUtilityView: AppDependantExports['addUtilityView'];
export declare const addPrimaryAccessoryView: AppDependantExports['addPrimaryAccessoryView'];
export declare const addSecondaryAccessoryView: AppDependantExports['addSecondaryAccessoryView'];
export declare const registerComponents: AppDependantExports['registerComponents'];
export declare const editSettings: AppDependantExports['editSettings'];

export declare const getI18n: AppDependantExports['getI18n'];
export declare const t: AppDependantExports['t'];
export declare const soapFetch: AppDependantExports['soapFetch'];
export declare const xmlSoapFetch: AppDependantExports['xmlSoapFetch'];
export declare const useAppContext: AppDependantExports['useAppContext'];
export declare const getAppContext: AppDependantExports['getAppContext'];
export declare const useApp: AppDependantExports['useApp'];
export declare const getApp: AppDependantExports['getApp'];
export declare const addBoard: AppDependantExports['addBoard'];
/**
 * @deprecated Use hooks to access to functions which require context
 */
export declare const getBridgedFunctions: AppDependantExports['getBridgedFunctions'];

export * from './boot/app/app-direct-exports';

export type {
	PrimaryBarComponentProps,
	SecondaryBarComponentProps,
	UtilityBarComponentProps,
	BoardViewComponentProps,
	AppViewComponentProps,
	SettingsViewProps,
	SearchViewProps,
	PrimaryAccessoryViewProps,
	SecondaryAccessoryViewProps,
	SettingsSubSection,
	BadgeInfo
} from './types/apps';

export type {
	BooleanString,
	GeneralizedTime,
	Duration,
	Account,
	AccountSettings,
	AccountSettingsPrefs,
	Identity,
	IdentityAttrs
} from './types/account';

export type { Board } from './types/boards';
export type { BoardHooksContext } from './store/boards/hooks';

export type { CreateTagResponse } from './network/tags';
export type { Tag, Tags } from './types/tags';

export type {
	INotificationManager,
	NotificationConfig,
	AudioNotificationConfig,
	PopupNotificationConfig
} from './notification/NotificationManager';

export type { QueryItem, QueryChip } from './types/search';

export type { Folder, Folders, LinkFolder } from './types/folder';
export type { Grant } from './types/misc';

export type {
	SuccessSoapResponse,
	ErrorSoapResponse,
	ErrorSoapBodyResponse,
	SoapResponse,
	SoapLink,
	SoapFolder,
	SoapNotify,
	SoapContext,
	SoapBody,
	SoapHeader
} from './types/network/soap';
export type { BatchRequest } from './types/network';

export type { Action } from './types/integrations';

export type { HistoryParams } from './types/misc';

export type { FolderMessage } from './types/workers';
