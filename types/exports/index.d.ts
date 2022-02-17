/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

/* eslint-disable camelcase */
// import { RenderOptions, RenderResult } from '@testing-library/react';
import { Component, FC } from 'react';
import { LinkProps } from 'react-router-dom';
import { Reducer, Store } from 'redux';
import { AppData, RuntimeAppData } from '../apps';
import { ActionFactory, AnyFunction, CombinedActionFactory, Action } from '../integrations';
import { AccountSettings, Tag, Account, NotifyObject } from '../account';
import { SoapFetch } from '../network';

// export const testUtils: {
// 	render(
// 		// eslint-disable-next-line no-shadow
// 		ui: React.ReactElement,
// 		options?: Omit<RenderOptions, 'queries'>
// 	): RenderResult;
// };

// ???
export const editSettings: () => (mods: {
	props: Record<string, { value: any; app?: string }>;
	prefs: Record<string, any>;
}) => Promise<any>;

// Generic stuff
export const store: {
	store: Store<any>;
	setReducer(nextReducer: Reducer): void;
};
export const soapFetch: SoapFetch;
export const xmlSoapFetch: SoapFetch;
export const report: (error: Error, hint?: unknown) => void;
export const setAppContext: <T>(obj: T) => void;
export const registerAppData: (data: RuntimeAppData) => void;
export const registerActions: (
	...items: Array<{ id: string; action: ActionFactory<unknown>; type: string }>
) => void;
export const registerComponents: (...items: Array<{ id: string; component: Component }>) => void;
export const registerHooks: (...items: Array<{ id: string; hook: AnyFunction }>) => void;
export const registerFunctions: (...items: Array<{ id: string; fn: AnyFunction }>) => void;
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
export const Applink: FC<LinkProps>;
export const Spinner: FC;

export const SHELL_APP_ID: string;
export const SETTINGS_APP_ID: string;
export const SEARCH_APP_ID: string;

// eslint-disable-next-line no-shadow
export enum ACTION_TYPES {
	CONVERSATION = 'conversation',
	CONVERSATION_lIST = 'conversation_list',
	MESSAGE = 'message',
	MESSAGE_lIST = 'message_list',
	CONTACT = 'contact',
	CONTACT_lIST = 'contact_list',
	INVITE = 'invite',
	INVITE_lIST = 'invite_list',
	APPOINTMENT = 'appointment',
	APPOINTMENT_lIST = 'appointment_list',
	FOLDER = 'folder',
	FOLDER_lIST = 'folder_list',
	CALENDAR = 'calendar',
	CALENDAR_lIST = 'calendar_list',
	NEW = 'new'
}

// HOOKS

export const useIsMobile: () => boolean;

export const useAddBoardCallback: () => (path: string, context?: unknown | { app: string }) => void;
export const useUpdateCurrentBoard: () => (url: string, title: string) => void;
export const useRemoveCurrentBoard: () => () => void;
export const useBoardConfig: <T>() => T;

export const useApp: () => AppData;
export const useAppContext: <T>() => T;
export const useUserAccounts: () => [Account];
export const useUserAccount: () => Account;
export const useUserSettings: () => AccountSettings;
export const useUserSetting: <T = void>(...path: Array<string>) => string | T;
export const useTags: () => Array<Tag>;
export const useNotify: () => [NotifyObject];
export const useRefresh: () => NotifyObject;

export const useIntegratedHook: (id: string) => [AnyFunction, boolean];
export const useIntegratedFunction: (id: string) => [AnyFunction, boolean];
export const useIntegratedComponent: (id: string) => [FC<unknown>, boolean];
export const useActions: <T>(target: T, type: string) => Array<Action>;
export const useActionsFactory: <T>(type: string) => CombinedActionFactory<T>;
export const useAction: <T>(type: string, id: string, target?: T) => [Action | undefined, boolean];
export const useActionFactory: <T>(
	type: string,
	id: string
) => [ActionFactory<T> | undefined, boolean];

// GETTERS

export const getBridgedFunctions: () => {
	addBoard: (path: string, context?: unknown | { app: string }) => void;
	createModal: (...params: any[]) => void;
	createSnackbar: (...params: any[]) => void;
	getHistory: () => History;
	removeBoard: (key: string) => void;
	removeCurrentBoard: () => void;
	setCurrentBoard: (key: string) => void;
	updateBoard: (key: string, url: string, title: string) => void;
	updateCurrentBoard: (url: string, title: string) => void;
};
export const getApp: () => AppData;
export const getAppContext: <T>() => T;
// eslint-disable-next-line @typescript-eslint/ban-types
export const getIntegratedFunction: (id: string) => [Function, boolean];
// eslint-disable-next-line @typescript-eslint/ban-types
export const getIntegratedHook: (id: string) => [Function, boolean];

export const getIntegratedComponent: (id: string) => [FC<unknown>, boolean];
export const getActions: <T>(target: T, type: string) => Array<Action>;
export const getActionsFactory: (type: string) => <T>(target: T) => Array<Action>;
export const getAction: <T>(type: string, id: string, target?: T) => [Action | undefined, boolean];
export const getFactory: <T>(type: string, id: string) => [ActionFactory<T> | undefined, boolean];
export const getUserAccount: () => Account;
export const getUserAccounts: () => [Account];
export const getUserSettings: () => AccountSettings;
export const getUserSetting: <T = void>(...path: Array<string>) => string | T;
export const getTags: () => Array<Tag>;
