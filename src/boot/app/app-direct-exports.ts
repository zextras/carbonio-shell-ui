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
	expandBoards,
	reopenBoards,
	setCurrentBoard,
	useBoardHooks
} from '../../store/boards';

export { useCurrentRoute } from '../../history/hooks';

export { getNotificationManager } from '../../notification/NotificationManager';

export { useLocalStorage } from '../../shell/hooks/useLocalStorage';

export const {
	updatePrimaryBadge,
	setRouteVisibility,
	removeRoute,
	removeBoardView,
	removeSettingsView,
	removeUtilityView,
	removePrimaryAccessoryView,
	removeSecondaryAccessoryView,
	/**
	 * Add or update the translatable display label for an app.
	 * These fields are the ones used in the UI.
	 * @param app - The app to update based on the name field
	 * @example
	 * upsertApp(\{
	 *     name: 'carbonio-example-ui',
	 *     display: t('label.app_name', 'Example')
	 * \});
	 */
	upsertApp
} = useAppStore.getState();

export { useIsCarbonioCE } from '../../store/login/hooks';

export type { NewAction } from '../../shell/creation-button';
export type { AccountMenuAction } from '../../utility-bar/bar';
export { useTracker } from '../../tracker/tracker';

export { AppContextProvider } from './app-context-provider';

export type { AuthGuardProps } from '../../ui-extras/auth-guard';
export { AuthGuard } from '../../ui-extras/auth-guard';
