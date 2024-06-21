/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { reduce } from 'lodash';

import { getSoapFetch, getXmlSoapFetch } from '../../network/fetch';
import { getApp, getAppContext, getAppHook, getAppContextHook } from '../../store/app';
import { addBoard } from '../../store/boards';
import type { ContextBridgeState } from '../../store/context-bridge';
import { useContextBridge } from '../../store/context-bridge';
import { getI18n, getTFunction } from '../../store/i18n/hooks';
import type { CarbonioModule } from '../../types/apps';

export type AppDependantFunctions = {
	getI18n: ReturnType<typeof getI18n>;
	t: ReturnType<typeof getTFunction>;
	soapFetch: ReturnType<typeof getSoapFetch>;
	xmlSoapFetch: ReturnType<typeof getXmlSoapFetch>;
	useAppContext: ReturnType<typeof getAppContextHook>;
	getAppContext: ReturnType<typeof getAppContext>;
	useApp: ReturnType<typeof getAppHook>;
	getApp: ReturnType<typeof getApp>;

	addBoard: ReturnType<typeof addBoard>;
	/**
	 * @deprecated Use hooks to access to functions which require context
	 */
	getBridgedFunctions: () => ContextBridgeState['functions'] & {
		[K in keyof ContextBridgeState['packageDependentFunctions']]: ReturnType<
			ContextBridgeState['packageDependentFunctions'][K]
		>;
	};
};

export const getAppDependantFunctions = (pkg: CarbonioModule): AppDependantFunctions => ({
	getI18n: getI18n(pkg.name),
	t: getTFunction(pkg.name),
	soapFetch: getSoapFetch(pkg.name),
	xmlSoapFetch: getXmlSoapFetch(pkg.name),
	useAppContext: getAppContextHook(pkg.name),
	getAppContext: getAppContext(pkg.name),
	useApp: getAppHook(pkg.name),
	getApp: getApp(pkg.name),
	addBoard: addBoard(pkg.name),
	getBridgedFunctions: (): ReturnType<AppDependantFunctions['getBridgedFunctions']> => {
		const { packageDependentFunctions, functions } = useContextBridge.getState();
		return {
			...functions,
			...reduce(packageDependentFunctions, (acc, f, name) => ({ ...acc, [name]: f(pkg.name) }), {})
		};
	}
});

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

export { useIsMobile } from '../../shell/hooks/useIsMobile';

export { useLocalStorage } from '../../shell/hooks/useLocalStorage';
