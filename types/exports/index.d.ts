/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
/* eslint-disable @typescript-eslint/ban-types */

import { ComponentType, Dispatch, FC, SetStateAction } from 'react';
import { LinkProps } from 'react-router-dom';
import { TFunction } from 'react-i18next';
import { i18n } from 'i18next';
import {
	AppRoute,
	AppRouteDescriptor,
	BadgeInfo,
	BoardView,
	CarbonioModule,
	PrimaryAccessoryView,
	SearchView,
	SecondaryAccessoryView,
	SettingsView,
	UtilityView
} from '../apps';
import { ActionFactory, AnyFunction, CombinedActionFactory, Action } from '../integrations';
import {
	AccountSettings,
	Account,
	AccountRights,
	AccountRightName,
	AccountRightTarget,
	SoapFetch
} from '../account';
import { Mods, TagActionResponse, CreateTagResponse, SoapNotify, SoapRefresh } from '../network';
import { HistoryParams, ShellModes, AccordionFolder } from '../misc';
import { Tag, Tags } from '../tags';
import { Folder, Folders } from '../folder';
import { QueryChip } from '../search';
import { Board, BoardHooksContext } from '../boards';

export const getBridgedFunctions: () => {
	createModal: (...params: any[]) => void;
	createSnackbar: (...params: any[]) => void;
	getHistory: () => History;
};
export const editSettings: (mods: Mods) => Promise<any>;
export const ZIMBRA_STANDARD_COLORS: Array<{ zValue: number; hex: string; zLabel: string }>;
export const FOLDERS: {
	[name: string]: string;
};
export const SHELL_APP_ID = 'carbonio-shell-ui';
export const SETTINGS_APP_ID = 'settings';
export const SEARCH_APP_ID = 'search';
export const ACTION_TYPES: {
	[name: string]: string;
};
export const SHELL_MODES: Record<string, ShellModes>;
export const BASENAME: string;

export const IS_STANDALONE: boolean;

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
export const useAppContext: <T>() => T;
export const getAppContext: <T>() => T;
export const useUserAccount: () => Account;
export const useUserAccounts: () => Array<Account>;
export const useUserRights: () => AccountRights;
export const useUserRight: (right: AccountRightName) => Array<AccountRightTarget>;
export const getUserAccount: () => Account;
export const getUserAccounts: () => Array<Account>;
export const getUserRights: () => AccountRights;
export const getUserRight: (right: AccountRightName) => Array<AccountRightTarget>;
export const useTags: () => Tags;
export const getTags: () => Tags;
export const useTag: (id: string) => Tag;
export const getTag: (id: string) => Tag;
export const useFolder: (id: string) => BaseFolder | Folder | LinkFolder;
export const getFolder: (id: string) => BaseFolder | Folder | LinkFolder;
export const useFolders: () => Folders;
export const getFolders: () => Folders;
export const useRoot: (name: string) => Folder;
export const getRoot: (name: string) => Folder;
export const useRoots: () => Roots;
export const getRoots: () => Roots;
export const useRootByView: (view: string) => Folder;
export const getRootByView: (view: string) => Folder;
export const createTag: (tag: Omit<Tag, 'id'>) => Promise<CreateTagResponse>;
export const renameTag: (id: string, name: string) => Promise<TagActionResponse>;
export const deleteTag: (id: string) => Promise<TagActionResponse>;
export const changeTagColor: (id: string, color: number | string) => Promise<TagActionResponse>;
export const useUserSettings: () => AccountSettings;
export const useUserSetting: <T = void>(...path: Array<string>) => string | T;
export const getUserSettings: () => AccountSettings;
export const getUserSetting: <T = void>(...path: Array<string>) => string | T;
export const useNotify: () => Array<SoapNotify>;
export const useRefresh: () => SoapRefresh;
export const AppLink: FC<LinkProps>;
export const Spinner: FC;

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
export const addBoardView: (data: Object & Partial<BoardView>) => string;
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

// FOLDERS

// ROOTS

// ROOTS BY USER
export const useRootByUser: (userId: string) => Folder | SearchFolder | Record<string, never>;
export const getRootByUser: (userId: string) => Folder | SearchFolder | Record<string, never>;

// SEARCHES

export const useSearchFolder: (id: string) => SearchFolder | undefined;
export const useSearchFolders: (id: string) => SearchFolder | undefined;
export const getSearchFolder: () => Searches;
export const getSearchFolders: () => Searches;

// Accordion-ize

export const useFoldersByView: (view: string) => Array<Folder>;

export const useFoldersAccordionByView: (
	view: string,
	CustomComponent: ComponentType<{ folder: Folder }>,
	itemProps?: (item: AccordionFolder) => Record<string, any>
) => Array<AccordionFolder>;

// Run Search
export const runSearch: (query: Array<QueryChip>, module: string) => void;

export const useLocalStorage: <T>(key: string, initialValue: T) => [T, Dispatch<SetStateAction<T>>];

export const getI18n: () => i18n;
export const useI18n: () => i18n;
export const t: TFunction;

export const addBoard: <T = any>(
	board: Omit<Board<T>, 'app' | 'icon' | 'id'> & { id?: string; icon?: string },
	expanded?: boolean
) => Board;
export const closeBoard: (id: string) => void;
export const updateBoard: <T = any>(id: string, board: Partial<Board<T>>) => void;
export const updateBoardContext: <T = any>(id: string, context: T) => void;
export const getBoardById: <T>(id: string) => Board<T>;
export const getBoardContextById: <T>(id: string) => T;
export const useBoardContextById: <T>(id: string) => T;
export const useBoardById: <T>(id: string) => Board<T>;
export const minimizeBoards: () => void;
export const reopenBoards: () => void;
export const setCurrentBoard: (id: string) => void;
export const useBoardHooks: () => BoardHooksContext;
export const useBoard: <T>() => Board<T>;
