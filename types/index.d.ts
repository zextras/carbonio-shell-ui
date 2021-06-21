/*
 * *** BEGIN LICENSE BLOCK *****
 * Copyright (C) 2011-2021 Zextras
 *
 *  The contents of this file are subject to the Zextras EULA;
 * you may not use this file except in compliance with the EULA.
 * You may obtain a copy of the EULA at
 * http://www.zextras.com/zextras-eula.html
 * *** END LICENSE BLOCK *****
 */

import { RenderOptions, RenderResult } from '@testing-library/react';
import React, {
	ComponentClass,
	FunctionComponent,
	LazyExoticComponent,
	Component,
	FunctionComponent
} from 'react';
import { Reducer } from 'redux';
import { BehaviorSubject, Observable } from 'rxjs';
import { LocationDescriptor } from 'history';
import { Store } from '@reduxjs/toolkit';
import { LinkProps } from 'react-router-dom';

export type SharedAction = {
	id: string;
	label: string;
	icon: string | Component;
	types?: Array<string>;
	// eslint-disable-next-line @typescript-eslint/ban-types
	click: Function;
	disabled?: boolean;
	getDisabledStatus?: (...args: unknown[]) => boolean;
};

export type CoreAppData = {
	priority: number;
	package: string;
	name: string;
	description: string;
	version: string;
	resourceUrl: string;
	entryPoint: string;
};

export type UninitializedAppData = {
	core: CoreAppData;
};

export type RuntimeAppData = Partial<{
	icon: string | Component<{ active: boolean }>;
	views: {
		app?: Component | FunctionComponent;
		board?: Component | FunctionComponent;
		settings?: Component | FunctionComponent;
		sidebar?: Component | FunctionComponent;
	};
	context: unknown;
	search: {
		onSearch?: (query: string) => void;
		route?: string;
	};
	newButton: {
		primary: SharedAction;
		secondaryItems: Array<SharedAction>;
	};
}>;

export type AppData = UninitializedAppData & RuntimeAppData;

export type AppsMap = Record<string, AppData>;

export type IntegratedComponentsMap = Record<string, { app: string; item: Component }>;
// eslint-disable-next-line @typescript-eslint/ban-types
export type IntegratedHooksMap = Record<string, { app: string; item: Function }>;
// eslint-disable-next-line @typescript-eslint/ban-types
export type IntegratedFunctionsMap = Record<string, { app: string; item: Function }>;
export type IntegratedActionsMap = Record<string, { app: string; item: SharedAction }>;

export type Integrations = {
	components: IntegratedComponentsMap;
	hooks: IntegratedHooksMap;
	functions: IntegratedFunctionsMap;
	actions: IntegratedActionsMap;
};
export type IntegrationsRegister = {
	components: Record<string, Component>;
	// eslint-disable-next-line @typescript-eslint/ban-types
	hooks: Record<string, Function>;
	// eslint-disable-next-line @typescript-eslint/ban-types
	functions: Record<string, Function>;
	actions: Record<string, SharedAction>;
};

export type Setters = {
	addApps: (apps: Array<CoreAppData>) => void;
	registerAppData: (id: string) => (data: RuntimeAppData) => void;
	registerIntegrations: (id: string) => (data: IntegrationsRegister) => void;
	setAppContext: (id: string) => (data: unknown) => void;
};

export type AppState = {
	apps: AppsMap;
	integrations: Integrations;
	setters: Setters;
};

export type BasePkgDescription = {
	priority: number;
	package: string;
	name: string;
	description: string;
	version: string;
	resourceUrl: string;
	entryPoint: string;
};

export type AppPkgDescription = BasePkgDescription & {
	swExtension?: string;
	styleEntryPoint?: string;
	handlers?: string;
};

export type ThemePkgDescription = BasePkgDescription & unknown;

export type AccountAppsData = Array<AppPkgDescription>;
export type AccountThemesData = Array<ThemePkgDescription>;

export type AccountLoginData = {
	/** Zimbra auth token */ t: string;
	/** Username */ u: string;
	/** Password */ p: string;
	csrfToken: string;
};

export type ZimletProp = {
	name: string;
	zimlet: string;
	_content: string;
};

export type AccountSettings = {
	attrs: Record<string, any>;
	prefs: Record<string, any>;
	props: Array<ZimletProp>;
};

export type Account = {
	id: string;
	name: string;
	apps: AccountAppsData;
	themes: AccountThemesData;
	displayName: string;
	settings: AccountSettings;
	signatures: { signature: Array<any> };
	identities: { identity: Array<any> };
};

export type FCPartialEvent<T extends unknown | string> = {
	asPromise?: true;
	to?: {
		version: string;
		app: string;
	};
	event: string;
	data: T;
};

export type FCEvent<T extends unknown | string> = FCPartialEvent<T> & {
	from: string;
	version: string;
};

export type FCPartialPromisedEvent<T extends unknown | string> = FCPartialEvent<T> & {
	asPromise: true;
};

export type FCPromisedEvent<T extends unknown | string, R extends unknown | string> = FCEvent<T> & {
	sendResponse: (data: R) => void;
};
// Type is in the documentation. If changed update also the documentation.
export type MainSubMenuItemData = {
	id: string;
	icon?: string;
	label: string;
	to: string;
	items?: Array<MainSubMenuItemData>;
};
// Type is in the documentation. If changed update also the documentation.
export type MainMenuItemData = {
	id: string;
	icon: string;
	label: string;
	to: string;
	items?: Array<MainSubMenuItemData>;
	customComponent?: React.Component;
};
// Type is in the documentation. If changed update also the documentation.
export type AppRouteDescription = {
	route: string;
	view: LazyExoticComponent<any>;
	label: LazyExoticComponent<any>;
};
// Type is in the documentation. If changed update also the documentation.
export type AppSettingsRouteDescription = {
	route: string;
	view: LazyExoticComponent<any>;
	label: LazyExoticComponent<any>;
	to: string;
	id: string;
};
// Type is in the documentation. If changed update also the documentation.
export type AppCreateOption = {
	id: string;
	onClick?: () => void;
	app: {
		path: string;
		boardPath?: string;
		getPath?: () => undefined;
	};
	label: string;
};

export type FCSink = <T extends unknown | string, R extends unknown | string>(
	event: FCPartialEvent<T> | FCPartialPromisedEvent<T>
) => void | Promise<R>;
export type FC = Observable<FCEvent<any> | FCPromisedEvent<any, any>>;

export const ui: any;

export type SoapRequest = {
	_jsns:
		| 'urn:zimbra'
		| 'urn:zimbraAccount'
		| 'urn:zimbraAdmin'
		| 'urn:zimbraAdminExt'
		| 'urn:zimbraMail'
		| 'urn:zimbraRepl'
		| 'urn:zimbraSync'
		| 'urn:zimbraVoice';
};

export type SoapFetch = <REQ, RESP>(api: string, body: REQ & SoapRequest) => Promise<RESP>;

export type SoapError = {
	message: string;
	details: any;
};

export const testUtils: {
	render(
		// eslint-disable-next-line no-shadow
		ui: React.ReactElement,
		options?: Omit<RenderOptions, 'queries'>
	): RenderResult;
};

// shell runtime exports
export const store: {
	store: Store<any>;
	setReducer(nextReducer: Reducer): void;
};
export const registerIntegrations: (data: IntegrationsRegister) => void;
export const registerAppData: (data: Partial<RuntimeAppData>) => void;
export const setAppContext: <T>(obj: T) => void;
export const soapFetch: SoapFetch;
export const Applink: FunctionComponent<LinkProps>;
export const Spinner: FunctionComponent;
export const fiberChannel: FC;
export const fiberChannelSink: FCSink;

export const getApp: () => AppData;
export const getAppContext: <T>() => T;
export const getBridgedFunctions: () => {
	addBoard: (path: string, context?: unknown | { app: string }) => void;
	createModal: (...params: any[]) => void;
	createSnackbar: (...params: any[]) => void;
	getAccounts: () => Array<Account>;
	getHistory: () => History;
	historyGoBack: () => void;
	historyPush: (location: LocationDescriptor) => void;
	historyReplace: (location: LocationDescriptor) => void;
	removeBoard: (key: string) => void;
	removeCurrentBoard: () => void;
	setCurrentBoard: (key: string) => void;
	updateBoard: (key: string, url: string, title: string) => void;
	updateCurrentBoard: (url: string, title: string) => void;
};
export const getIntegratedAction: (id: string) => [SharedAction | undefined, boolean];
export const getIntegratedActionsByType: (type: string) => Array<SharedAction>;
export const getIntegratedComponent: (id: string) => [React.FC<unknown>, boolean];
// eslint-disable-next-line @typescript-eslint/ban-types
export const getIntegratedFunction: (id: string) => [Function, boolean];
// eslint-disable-next-line @typescript-eslint/ban-types
export const getIntegratedHook: (id: string) => [Function, boolean];

export const useAddBoardCallback: () => (path: string, context?: unknown | { app: string }) => void;
export const useApp: () => AppData;
export const useAppContext: <T>() => T;
export const useBehaviorSubject: <T>(observable: BehaviorSubject<T>) => T;
export const useBoardConfig: <T>() => T;
export const useCSRFToken: () => string;
export const useCurrentSync: () => any;
export const useFiberChannel: () => FC;
export const useFirstSync: () => any;
export const useGoBackHistoryCallback: () => void;
export const useIntegratedAction: (id: string) => [SharedAction | undefined, boolean];
export const useIntegratedActionsByType: (type: string) => Array<SharedAction>;
export const useIntegratedComponent: (id: string) => [React.FC<unknown>, boolean];
// eslint-disable-next-line @typescript-eslint/ban-types
export const useIntegratedFunction: (id: string) => [Function, boolean];
// eslint-disable-next-line @typescript-eslint/ban-types
export const useIntegratedHook: (id: string) => [Function, boolean];
export const useIsMobile: () => boolean;
export const usePromise: () => any;
export const usePushHistoryCallback: () => (location: LocationDescriptor) => void;
export const useRemoveCurrentBoard: () => () => void;
export const useReplaceHistoryCallback: () => (location: LocationDescriptor) => void;
export const useSaveSettingsCallback: () => (mods: {
	props: Record<string, { value: any; app: string }>;
	prefs: Record<string, any>;
}) => void;
export const useUpdateCurrentBoard: () => (url: string, title: string) => void;
export const useUserAccounts: () => Account[];
