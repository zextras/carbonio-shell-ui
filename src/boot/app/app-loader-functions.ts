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
import { getApp, getAppContext } from '../../store/app/getters';
import { contextBridge } from '../../store/app/context-bridge';
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
	getTags
} from '../../store/account/hooks';

export const getAppGetters = (pkg: string): unknown => ({
	getAppContext: getAppContext(pkg),
	getApp: getApp(pkg),
	getAction,
	getActions,
	getActionsFactory,
	getFactory,
	getIntegratedComponent,
	getIntegratedFunction,
	getIntegratedHook,
	getUserAccount,
	getUserAccounts,
	getUserSettings,
	getTags,
	getBridgedFunctions: (): unknown => {
		const { packageDependentFunctions, functions } = contextBridge.getState();
		return {
			...functions,
			...reduce(packageDependentFunctions, (acc, f, name) => ({ ...acc, [name]: f(pkg) }), {})
		};
	}
});
