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

import type { AppDependantFunctions as AppFunctions } from './boot/app/app-loader-functions';
import type { AppDependantSetters as AppSetters } from './boot/app/app-loader-setters';
import type { report as reportApp } from './reporting/functions';

// TODO: export only what is useful and not internal constants
export * from './constants';
export * from './ui-extras/app-link';
export * from './ui-extras/spinner';
export * from './settings/components/settings-header';

export declare const report: ReturnType<typeof reportApp>;

export declare const setAppContext: AppSetters['setAppContext'];
export declare const addRoute: AppSetters['addRoute'];
export declare const addBoardView: AppSetters['addBoardView'];
export declare const addSettingsView: AppSetters['addSettingsView'];
export declare const addSearchView: AppSetters['addSearchView'];
export declare const addUtilityView: AppSetters['addUtilityView'];
export declare const addPrimaryAccessoryView: AppSetters['addPrimaryAccessoryView'];
export declare const addSecondaryAccessoryView: AppSetters['addSecondaryAccessoryView'];
export declare const registerComponents: AppSetters['registerComponents'];
export declare const editSettings: AppSetters['editSettings'];
export {
	registerActions,
	removeActions,
	registerFunctions,
	removeFunctions,
	removeRoute,
	removeComponents,
	removeBoardView,
	removeSearchView,
	removeUtilityView,
	removeSettingsView,
	removeSecondaryAccessoryView,
	removePrimaryAccessoryView,
	setRouteVisibility,
	updateUtilityBadge,
	updatePrimaryBadge,
	upsertApp
} from './boot/app/app-loader-setters';

export declare const getI18n: AppFunctions['getI18n'];
export declare const t: AppFunctions['t'];
export declare const soapFetch: AppFunctions['soapFetch'];
export declare const xmlSoapFetch: AppFunctions['xmlSoapFetch'];
export declare const useAppContext: AppFunctions['useAppContext'];
export declare const getAppContext: AppFunctions['getAppContext'];
export declare const useApp: AppFunctions['useApp'];
export declare const getApp: AppFunctions['getApp'];
export declare const addBoard: AppFunctions['addBoard'];
/**
 * @deprecated Use hooks to access to functions which require context
 */
export declare const getBridgedFunctions: AppFunctions['getBridgedFunctions'];

export {
	useAction,
	useActions,
	useActionsFactory,
	useActionFactory,
	useIntegratedComponent,
	useIntegratedFunction
} from './boot/app/app-loader-functions';
export {
	getAction,
	getActions,
	getActionsFactory,
	getActionFactory,
	getIntegratedComponent,
	getIntegratedFunction
} from './boot/app/app-loader-functions';
export {
	getUserAccount,
	getUserAccounts,
	getUserSetting,
	getUserSettings,
	useUserAccount,
	useUserAccounts,
	useUserSetting,
	useUserSettings,
	useUserRight,
	useUserRights,
	getUserRight,
	getUserRights,
	useAuthenticated
} from './boot/app/app-loader-functions';
export { getTags, useTags } from './boot/app/app-loader-functions';
export { changeTagColor, createTag, deleteTag, renameTag } from './boot/app/app-loader-functions';
export { useNotify, useRefresh } from './boot/app/app-loader-functions';
export {
	getFolder,
	getFolders,
	useFolder,
	useFolders,
	useRoot,
	getRoot,
	useRoots,
	getRoots,
	useSearchFolder,
	useSearchFolders,
	getSearchFolder,
	getSearchFolders,
	useFoldersByView,
	useFoldersAccordionByView,
	useRootByUser,
	getRootByUser
} from './boot/app/app-loader-functions';
export {
	closeBoard,
	updateBoard,
	updateBoardContext,
	getBoardById,
	getBoardContextById,
	useBoardContextById,
	useBoardById,
	useBoard,
	minimizeBoards,
	reopenBoards,
	setCurrentBoard,
	useBoardHooks
} from './boot/app/app-loader-functions';
export {
	usePushHistoryCallback,
	useGoBackHistoryCallback,
	useReplaceHistoryCallback,
	getCurrentRoute,
	useCurrentRoute,
	replaceHistory,
	goBackHistory,
	pushHistory
} from './boot/app/app-loader-functions';
export { getNotificationManager } from './boot/app/app-loader-functions';
export { runSearch } from './boot/app/app-loader-functions';
export { useIsMobile } from './boot/app/app-loader-functions';
export { useLocalStorage } from './boot/app/app-loader-functions';
export { Tracker } from './boot/tracker';

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
