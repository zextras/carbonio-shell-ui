/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import type { AppDependantFunctions } from './boot/app/app-loader-functions';
import type { AppDependantSetters } from './boot/app/app-loader-setters';
import { report as reportApp } from './reporting/functions';

// TODO: export only what is useful and not internal constants
export * from './constants/index';
export * from './ui-extras/app-link';
export * from './ui-extras/spinner';
export * from './settings/components/settings-header';

export declare const report: ReturnType<typeof reportApp>;

export declare const setAppContext: AppDependantSetters['setAppContext'];
export declare const addRoute: AppDependantSetters['addRoute'];
export declare const addBoardView: AppDependantSetters['addBoardView'];
export declare const addSettingsView: AppDependantSetters['addSettingsView'];
export declare const addSearchView: AppDependantSetters['addSearchView'];
export declare const addUtilityView: AppDependantSetters['addUtilityView'];
export declare const addPrimaryAccessoryView: AppDependantSetters['addPrimaryAccessoryView'];
export declare const addSecondaryAccessoryView: AppDependantSetters['addSecondaryAccessoryView'];
export declare const registerComponents: AppDependantSetters['registerComponents'];
export declare const editSettings: AppDependantSetters['editSettings'];
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
	updatePrimaryBadge
} from './boot/app/app-loader-setters';

export declare const getI18n: AppDependantFunctions['getI18n'];
export declare const t: AppDependantFunctions['t'];
export declare const soapFetch: AppDependantFunctions['soapFetch'];
export declare const xmlSoapFetch: AppDependantFunctions['xmlSoapFetch'];
export declare const useAppContext: AppDependantFunctions['useAppContext'];
export declare const getAppContext: AppDependantFunctions['getAppContext'];
export declare const useApp: AppDependantFunctions['useApp'];
export declare const getApp: AppDependantFunctions['getApp'];
export declare const addBoard: AppDependantFunctions['addBoard'];
/**
 * @deprecated Use hooks to access to functions which require context
 */
export declare const getBridgedFunctions: AppDependantFunctions['getBridgedFunctions'];
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
