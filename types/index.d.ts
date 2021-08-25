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
import React, { LazyExoticComponent, Component, FunctionComponent } from 'react';
import { Reducer } from 'redux';
import { BehaviorSubject, Observable } from 'rxjs';
import { LocationDescriptor } from 'history';
import { Store } from '@reduxjs/toolkit';
import { LinkProps } from 'react-router-dom';

type ListItemProps<T extends { id: string }> = {
	item: T;
	items: Array<T>;
	active?: boolean;
	selected?: boolean;
	selecting?: boolean;
	index: number;
	visible: boolean;
};
export type ListProps<T extends { id: string }> = {
	ItemComponent: FunctionComponent<ListItemProps<T>>;
	items: Array<T>;
	active?: boolean;
	selected?: boolean;
	selecting?: boolean;
	onListBottom?: () => void;
};

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
		search?: Component | FunctionComponent;
	};
	context: unknown;
	newButton: {
		primary: SharedAction;
		secondaryItems: Array<SharedAction>;
	};
}>;

export type AppData = UninitializedAppData & RuntimeAppData;

export type AppsMap = Record<string, AppData>;

export type Setters = {
	addApps: (apps: Array<CoreAppData>) => void;
	registerAppData: (id: string) => (data: RuntimeAppData) => void;
	setAppContext: (id: string) => (data: unknown) => void;
};

export type AppState = {
	apps: AppsMap;
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

export type FCSink = <T extends unknown | string, R extends unknown | string>(
	event: FCPartialEvent<T> | FCPartialPromisedEvent<T>
) => void | Promise<R>;
export type FC = Observable<FCEvent<any> | FCPromisedEvent<any, any>>;

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
export const registerAppData: (data: RuntimeAppData) => void;
export const setAppContext: <T>(obj: T) => void;
export const soapFetch: SoapFetch;
export const Applink: FunctionComponent<LinkProps>;
export const Spinner: FunctionComponent;
export const List: FunctionComponent<ListProps<any>>;

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
export const useFirstSync: () => any;
export const useGoBackHistoryCallback: () => () => void;
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

// it's an eslint bug
// eslint-disable-next-line no-shadow
export const ZIMBRA_STANDARD_COLORS: Array<{ zValue: number; hex: string; zLabel: string }>;

// it's an eslint bug
// eslint-disable-next-line no-shadow
export enum FOLDERS {
	USER_ROOT = '1',
	INBOX = '2',
	TRASH = '3',
	SPAM = '4',
	SENT = '5',
	DRAFTS = '6',
	CONTACTS = '7',
	TAGS = '8',
	CONVERSATIONS = '9',
	CALENDAR = '10',
	ROOT = '11',
	NOTEBOOK = '12', // no longer created in new mailboxes since Helix (bug 39647).  old mailboxes may still contain a system folder with id 12
	AUTO_CONTACTS = '13',
	IM_LOGS = '14',
	TASKS = '15',
	BRIEFCASE = '16'
}
export const registerActions: (
	...items: Array<{ id: string; action: ActionFactory<unknown>; type: string }>
) => void;
export const registerComponents: (...items: Array<{ id: string; component: Component }>) => void;
export const registerHooks: (...items: Array<{ id: string; hook: AnyFunction }>) => void;
export const registerFunctions: (...items: Array<{ id: string; fn: AnyFunction }>) => void;

export type Action = {
	id: string;
	label: string;
	icon: string;
	click: (ev: unknown) => void;
	type: string;
	primary?: boolean;
	group?: string;
	disabled?: boolean;
	[key: string]: unknown;
};
export type CombinedActionFactory<T> = (target: T) => Array<Action>;

export type ActionFactory<T> = (target: T) => Action;

export type ActionMap = Record<string, Record<string, ActionFactory<unknown>>>;
export type ComponentMap = Record<string, { app: string; item: Component }>;
export type HookMap = Record<string, AnyFunction>;
export type FunctionMap = Record<string, AnyFunction>;

export type AnyFunction = (...args: unknown[]) => unknown;

export const getIntegratedComponent: (id: string) => [FunctionComponent<unknown>, boolean];
export const getActions: <T>(target: T, type: string) => Array<Action>;
export const getActionsFactory: (type: string) => <T>(target: T) => Array<Action>;
export const getAction: <T>(type: string, id: string, target?: T) => [Action | undefined, boolean];
export const getFactory: <T>(type: string, id: string) => [ActionFactory<T> | undefined, boolean];
export const useIntegratedHook: (id: string) => [AnyFunction, boolean];
export const useIntegratedFunction: (id: string) => [AnyFunction, boolean];
export const useIntegratedComponent: (id: string) => [FunctionComponent<unknown>, boolean];
export const useActions: <T>(target: T, type: string) => Array<Action>;
export const useActionsFactory: <T>(type: string) => CombinedActionFactory<T>;
export const useAction: <T>(type: string, id: string, target?: T) => [Action | undefined, boolean];
export const useActionFactory: <T>(
	type: string,
	id: string
) => [ActionFactory<T> | undefined, boolean];
