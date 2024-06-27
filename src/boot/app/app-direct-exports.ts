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
	useActionsFactory,
	useActionFactory,
	useIntegratedComponent,
	useIntegratedFunction
} from '../../store/integrations/hooks';

export {
	getAction,
	getActions,
	getActionsFactory,
	getActionFactory,
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
	useAuthenticated
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

export { useIsMobile } from '../../shell/hooks/useIsMobile';

export { useLocalStorage } from '../../shell/hooks/useLocalStorage';

export const {
	updatePrimaryBadge,
	updateUtilityBadge,
	setRouteVisibility,
	removeRoute,
	removeBoardView,
	removeSettingsView,
	removeSearchView,
	removeUtilityView,
	removePrimaryAccessoryView,
	removeSecondaryAccessoryView,
	/**
	 * Add or update the translatable display and description labels for an app.
	 * These fields are the ones used in the UI.
	 * @param app - The app to update based on the name field
	 * @example
	 * upsertApp(\{
	 *     name: 'carbonio-example-ui',
	 *     display: t('label.app_name', 'Example')
	 *     description: t('label.app_description', 'Example module')
	 * \});
	 */
	upsertApp
} = useAppStore.getState();

export { Tracker } from '../tracker';
