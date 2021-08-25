/*
 * *** BEGIN LICENSE BLOCK *****
 * Copyright (C) 2011-2021 Zextras
 *
 *  The contents of this file are subject to the Zextras EULA;
 * you may not use this file except in compliance with the EULA.
 * You may obtain a copy of the EULA at
 * http://www.zextras.com/zextras-eula.html
 * *** END LICENSE BLOCK *****
 */

import {
	useUserAccounts,
	useCSRFToken,
	useSaveSettingsCallback,
	useCurrentSync,
	useFirstSync,
	getUseAddBoardCallback,
	useUpdateCurrentBoard,
	useRemoveCurrentBoard,
	useBoardConfig,
	getUsePushHistoryCallback,
	useGoBackHistoryCallback,
	getUseReplaceHistoryCallback,
	useIsMobile
} from '../shell/hooks';
import { useApp, useAppContext } from '../app-store/hooks';
import {
	useAction,
	useActions,
	useActionsFactory,
	useActionFactory,
	useIntegratedComponent,
	useIntegratedFunction,
	useIntegratedHook
} from '../integrations/hooks';

export const getAppHooks = (pkg: string): unknown => ({
	// The returned function is a hook
	// eslint-disable-next-line react-hooks/rules-of-hooks
	useAppContext: useAppContext(pkg),
	// The returned function is a hook
	// eslint-disable-next-line react-hooks/rules-of-hooks
	useApp: useApp(pkg),
	useIntegratedHook,
	useIntegratedFunction,
	useIntegratedComponent,
	useAction,
	useActions,
	useActionsFactory,
	useActionFactory,
	useUserAccounts,
	useCSRFToken,
	useSaveSettingsCallback,
	useCurrentSync,
	useFirstSync,
	useAddBoardCallback: getUseAddBoardCallback(pkg),
	useUpdateCurrentBoard,
	useRemoveCurrentBoard,
	useBoardConfig,
	usePushHistoryCallback: getUsePushHistoryCallback(pkg),
	useGoBackHistoryCallback,
	useReplaceHistoryCallback: getUseReplaceHistoryCallback(pkg),
	useIsMobile
});
