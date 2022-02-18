/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
/* eslint-disable @typescript-eslint/ban-types */

import { ComponentType, FC } from 'react';
import { LinkProps } from 'react-router-dom';
import { Reducer, Store } from 'redux';
import { TFunction } from 'react-i18next';
import { CarbonioModule } from '../apps';
import { ActionFactory, AnyFunction, CombinedActionFactory, Action } from '../integrations';
import { AccountSettings, Tag, Account, NotifyObject } from '../account';
import { SoapFetch, Mods } from '../network';
import { ShellModes } from '../misc';

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
	t: TFunction;
	toggleMinimizedBoard: () => void;
};
export const editSettings: (mods: Mods) => Promise<any>;
export const ZIMBRA_STANDARD_COLORS = [
	{ zValue: 0, hex: '#000000', zLabel: 'black' },
	{ zValue: 1, hex: '#2b73d2', zLabel: 'blue' },
	{ zValue: 2, hex: '#2196d3', zLabel: 'cyan' },
	{ zValue: 3, hex: '#639030', zLabel: 'green' },
	{ zValue: 4, hex: '#1a75a7', zLabel: 'purple' },
	{ zValue: 5, hex: '#d74942', zLabel: 'red' },
	{ zValue: 6, hex: '#ffc107', zLabel: 'yellow' },
	{ zValue: 7, hex: '#edaeab', zLabel: 'pink' },
	{ zValue: 8, hex: '#828282', zLabel: 'gray' },
	{ zValue: 9, hex: '#ba8b00', zLabel: 'orange' }
];
export const FOLDERS = {
	USER_ROOT: '1',
	INBOX: '2',
	TRASH: '3',
	SPAM: '4',
	SENT: '5',
	DRAFTS: '6',
	CONTACTS: '7',
	TAGS: '8',
	CONVERSATIONS: '9',
	CALENDAR: '10',
	ROOT: '11',
	NOTEBOOK: '12', // no longer created in new mailboxes since Helix (bug 39647).  old mailboxes may still contain a system folder with id 12
	AUTO_CONTACTS: '13',
	IM_LOGS: '14',
	TASKS: '15',
	BRIEFCASE: '16'
};
export const SHELL_APP_ID = 'carbonio-shell-ui';
export const SETTINGS_APP_ID = 'settings';
export const SEARCH_APP_ID = 'search';
export const ACTION_TYPES = {
	CONVERSATION: 'conversation',
	CONVERSATION_lIST: 'conversation_list',
	MESSAGE: 'message',
	MESSAGE_lIST: 'message_list',
	CONTACT: 'contact',
	CONTACT_lIST: 'contact_list',
	INVITE: 'invite',
	INVITE_lIST: 'invite_list',
	APPOINTMENT: 'appointment',
	APPOINTMENT_lIST: 'appointment_list',
	FOLDER: 'folder',
	FOLDER_lIST: 'folder_list',
	CALENDAR: 'calendar',
	CALENDAR_lIST: 'calendar_list',
	NEW: 'new'
};
export const SHELL_MODES: Record<string, ShellModes> = {
	CARBONIO: 'carbonio',
	STANDALONE: 'carbonioStandalone',
	ADMIN: 'carbonioAdmin'
};
export const BASENAME: string;
export const getIntegratedHook: (id: string) => [Function, boolean];
export const getIntegratedFunction: (id: string) => [Function, boolean];
export const getIntegratedComponent: (id: string) => [ComponentType<unknown>, boolean];
export const getActions: <T>(target: T, type: string) => Array<Action>;
export const getActionsFactory: (type: string) => <T>(target: T) => Array<Action>;
export const getAction: <T>(type: string, id: string, target?: T) => [Action | undefined, boolean];
export const getActionFactory: <T>(
	type: string,
	id: string
) => [ActionFactory<T> | undefined, boolean];
export const useIntegratedHook: (id: string) => [Function, boolean];
export const useIntegratedFunction: (id: string) => [Function, boolean];
export const useIntegratedComponent: (id: string) => [ComponentType<unknown>, boolean];
export const useActions: <T>(target: T, type: string) => Array<Action>;
export const useActionsFactory: <T>(type: string) => CombinedActionFactory<T>;
export const useAction: <T>(type: string, id: string, target?: T) => [Action | undefined, boolean];
export const useActionFactory: <T>(
	type: string,
	id: string
) => [ActionFactory<T> | undefined, boolean];
export const useApp: () => CarbonioModule;
export const getApp: () => CarbonioModule;
export const useAppContext: () => unknown;
export const getAppContext: () => unknown;
export const useUserAccount: () => Account;
export const useUserAccounts: () => Array<Account>;
export const useUserRights: () => AccountRights;
export const useUserRight: (right: AccountRightName) => Array<AccountRightTarget>;
export const getUserAccount: () => Account;
export const getUserAccounts: () => Array<Account>;
export const getUserRights: () => AccountRights;
export const getUserRight: (right: AccountRightName) => Array<AccountRightTarget>;
export const useTags: () => Array<Tag>;
export const getTags: () => Array<Tag>;
export const useUserSettings: () => AccountSettings;
export const useUserSetting: <T = void>(...path: Array<string>) => string | T;
export const getUserSettings: () => AccountSettings;
export const getUserSetting: <T = void>(...path: Array<string>) => string | T;
export const store: {
	store: Store<any>;
	setReducer(nextReducer: Reducer): void;
};
export const useNotify: () => Array<NotifyObject>;
export const useRefresh: () => NotifyObject;
export const Applink: FC<LinkProps>;
export const Spinner: FC;
export const useAddBoardCallback: () => (
	path: string,
	context?: { app?: string; title?: string }
) => void;
export const useUpdateCurrentBoard: () => (url: string, title: string) => void;
export const useRemoveCurrentBoard: () => () => void;
export const useBoardConfig: <T>() => T;

export const useIsMobile: () => boolean;
export const soapFetch: SoapFetch;
export const xmlSoapFetch: SoapFetch;
export const report: (error: Error, hint?: unknown) => void;
export const setAppContext: <T>(obj: T) => void;

export const removeActions: (...ids: Array<string>) => void;
export const registerActions: (
	...items: Array<{ id: string; action: ActionFactory<unknown>; type: string }>
) => void;
export const removeComponents: (...ids: Array<string>) => void;
export const registerComponents: (
	...items: Array<{ id: string; component: ComponentType }>
) => void;
export const removeHooks: (...ids: Array<string>) => void;
export const registerHooks: (...items: Array<{ id: string; hook: AnyFunction }>) => void;
export const removeFunctions: (...ids: Array<string>) => void;
export const registerFunctions: (...items: Array<{ id: string; fn: AnyFunction }>) => void;
// add route (id route primaryBar secondaryBar app)
export const addRoute: (routeData: Partial<AppRouteDescriptor>) => string;
export const setRouteVisibility: (id: string, visible: boolean) => void;
// remove route (id | route)
export const removeRoute: (id: string) => void;
//
// update primaryBar
export const updatePrimaryBadge: (badge: Partial<BadgeInfo>, id: string) => void;
export const updateUtilityBadge: (badge: Partial<BadgeInfo>, id: string) => void;
//
// add board
export const addBoardView: (data: Partial<BoardView>) => string;
// remove board
export const removeBoardView: (id: string) => void;
//
// add settings
export const addSettingsView: (data: Partial<SettingsView>) => string;
// remove settings
export const removeSettingsView: (id: string) => void;
//
// add search
export const addSearchView: (data: Partial<SearchView>) => string;
// remove search
export const removeSearchView: (id: string) => void;
//
// add utility
export const addUtilityView: (data: Partial<UtilityView>) => string;
// remove utility
export const removeUtilityView: (id: string) => void;
//
// add primaryAccessory
export const addPrimaryAccessoryView: (data: Partial<PrimaryAccessoryView>) => string;
// remove primaryAccessory
export const removePrimaryAccessoryView: (id: string) => void;
//
// add secondaryAccessory
export const addSecondaryAccessoryView: (data: Partial<SecondaryAccessoryView>) => string;
// remove secondaryAccessory
export const removeSecondaryAccessoryView: (id: string) => void;
export const usePushHistoryCallback: () => (params: HistoryParams) => void;
export const useReplaceHistoryCallback: () => (params: HistoryParams) => void;
export const useGoBackHistoryCallback: () => () => void;
export const pushHistory: (params: HistoryParams) => void;
export const replaceHistory: (params: HistoryParams) => void;
export const goBackHistory: () => void;
export const useCurrentRoute: () => AppRoute | undefined;
export const getCurrentRoute: () => AppRoute | undefined;
