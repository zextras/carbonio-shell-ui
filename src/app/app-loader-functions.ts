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
import {
	getApp,
	getAppContext,
	getIntegratedHook,
	getIntegratedFunction,
	getIntegratedAction,
	getIntegratedActionsByType,
	getIntegratedComponent
} from '../app-store/getters';
import { contextBridge } from '../app-store/context-bridge';

export const getAppGetters = (pkg: string): unknown => ({
	getAppContext: getAppContext(pkg),
	getApp: getApp(pkg),
	getIntegratedHook,
	getIntegratedFunction,
	getIntegratedAction,
	getIntegratedComponent,
	getIntegratedActionsByType,
	getBridgedFunctions: (): unknown => {
		const { packageDependentFunctions, functions } = contextBridge.getState();
		return {
			...functions,
			...reduce(packageDependentFunctions, (acc, f, name) => ({ ...acc, [name]: f(pkg) }), {})
		};
	}
});
