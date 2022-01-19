/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

/* eslint-disable import/no-duplicates */
/* eslint-disable import/no-named-default */
import { forEach, forOwn } from 'lodash';
// import { RequestHandlersList } from 'msw/lib/types/setupWorker/glossary';
// import { SetupWorkerApi } from 'msw/lib/types/setupWorker/setupWorker';

import { ComponentClass } from 'react';
import { Store } from '@reduxjs/toolkit';
import StoreFactory from '../../redux/store-factory';

import { appStore } from '../../store/app/store';
import { getAppFunctions } from './app-loader-functions';
import { getAppLink } from './app-link';
import { Spinner } from '../../ui-extras/spinner';
import {
	ZIMBRA_STANDARD_COLORS,
	FOLDERS,
	SHELL_APP_ID,
	SETTINGS_APP_ID,
	SEARCH_APP_ID,
	ACTION_TYPES
} from '../../constants';
import { useIntegrationsStore } from '../../store/integrations/store';
import { report } from '../../network/report';
import { useAccountStore } from '../../store/account/store';
import {
	IShellWindow,
	LoadedAppRuntime,
	SharedLibrariesAppsMap,
	ZextrasModule
} from '../../../types';

export const _scripts: { [pkgName: string]: HTMLScriptElement } = {};
let _scriptId = 0;
// const _revertableActions: { [pkgName: string]: RevertableActionCollection } = {};

// export function updateAppHandlers(appPkg: ZextrasModule, handlers: RequestHandlersList): void {
// 	if (FLAVOR === 'NPM' && typeof devUtils !== 'undefined') {
// 		const worker = devUtils.getMSWorker<SetupWorkerApi>();
// 		if (worker) {
// 			worker.resetHandlers();
// 			forEach(handlers, (h) => worker.use(h));
// 		}
// 	}
// }

function loadAppModule(
	appPkg: ZextrasModule,
	store: Store<any>,
	setAppClass: (id: string, appClass: ComponentClass) => void
): Promise<void> {
	return new Promise((_resolve, _reject) => {
		let resolved = false;
		const resolve: (...args: any[]) => void = (...args) => {
			if (!resolved) {
				resolved = true;
				_resolve(...args);
			}
		};
		const reject: (e: Error) => void = (e) => {
			if (!resolved) {
				resolved = true;
				_reject(e);
			}
		};
		try {
			// eslint-disable-next-line max-len
			(
				window as unknown as IShellWindow<SharedLibrariesAppsMap, ComponentClass>
			).__ZAPP_SHARED_LIBRARIES__['@zextras/carbonio-shell-ui'][appPkg.name] = {
				store: {
					store,
					setReducer: (reducer): void => store.replaceReducer(reducer)
				},
				report: report(appPkg),
				soapFetch: useAccountStore.getState().soapFetch(appPkg.name),
				xmlSoapFetch: useAccountStore.getState().xmlSoapFetch(appPkg.name),
				registerAppData: appStore.getState().setters.registerAppData(appPkg.name),
				setAppContext: appStore.getState().setters.setAppContext(appPkg.name),
				registerHooks: useIntegrationsStore.getState().registerHooks,
				registerFunctions: useIntegrationsStore.getState().registerFunctions,
				registerActions: useIntegrationsStore.getState().registerActions,
				registerComponents: useIntegrationsStore.getState().registerComponents(appPkg.name),
				AppLink: getAppLink(appPkg.route),
				Spinner,
				FOLDERS,
				ZIMBRA_STANDARD_COLORS,
				SHELL_APP_ID,
				SETTINGS_APP_ID,
				SEARCH_APP_ID,
				ACTION_TYPES,
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				...getAppFunctions(appPkg)
			};

			// eslint-disable-next-line max-len
			(
				window as unknown as IShellWindow<SharedLibrariesAppsMap, ComponentClass>
			).__ZAPP_HMR_EXPORT__[appPkg.name] = (appClass: ComponentClass): void => {
				setAppClass(appPkg.name, appClass);
				resolve();
			};

			if (FLAVOR === 'NPM' && typeof cliSettings !== 'undefined' && cliSettings.hasHandlers) {
				// eslint-disable-next-line max-len
				// (
				// 	window as unknown as IShellWindow<SharedLibrariesAppsMap, ComponentClass>
				// ).__ZAPP_HMR_HANDLERS__[appPkg.name] = (handlers: RequestHandlersList): void =>
				// 	updateAppHandlers(appPkg, handlers);
			}
			const script: HTMLScriptElement = document.createElement('script');
			script.setAttribute('type', 'text/javascript');
			script.setAttribute('data-pkg_name', appPkg.name);
			script.setAttribute('data-pkg_version', appPkg.version);
			script.setAttribute('data-is_app', 'true');
			script.setAttribute('src', `${appPkg.js_entrypoint}`);
			document.body.appendChild(script);
			_scripts[`${appPkg.name}-loader-${(_scriptId += 1)}`] = script;
		} catch (err) {
			console.error(err);
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			reject(err);
		}
	});
}

export function loadApp(
	pkg: ZextrasModule,
	storeFactory: StoreFactory
): Promise<LoadedAppRuntime | undefined> {
	const store = storeFactory.getStoreForApp(pkg);
	const { setAppClass } = appStore.getState().setters;
	return loadAppModule(pkg, store, setAppClass)
		.then(() => true)
		.then((loaded) =>
			loaded
				? {
						pkg,
						store
				  }
				: undefined
		);
}

export function unloadApps(): Promise<void> {
	return Promise.resolve().then(() => {
		forOwn(_scripts, (script) => {
			if (script.parentNode) script.parentNode.removeChild(script);
		});
	});
}
