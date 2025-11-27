/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

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

// TODO: export only what is useful and not internal constants
export * from './constants';
export * from './settings/components/settings-header';
export * from './boot/app/app-direct-exports';

export declare const setAppContext: AppDependantExports['setAppContext'];
export declare const addRoute: AppDependantExports['addRoute'];
export declare const addBoardView: AppDependantExports['addBoardView'];
export declare const addSettingsView: AppDependantExports['addSettingsView'];
export declare const addUtilityView: AppDependantExports['addUtilityView'];
export declare const addPrimaryAccessoryView: AppDependantExports['addPrimaryAccessoryView'];
export declare const addSecondaryAccessoryView: AppDependantExports['addSecondaryAccessoryView'];
export declare const registerComponents: AppDependantExports['registerComponents'];

export declare const getI18n: AppDependantExports['getI18n'];
export declare const t: AppDependantExports['t'];
export declare const useAppContext: AppDependantExports['useAppContext'];
export declare const getAppContext: AppDependantExports['getAppContext'];
export declare const useApp: AppDependantExports['useApp'];
export declare const getApp: AppDependantExports['getApp'];
export declare const addBoard: AppDependantExports['addBoard'];

export type {
	PrimaryBarComponentProps,
	SecondaryBarComponentProps,
	UtilityBarComponentProps,
	BoardViewComponentProps,
	AppViewComponentProps,
	SettingsViewProps,
	PrimaryAccessoryViewProps,
	SecondaryAccessoryViewProps,
	SettingsSubSection,
	BadgeInfo
} from './types/apps';

export type {
	BooleanString,
	Duration,
	Account,
	AccountSettings,
	Identity,
	IdentityAttrs
} from './types/account';

export type { Board } from './types/boards';
export type { BoardHooksContext } from './store/boards/hooks';

export type {
	INotificationManager,
	NotificationConfig,
	AudioNotificationConfig,
	PopupNotificationConfig
} from './notification/NotificationManager';

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
	SoapHeader,
	SoapFault,
	RawSoapResponse,
	RawSoapHeader,
	RawSoapContext,
	RawSuccessSoapResponse,
	RawErrorSoapResponse
} from './types/network/soap';

export type { BatchRequest, BatchResponse } from './types/network';

export type { Action } from './types/integrations';

export type { HistoryParams } from './types/misc';

import './types/theme';
