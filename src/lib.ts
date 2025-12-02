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

import './types/theme';
import type { report as reportApp } from './reporting/functions';
import {
	getAppContext as getAppCtx,
	getAppContextHook,
	getAppHook,
	useAppStore
} from './store/app';
import {
	normalizeBoardView,
	normalizePrimaryAccessoryView,
	normalizeRoute,
	normalizeSecondaryAccessoryView,
	normalizeSettingsView,
	normalizeUtilityView
} from './store/app/utils';
import { getI18n as hookGetI18n, getTFunction } from './store/i18n/hooks';
import { useIntegrationsStore } from './store/integrations/store';
import type {
	AppRouteDescriptor,
	BoardView,
	PrimaryAccessoryView,
	SecondaryAccessoryView,
	SettingsView,
	UtilityView
} from './types/apps';
// TODO: export only what is useful and not internal constants
export * from './constants';
export * from './settings/components/settings-header';
export * from './boot/app/app-direct-exports';

export declare const report: ReturnType<typeof reportApp>;

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

const appStore = useAppStore.getState();
const integrations = useIntegrationsStore.getState();
const PKG_NAME = 'carbonio-mails-ui';
const pkg = {
	commit: '',
	description: '',
	js_entrypoint: '',
	name: PKG_NAME,
	priority: 0,
	version: '',
	type: 'carbonio' as const,
	icon: '',
	display: ''
};
export const setAppContext = appStore.setAppContext(PKG_NAME);
export const addRoute = (route: Partial<AppRouteDescriptor>): string =>
	appStore.addRoute(normalizeRoute(route, pkg));
export const addBoardView = (data: Omit<BoardView, 'app'>): string =>
	appStore.addBoardView(normalizeBoardView(data, pkg));
export const addSettingsView = (data: Partial<SettingsView>): string =>
	appStore.addSettingsView(normalizeSettingsView(data, pkg));
export const addUtilityView = (data: Partial<UtilityView>): string =>
	appStore.addUtilityView(normalizeUtilityView(data, pkg));
export const addPrimaryAccessoryView = (data: Partial<PrimaryAccessoryView>): string =>
	appStore.addPrimaryAccessoryView(normalizePrimaryAccessoryView(data, pkg));
export const addSecondaryAccessoryView = (data: Partial<SecondaryAccessoryView>): string =>
	appStore.addSecondaryAccessoryView(normalizeSecondaryAccessoryView(data, pkg));
export const registerComponents = integrations.registerComponents(PKG_NAME);
export const getI18n = hookGetI18n(PKG_NAME);
export const t = getTFunction(PKG_NAME);
export const useAppContext = getAppContextHook(PKG_NAME);
export const getAppContext = getAppCtx(PKG_NAME);
export const useApp = getAppHook(PKG_NAME);
export { useAppStore } from './store/app';
