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
