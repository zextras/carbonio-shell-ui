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

import { reduce } from 'lodash';
import { getApp, getAppContext, useApp, useAppContext } from '../../store/app/hooks';
import { contextBridge } from '../../store/context-bridge';
import {
	getAction,
	getActions,
	getActionsFactory,
	getFactory,
	getIntegratedComponent,
	getIntegratedFunction,
	getIntegratedHook
} from '../../store/integrations/getters';
import {
	getUserAccount,
	getUserAccounts,
	getUserSettings,
	getTags,
	useUserAccount,
	useUserAccounts,
	useUserSettings,
	useTags,
	useNotify,
	useRefresh
} from '../../store/account/hooks';
import {
	getUseAddBoardCallback,
	useUpdateCurrentBoard,
	useRemoveCurrentBoard,
	useBoardConfig,
	getUsePushHistoryCallback,
	useGoBackHistoryCallback,
	getUseReplaceHistoryCallback,
	useIsMobile
} from '../../shell/hooks';
import {
	useAction,
	useActions,
	useActionsFactory,
	useActionFactory,
	useIntegratedComponent,
	useIntegratedFunction,
	useIntegratedHook
} from '../../store/integrations/hooks';

export const getAppFunctions = (pkg: string): unknown => ({
	// The returned function is a hook
	// eslint-disable-next-line react-hooks/rules-of-hooks
	useAppContext: useAppContext(pkg),
	getAppContext: getAppContext(pkg),
	// The returned function is a hook
	// eslint-disable-next-line react-hooks/rules-of-hooks
	useApp: useApp(pkg),
	getApp: getApp(pkg),
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
	getFactory,
	useIsMobile,
	useUserAccount,
	getUserAccount,
	useUserAccounts,
	getUserAccounts,
	useUserSettings,
	getUserSettings,
	useTags,
	getTags,
	useNotify,
	useRefresh,
	useAddBoardCallback: getUseAddBoardCallback(pkg),
	useUpdateCurrentBoard,
	useRemoveCurrentBoard,
	useBoardConfig,
	usePushHistoryCallback: getUsePushHistoryCallback(pkg),
	useGoBackHistoryCallback,
	useReplaceHistoryCallback: getUseReplaceHistoryCallback(pkg),
	getBridgedFunctions: (): unknown => {
		const { packageDependentFunctions, functions } = contextBridge.getState();
		return {
			...functions,
			...reduce(packageDependentFunctions, (acc, f, name) => ({ ...acc, [name]: f(pkg) }), {})
		};
	}
});
