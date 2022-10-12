/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
// The 'useXXX' functions actually return hooks
/* eslint-disable react-hooks/rules-of-hooks */

import { reduce } from 'lodash';
import { CarbonioModule } from '../../../types';
import {
	getCurrentRoute,
	goBackHistory,
	pushHistory,
	replaceHistory,
	useCurrentRoute,
	useGoBackHistoryCallback,
	usePushHistoryCallback,
	useReplaceHistoryCallback
} from '../../history/hooks';
import { getSoapFetch, getXmlSoapFetch } from '../../network/fetch';
import { changeTagColor, createTag, deleteTag, renameTag } from '../../network/tags';
import { getNotificationManager } from '../../notification/NotificationManager';
import { runSearch } from '../../search/run-search';
import { useIsMobile, useLocalStorage } from '../../shell/hooks';
import {
	getUserAccount,
	getUserAccounts,
	getUserRight,
	getUserRights,
	getUserSetting,
	getUserSettings,
	useUserAccount,
	useUserAccounts,
	useUserRight,
	useUserRights,
	useUserSetting,
	useUserSettings
} from '../../store/account';
import { getApp, getAppContext, useApp, useAppContext } from '../../store/app';
import {
	addBoard,
	closeBoard,
	getBoardById,
	getBoardContextById,
	minimizeBoards,
	reopenBoards,
	setCurrentBoard,
	updateBoard,
	updateBoardContext,
	useBoard,
	useBoardById,
	useBoardContextById,
	useBoardHooks
} from '../../store/boards';
import { useContextBridge } from '../../store/context-bridge';
import {
	getFolder,
	getFolders,
	getRoot,
	getRootByUser,
	getRoots,
	getSearchFolder,
	getSearchFolders,
	setFolders,
	useFolder,
	useFolders,
	useFoldersAccordionByView,
	useFoldersByView,
	useRoot,
	useRootByUser,
	useRoots,
	useSearchFolder,
	useSearchFolders
} from '../../store/folder';
import { getI18n, getTFunction, useI18n } from '../../store/i18n';
import {
	getAction,
	getActionFactory,
	getActions,
	getActionsFactory,
	getIntegratedComponent,
	getIntegratedFunction,
	getIntegratedHook
} from '../../store/integrations/getters';
import {
	useAction,
	useActionFactory,
	useActions,
	useActionsFactory,
	useIntegratedComponent,
	useIntegratedFunction,
	useIntegratedHook
} from '../../store/integrations/hooks';
import { useNotify, useRefresh } from '../../store/network';
import { getTags, useTags } from '../../store/tags';

// eslint-disable-next-line @typescript-eslint/ban-types
export const getAppFunctions = (pkg: CarbonioModule): Record<string, Function> => ({
	// I18N
	useI18n: useI18n(pkg.name),
	getI18n: getI18n(pkg.name),
	t: getTFunction(pkg.name),
	// FETCH
	soapFetch: getSoapFetch(pkg.name),
	xmlSoapFetch: getXmlSoapFetch(pkg.name),

	// APP STORE FUNCTIONS
	useAppContext: useAppContext(pkg.name),
	getAppContext: getAppContext(pkg.name),
	useApp: useApp(pkg.name),
	getApp: getApp(pkg.name),

	// INTEGRATIONS
	useIntegratedHook,
	getIntegratedHook,
	useIntegratedFunction,
	getIntegratedFunction,
	useIntegratedComponent,
	getIntegratedComponent,
	useAction,
	getAction,
	useActions,
	getActions,
	useActionsFactory,
	getActionsFactory,
	useActionFactory,
	getActionFactory,
	// ACCOUNTS
	useUserAccount,
	getUserAccount,
	useUserAccounts,
	getUserAccounts,
	useUserSettings,
	getUserSettings,
	getUserSetting,
	useUserSetting,
	useUserRight,
	useUserRights,
	getUserRight,
	getUserRights,
	useTags,
	getTags,
	useNotify,
	useRefresh,
	// FOLDERS
	useFoldersAccordionByView,
	useFoldersByView,
	useFolder,
	getFolder,
	useFolders,
	getFolders,
	useRoot,
	getRoot,
	useRoots,
	getRoots,
	useSearchFolder,
	useSearchFolders,
	getSearchFolder,
	getSearchFolders,
	useRootByUser,
	getRootByUser,
	setFolders,
	// BOARDS
	addBoard: addBoard(pkg.name),
	closeBoard,
	updateBoard,
	updateBoardContext,
	getBoardById,
	getBoardContextById,
	useBoard,
	useBoardById,
	useBoardContextById,
	minimizeBoards,
	reopenBoards,
	setCurrentBoard,
	useBoardHooks,
	// HISTORY
	usePushHistoryCallback,
	useGoBackHistoryCallback,
	useReplaceHistoryCallback,
	useCurrentRoute,
	getCurrentRoute,
	pushHistory,
	goBackHistory,
	replaceHistory,
	// TAGS
	createTag,
	renameTag,
	changeTagColor,
	deleteTag,
	// NOTIFICATION
	getNotificationManager,

	// STUFF
	runSearch,
	useIsMobile,
	useLocalStorage,
	getBridgedFunctions: (): unknown => {
		const { packageDependentFunctions, functions } = useContextBridge.getState();
		return {
			...functions,
			...reduce(packageDependentFunctions, (acc, f, name) => ({ ...acc, [name]: f(pkg.name) }), {})
		};
	}
});
