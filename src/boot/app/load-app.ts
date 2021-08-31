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

/* eslint-disable import/no-duplicates */
/* eslint-disable import/no-named-default */
import { forEach, forOwn } from 'lodash';
import { RequestHandlersList } from 'msw/lib/types/setupWorker/glossary';
import { SetupWorkerApi } from 'msw/lib/types/setupWorker/setupWorker';
import { Reducer } from 'redux';

import { LinkProps } from 'react-router-dom';
import { ComponentClass, FunctionComponent } from 'react';
import { Store } from '@reduxjs/toolkit';
import StoreFactory from '../../redux/store-factory';

import { AppPkgDescription, SoapFetch } from '../../../types';
import { appStore } from '../../store/app';
import { RuntimeAppData } from '../../store/app/store-types';
import { getAppGetters } from './app-loader-functions';
import { getAppHooks } from './app-loader-hooks';
import { getAppLink } from './app-link';
import { Spinner } from '../../ui-extras/spinner';
import { ZIMBRA_STANDARD_COLORS, FOLDERS } from '../../constants';
import { useIntegrationsStore } from '../../store/integrations/store';

export type IShellWindow<T, R> = Window & {
	__ZAPP_SHARED_LIBRARIES__: T;
	__ZAPP_HMR_EXPORT__: { [pkgName: string]: (appClass: R) => void };
	__ZAPP_HMR_HANDLERS__: { [pkgName: string]: (handlers: RequestHandlersList) => void };
};

export type SharedLibrariesAppsMap = {
	react: unknown;
	'react-dom': unknown;
	'react-i18next': unknown;
	'react-redux': unknown;
	'@reduxjs/toolkit': unknown;
	lodash: unknown;
	rxjs: unknown;
	'rxjs/operators': unknown;
	'react-router-dom': unknown;
	'styled-components': unknown;
	'prop-types': unknown;
	moment: unknown;
	'@zextras/zapp-shell': {
		[pkgName: string]: unknown & {
			store: {
				store: Store<unknown>;
				setReducer(nextReducer: Reducer): void;
			};
			soapFetch: SoapFetch;
			registerAppData: (data: RuntimeAppData) => void;
			setAppContext: (obj: unknown) => void;
			AppLink: FunctionComponent<LinkProps>;
			Spinner: FunctionComponent;
			List: FunctionComponent;
			FOLDERS: Record<string, string>;
			ZIMBRA_STANDARD_COLORS: Array<{ zValue: number; hex: string; zLabel: string }>;
		};
	};
	'@zextras/zapp-ui': unknown;
	msw?: unknown;
	faker?: unknown;
};

export type LoadedAppRuntime = AppInjections & {
	pkg: AppPkgDescription;
};

export type LoadedAppsCache = {
	[pkgName: string]: LoadedAppRuntime;
};

export type AppInjections = {
	store: Store<any>;
};

export const _scripts: { [pkgName: string]: HTMLScriptElement } = {};
let _scriptId = 0;
// const _revertableActions: { [pkgName: string]: RevertableActionCollection } = {};

export function updateAppHandlers(appPkg: AppPkgDescription, handlers: RequestHandlersList): void {
	if (FLAVOR === 'NPM' && typeof devUtils !== 'undefined') {
		const worker = devUtils.getMSWorker<SetupWorkerApi>();
		if (worker) {
			worker.resetHandlers();
			forEach(handlers, (h) => worker.use(h));
		}
	}
}

function loadAppModule(
	appPkg: AppPkgDescription,
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
			((window as unknown) as IShellWindow<
				SharedLibrariesAppsMap,
				ComponentClass
			>).__ZAPP_SHARED_LIBRARIES__['@zextras/zapp-shell'][appPkg.package] = {
				store: {
					store,
					setReducer: (reducer): void => store.replaceReducer(reducer)
				},
				registerAppData: appStore.getState().setters.registerAppData(appPkg.package),
				setAppContext: appStore.getState().setters.setAppContext(appPkg.package),
				registerHooks: useIntegrationsStore.getState().registerHooks,
				registerFunctions: useIntegrationsStore.getState().registerFunctions,
				registerActions: useIntegrationsStore.getState().registerActions,
				registerComponents: useIntegrationsStore.getState().registerComponents(appPkg.package),
				AppLink: getAppLink(appPkg.package),
				Spinner,
				FOLDERS,
				ZIMBRA_STANDARD_COLORS,
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				...getAppGetters(appPkg.package),
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				...getAppHooks(appPkg.package)
			};

			// eslint-disable-next-line max-len
			((window as unknown) as IShellWindow<
				SharedLibrariesAppsMap,
				ComponentClass
			>).__ZAPP_HMR_EXPORT__[appPkg.package] = (appClass: ComponentClass): void => {
				setAppClass(appPkg.package, appClass);
				resolve();
			};

			if (FLAVOR === 'NPM' && typeof cliSettings !== 'undefined' && cliSettings.hasHandlers) {
				// eslint-disable-next-line max-len
				((window as unknown) as IShellWindow<
					SharedLibrariesAppsMap,
					ComponentClass
				>).__ZAPP_HMR_HANDLERS__[appPkg.package] = (handlers: RequestHandlersList): void =>
					updateAppHandlers(appPkg, handlers);
			}
			const script: HTMLScriptElement = document.createElement('script');
			script.setAttribute('type', 'text/javascript');
			script.setAttribute('data-pkg_name', appPkg.package);
			script.setAttribute('data-pkg_version', appPkg.version);
			script.setAttribute('data-is_app', 'true');
			script.setAttribute('src', `${appPkg.resourceUrl}/${appPkg.entryPoint}`);
			document.body.appendChild(script);
			_scripts[`${appPkg.package}-loader-${(_scriptId += 1)}`] = script;
		} catch (err) {
			reject(err);
		}
	});
}

export function loadApp(
	pkg: AppPkgDescription,
	storeFactory: StoreFactory
): Promise<LoadedAppRuntime | undefined> {
	// this._fcSink<{ package: string }>('app:preload', { package: pkg.package });
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
