import {
	getApp,
	getAppContext,
	getIntegratedHook,
	getIntegratedFunction,
	getIntegratedAction,
	getIntegratedComponent
} from '../app-store/getters';

export const getAppGetters = (pkg: string): unknown => ({
	getAppContext: getAppContext(pkg),
	getApp: getApp(pkg),
	getIntegratedHook,
	getIntegratedFunction,
	getIntegratedAction,
	getIntegratedComponent
});
