/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
// The 'useXXX' functions actually return hooks
/* eslint-disable react-hooks/rules-of-hooks */

import { reduce } from 'lodash';
import { getApp, getAppContext, useApp, useAppContext } from '../../store/app';
import { useContextBridge } from '../../store/context-bridge';
import {
	getAction,
	getActions,
	getActionsFactory,
	getActionFactory,
	getIntegratedComponent,
	getIntegratedFunction,
	getIntegratedHook
} from '../../store/integrations/getters';
import {
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
	getUserRights
} from '../../store/account';
import { useIsMobile, useLocalStorage } from '../../shell/hooks';
import {
	useAction,
	useActions,
	useActionsFactory,
	useActionFactory,
	useIntegratedComponent,
	useIntegratedFunction,
	useIntegratedHook
} from '../../store/integrations/hooks';
import { CarbonioModule } from '../../../types';
import {
	usePushHistoryCallback,
	useGoBackHistoryCallback,
	useReplaceHistoryCallback,
	getCurrentRoute,
	useCurrentRoute,
	replaceHistory,
	goBackHistory,
	pushHistory
} from '../../history/hooks';
import {
	getUseAddBoardCallback,
	useBoardConfig,
	useRemoveCurrentBoard,
	useUpdateCurrentBoard
} from '../../shell/boards/board-hooks';
import { getSoapFetch, getXmlSoapFetch } from '../../network/fetch';
import {
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
	useFoldersAccordionByView,
	useFoldersByView,
	useRootByUser,
	getRootByUser
} from '../../store/folder';
import { getTags, useTags } from '../../store/tags';
import { useNotify, useRefresh } from '../../store/network';
import { changeTagColor, createTag, deleteTag, renameTag } from '../../network/tags';
import { runSearch } from '../../search/run-search';
import { getNotificationManager } from '../../notification/NotificationManager';

// eslint-disable-next-line @typescript-eslint/ban-types
export const getAppFunctions = (pkg: CarbonioModule): Record<string, Function> => ({
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
	// BOARDS
	useAddBoardCallback: getUseAddBoardCallback(pkg.name),
	useUpdateCurrentBoard,
	useRemoveCurrentBoard,
	useBoardConfig,
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
