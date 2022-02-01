/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
// The 'useXXX' functions actually return hooks
/* eslint-disable react-hooks/rules-of-hooks */

import { reduce } from 'lodash';
import { getApp, getAppContext, useApp, useAppContext } from '../../store/app';
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
	useRefresh,
	useUserRight,
	useUserRights,
	getUserRight,
	getUserRights
} from '../../store/account';
import {
	getUseAddBoardCallback,
	useUpdateCurrentBoard,
	useRemoveCurrentBoard,
	useBoardConfig,
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
import { CarbonioModule } from '../../../types';
import { getEditSettingsForApp } from '../../network/edit-settings';

// eslint-disable-next-line @typescript-eslint/ban-types
export const getAppFunctions = (pkg: CarbonioModule): Record<string, Function> => ({
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
	getFactory,
	// ACCOUNTS AND STUFF
	useIsMobile,
	useUserAccount,
	getUserAccount,
	useUserAccounts,
	getUserAccounts,
	useUserSettings,
	getUserSettings,
	useUserRight,
	useUserRights,
	getUserRight,
	getUserRights,
	useTags,
	getTags,
	useNotify,
	useRefresh,
	useAddBoardCallback: getUseAddBoardCallback(pkg.name),
	useUpdateCurrentBoard,
	useRemoveCurrentBoard,
	useBoardConfig,
	getBridgedFunctions: (): unknown => {
		const { packageDependentFunctions, functions } = contextBridge.getState();
		return {
			...functions,
			...reduce(packageDependentFunctions, (acc, f, name) => ({ ...acc, [name]: f(pkg.name) }), {})
		};
	},
	editSettings: getEditSettingsForApp(pkg.name)
});
