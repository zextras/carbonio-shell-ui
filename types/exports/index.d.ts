/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { i18n } from 'i18next';
import { ComponentType, Dispatch, FC, SetStateAction } from 'react';
import { TFunction } from 'react-i18next';
import { LinkProps } from 'react-router-dom';
import {
	Account,
	AccountRightName,
	AccountRights,
	AccountRightTarget,
	AccountSettings,
	SoapFetch
} from '../account';
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
import { Board, BoardHooksContext } from '../boards';
import { Folder, Folders } from '../folder';
import { Action, ActionFactory, AnyFunction, CombinedActionFactory } from '../integrations';
import { AccordionFolder, HistoryParams, ShellModes } from '../misc';
import { CreateTagResponse, Mods, SoapNotify, SoapRefresh, TagActionResponse } from '../network';
import { INotificationManager } from '../notification';
import { QueryChip } from '../search';
import { Tag, Tags } from '../tags';
import {ROOT_NAME} from "../../src/constants";

declare const getBridgedFunctions: () => {
	createModal: (...params: any[]) => void;
	createSnackbar: (...params: any[]) => void;
	getHistory: () => History;
};
declare const editSettings: (mods: Mods) => Promise<any>;
declare const ZIMBRA_STANDARD_COLORS: Array<{ zValue: number; hex: string; zLabel: string }>;
declare const FOLDERS: {
	[name: string]: string;
};
declare const SHELL_APP_ID = 'carbonio-shell-ui';
declare const SETTINGS_APP_ID = 'settings';
declare const SEARCH_APP_ID = 'search';
declare const ACTION_TYPES: {
	[name: string]: string;
};
declare const ROOT_NAME: string;
declare const SHELL_MODES: Record<string, ShellModes>;
declare const BASENAME: string;

declare const IS_STANDALONE: boolean;

// eslint-disable-next-line @typescript-eslint/ban-types
declare const getIntegratedHook: (id: string) => [Function, boolean];
// eslint-disable-next-line @typescript-eslint/ban-types
declare const getIntegratedFunction: (id: string) => [Function, boolean];
declare const getIntegratedComponent: (id: string) => [ComponentType<unknown>, boolean];
declare const getActions: <T>(target: T, type: string) => Array<Action>;
declare const getActionsFactory: (type: string) => <T>(target: T) => Array<Action>;
declare const getAction: <T>(type: string, id: string, target?: T) => [Action | undefined, boolean];
declare const getActionFactory: <T>(
	type: string,
	id: string
) => [ActionFactory<T> | undefined, boolean];
// eslint-disable-next-line @typescript-eslint/ban-types
declare const useIntegratedHook: (id: string) => [Function, boolean];
// eslint-disable-next-line @typescript-eslint/ban-types
declare const useIntegratedFunction: (id: string) => [Function, boolean];
declare const useIntegratedComponent: (id: string) => [ComponentType<unknown>, boolean];
declare const useActions: <T>(target: T, type: string) => Array<Action>;
declare const useActionsFactory: <T>(type: string) => CombinedActionFactory<T>;
declare const useAction: <T>(type: string, id: string, target?: T) => [Action | undefined, boolean];
declare const useActionFactory: <T>(
	type: string,
	id: string
) => [ActionFactory<T> | undefined, boolean];
declare const useApp: () => CarbonioModule;
declare const getApp: () => CarbonioModule;
declare const useAppContext: <T>() => T;
declare const getAppContext: <T>() => T;
declare const useUserAccount: () => Account;
declare const useUserAccounts: () => Array<Account>;
declare const useUserRights: () => AccountRights;
declare const useUserRight: (right: AccountRightName) => Array<AccountRightTarget>;
declare const getUserAccount: () => Account;
declare const getUserAccounts: () => Array<Account>;
declare const getUserRights: () => AccountRights;
declare const getUserRight: (right: AccountRightName) => Array<AccountRightTarget>;
declare const useTags: () => Tags;
declare const getTags: () => Tags;
declare const useTag: (id: string) => Tag;
declare const getTag: (id: string) => Tag;
declare const useFolder: (id: string) => BaseFolder | Folder | LinkFolder;
declare const getFolder: (id: string) => BaseFolder | Folder | LinkFolder;
declare const useFolders: () => Folders;
declare const getFolders: () => Folders;
declare const useRoot: (name: string) => Folder;
declare const getRoot: (name: string) => Folder;
declare const useRoots: () => Roots;
declare const getRoots: () => Roots;
declare const useRootByView: (view: string) => Folder;
declare const getRootByView: (view: string) => Folder;
declare const createTag: (tag: Omit<Tag, 'id'>) => Promise<CreateTagResponse>;
declare const renameTag: (id: string, name: string) => Promise<TagActionResponse>;
declare const deleteTag: (id: string) => Promise<TagActionResponse>;
declare const changeTagColor: (id: string, color: number | string) => Promise<TagActionResponse>;
declare const useUserSettings: () => AccountSettings;
declare const useUserSetting: <T = void>(...path: Array<string>) => string | T;
declare const getUserSettings: () => AccountSettings;
declare const getUserSetting: <T = void>(...path: Array<string>) => string | T;
declare const useNotify: () => Array<SoapNotify>;
declare const useRefresh: () => SoapRefresh;
declare const AppLink: FC<LinkProps>;
declare const Spinner: FC;

declare const useIsMobile: () => boolean;
declare const soapFetch: SoapFetch;
declare const xmlSoapFetch: SoapFetch;
declare const report: (error: Error, hint?: unknown) => void;
declare const setAppContext: <T>(obj: T) => void;

declare const removeActions: (...ids: Array<string>) => void;
declare const registerActions: (
	...items: Array<{ id: string; action: ActionFactory<unknown>; type: string }>
) => void;
declare const removeComponents: (...ids: Array<string>) => void;
declare const registerComponents: (
	...items: Array<{ id: string; component: ComponentType }>
) => void;
declare const removeHooks: (...ids: Array<string>) => void;
declare const registerHooks: (...items: Array<{ id: string; hook: AnyFunction }>) => void;
declare const removeFunctions: (...ids: Array<string>) => void;
declare const registerFunctions: (...items: Array<{ id: string; fn: AnyFunction }>) => void;
// add route (id route primaryBar secondaryBar app)
declare const addRoute: (routeData: Partial<AppRouteDescriptor>) => string;
declare const setRouteVisibility: (id: string, visible: boolean) => void;
// remove route (id | route)
declare const removeRoute: (id: string) => void;
//
// update primaryBar
declare const updatePrimaryBadge: (badge: Partial<BadgeInfo>, id: string) => void;
declare const updateUtilityBadge: (badge: Partial<BadgeInfo>, id: string) => void;
//
// add board
declare const addBoardView: (data: Record<string, unknown> & Partial<BoardView>) => string;
// remove board
declare const removeBoardView: (id: string) => void;
//
// add settings
declare const addSettingsView: (data: Partial<SettingsView>) => string;
// remove settings
declare const removeSettingsView: (id: string) => void;
//
// add search
declare const addSearchView: (data: Partial<SearchView>) => string;
// remove search
declare const removeSearchView: (id: string) => void;
//
// add utility
declare const addUtilityView: (data: Partial<UtilityView>) => string;
// remove utility
declare const removeUtilityView: (id: string) => void;
//
// add primaryAccessory
declare const addPrimaryAccessoryView: (data: Partial<PrimaryAccessoryView>) => string;
// remove primaryAccessory
declare const removePrimaryAccessoryView: (id: string) => void;
//
// add secondaryAccessory
declare const addSecondaryAccessoryView: (data: Partial<SecondaryAccessoryView>) => string;
// remove secondaryAccessory
declare const removeSecondaryAccessoryView: (id: string) => void;
declare const usePushHistoryCallback: () => (params: HistoryParams) => void;
declare const useReplaceHistoryCallback: () => (params: HistoryParams) => void;
declare const useGoBackHistoryCallback: () => () => void;
declare const pushHistory: (params: HistoryParams) => void;
declare const replaceHistory: (params: HistoryParams) => void;
declare const goBackHistory: () => void;
declare const useCurrentRoute: () => AppRoute | undefined;
declare const getCurrentRoute: () => AppRoute | undefined;

// FOLDERS

// ROOTS

// ROOTS BY USER
declare const useRootByUser: (userId: string) => Folder | SearchFolder | Record<string, never>;
declare const getRootByUser: (userId: string) => Folder | SearchFolder | Record<string, never>;

// SEARCHES

declare const useSearchFolder: (id: string) => SearchFolder | undefined;
declare const useSearchFolders: (id: string) => SearchFolder | undefined;
declare const getSearchFolder: () => Searches;
declare const getSearchFolders: () => Searches;

// Accordion-ize

declare const useFoldersByView: (view: string) => Array<Folder>;

declare const useFoldersAccordionByView: (
	view: string,
	CustomComponent: ComponentType<{ folder: Folder }>,
	itemProps?: (item: AccordionFolder) => Record<string, any>
) => Array<AccordionFolder>;

// NOTIFICATION
declare const getNotificationManager: () => INotificationManager;

// Run Search
declare const runSearch: (query: Array<QueryChip>, module: string) => void;

declare const useLocalStorage: <T>(
	key: string,
	initialValue: T
) => [T, Dispatch<SetStateAction<T>>];

// TRANSLATIONS
declare const getI18n: () => i18n;
declare const useI18n: () => i18n;
declare const t: TFunction;

declare const addBoard: <T = any>(
	board: Omit<Board<T>, 'app' | 'icon' | 'id'> & { id?: string; icon?: string },
	expanded?: boolean
) => Board;
declare const closeBoard: (id: string) => void;
declare const updateBoard: <T = any>(id: string, board: Partial<Board<T>>) => void;
declare const updateBoardContext: <T = any>(id: string, context: T) => void;
declare const getBoardById: <T>(id: string) => Board<T>;
declare const getBoardContextById: <T>(id: string) => T;
declare const useBoardContextById: <T>(id: string) => T;
declare const useBoardById: <T>(id: string) => Board<T>;
declare const minimizeBoards: () => void;
declare const reopenBoards: () => void;
declare const setCurrentBoard: (id: string) => void;
declare const useBoardHooks: () => BoardHooksContext;
declare const useBoard: <T>() => Board<T>;
