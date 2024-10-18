/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useAppStore } from '../../store/app';
import { useIntegrationsStore } from '../../store/integrations/store';

export {
	useAction,
	useActions,
	useIntegratedComponent,
	useIntegratedFunction
} from '../../store/integrations/hooks';

export {
	getAction,
	getActions,
	getIntegratedComponent,
	getIntegratedFunction
} from '../../store/integrations/getters';

export const {
	registerFunctions,
	removeFunctions,
	registerActions,
	removeActions,
	removeComponents
} = useIntegrationsStore.getState();

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
	useAuthenticated,
	updateSettings,
	updateAccount
} from '../../store/account';

export { getTags, useTags } from '../../store/tags';
export { changeTagColor, createTag, deleteTag, renameTag } from '../../network/tags';

export { useNotify, useRefresh } from '../../store/network';

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
} from '../../store/folder';

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
} from '../../store/boards';

export {
	usePushHistoryCallback,
	useGoBackHistoryCallback,
	useReplaceHistoryCallback,
	getCurrentRoute,
	useCurrentRoute,
	replaceHistory,
	goBackHistory,
	pushHistory
} from '../../history/hooks';

export { getNotificationManager } from '../../notification/NotificationManager';

export { runSearch } from '../../search/run-search';

export { useLocalStorage } from '../../shell/hooks/useLocalStorage';

export const {
	updatePrimaryBadge,
	setRouteVisibility,
	removeRoute,
	removeBoardView,
	removeSettingsView,
	removeSearchView,
	removeUtilityView,
	removePrimaryAccessoryView,
	removeSecondaryAccessoryView
} = useAppStore.getState();

export { useIsCarbonioCE } from '../../store/login/hooks';

export type { NewAction } from '../../shell/creation-button';
export { useTracker } from '../../tracker/tracker';
