/*
 * *** BEGIN LICENSE BLOCK *****
 * Copyright (C) 2011-2020 Zextras
 *
 *  The contents of this file are subject to the Zextras EULA;
 * you may not use this file except in compliance with the EULA.
 * You may obtain a copy of the EULA at
 * http://www.zextras.com/zextras-eula.html
 * *** END LICENSE BLOCK *****
 */

/* eslint-disable import/no-duplicates */
/* eslint-disable import/no-named-default */
import {
	default as Lodash, map, orderBy, compact, keyBy, forEach, forOwn, reduce
} from 'lodash';
import { RequestHandlersList } from 'msw/lib/types/setupWorker/glossary';
import { SetupWorkerApi } from 'msw/lib/types/setupWorker/setupWorker';
import { Reducer } from 'redux';
import * as RxJS from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import React, { ComponentClass } from 'react';
import * as ReactDOM from 'react-dom';
import * as RxJSOperators from 'rxjs/operators';
import * as ReactRouterDom from 'react-router-dom';
import * as PropTypes from 'prop-types';
import * as Moment from 'moment';
import * as ReactI18n from 'react-i18next';
import * as Msw from 'msw';
import * as Faker from 'faker';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as ReactRedux from 'react-redux';
import * as ReduxJSToolkit from '@reduxjs/toolkit';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as ZappUI from '@zextras/zapp-ui';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as StyledComponents from 'styled-components';
import { Store } from '@reduxjs/toolkit';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { RichTextEditor } from '@zextras/zapp-ui/dist/zapp-ui.rich-text-editor';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// import RevertableActionCollection from '../../extension/RevertableActionCollection';
import * as hooks from '../shell/hooks';
import StoreFactory from '../store/store-factory';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import AppLink from './app-link';
import { FC, IFiberChannelFactory } from '../fiberchannel/fiber-channel-types';
import ShellNetworkService from '../network/shell-network-service';
import {
	Account,
	AppCreateOption,
	AppPkgDescription,
	AppRouteDescription,
	FCSink,
	MainMenuItemData,
	SoapFetch
} from '../../types';

type IChildWindow<T> = Window & {
	__ZAPP_SHARED_LIBRARIES__: T;
	__ZAPP_EXPORT__: (value?: ComponentClass | PromiseLike<ComponentClass> | undefined) => void;
	__ZAPP_HMR_EXPORT__: (appClass: ComponentClass) => void;
	__ZAPP_HANDLERS__: (handlers: RequestHandlersList) => void;
	__ZAPP_HMR_HANDLERS__: (handlers: RequestHandlersList) => void;
};

type SharedLibrariesHandlersMap = {
	'lodash': unknown;
	'msw': unknown;
	'faker': unknown;
};

type SharedLibrariesAppsMap = {
	'react': unknown;
	'react-dom': unknown;
	'react-i18next': unknown;
	'react-redux': unknown;
	'@reduxjs/toolkit': unknown;
	'lodash': unknown;
	'rxjs': unknown;
	'rxjs/operators': unknown;
	'react-router-dom': unknown;
	'styled-components': unknown;
	'prop-types': unknown;
	'moment': unknown;
	'@zextras/zapp-shell': {
		// These signatures are in the documentation
		// If changed update also the documentation.
		store: {
			store: Store<any>;
			setReducer(nextReducer: Reducer): void;
		};
		network: {
			soapFetch: SoapFetch;
		};
		setMainMenuItems: (items: MainMenuItemData[]) => void;
		setRoutes: (routes: AppRouteDescription[]) => void;
		setCreateOptions: (options: AppCreateOption[]) => void;
		setAppContext: (obj: any) => void;
		registerSharedUiComponents: (components: SharedUiComponentsDescriptor) => void;
		fiberChannel: FC;
		fiberChannelSink: FCSink;
		hooks: unknown;
	};
	'@zextras/zapp-ui': unknown;
};

type SharedUiComponentsDescriptor = { [id: string]: { pkg: string, versions: { [version: string]: FC } } };

type LoadedAppRuntime = AppInjections & {
	pkg: AppPkgDescription;
};

export type LoadedAppsCache = {
	[pkgName: string]: LoadedAppRuntime;
};

type AppInjections = {
	appContext: BehaviorSubject<any>;
	createOptions: BehaviorSubject<AppCreateOption[]>;
	entryPoint: BehaviorSubject<ComponentClass|null>;
	mainMenuItems: BehaviorSubject<MainMenuItemData[]>;
	routes: BehaviorSubject<AppRouteDescription[]>;
	sharedUiComponents: BehaviorSubject<SharedUiComponentsDescriptor>;
	store: Store<any>;
};

const _iframes: { [pkgName: string]: HTMLIFrameElement } = {};
let _iframeId = 0;
// const _revertableActions: { [pkgName: string]: RevertableActionCollection } = {};

function updateAppHandlers(
	appPkg: AppPkgDescription,
	handlers: RequestHandlersList
): void {
	const worker = e2e.getMSWorker<SetupWorkerApi>();
	if (worker) {
		worker.resetHandlers();
		forEach(handlers, (h) => worker.use(h));
	}
}

function loadAppHandlers(
	appPkg: AppPkgDescription,
	fiberChannelFactory: IFiberChannelFactory,
): Promise<void> {
	if (appPkg.handlers) {
		return new Promise<void>((resolve, reject) => {
			try {
				const path = `${appPkg.resourceUrl}/${appPkg.handlers}`;
				const iframe: HTMLIFrameElement = document.createElement('iframe');
				iframe.setAttribute('data-pkg_name', appPkg.package);
				iframe.setAttribute('data-pkg_version', appPkg.version);
				iframe.setAttribute('data-is_app', 'true');
				iframe.style.display = 'none';
				document.body.appendChild(iframe);
				if (iframe.contentWindow && iframe.contentDocument) {
					const script: HTMLScriptElement = iframe.contentDocument.createElement('script');
					iframe.contentWindow.onerror = (
						msg,
						url,
						lineNo,
						columnNo,
						error
					): void => {
						fiberChannelFactory.getAppFiberChannelSink(appPkg)({ event: 'report-exception', data: { exception: error } });
					};
					// eslint-disable-next-line max-len
					(iframe.contentWindow as IChildWindow<SharedLibrariesHandlersMap>).__ZAPP_SHARED_LIBRARIES__ = {
						faker: Faker,
						lodash: Lodash,
						msw: Msw
					} as any;
					// eslint-disable-next-line max-len,@typescript-eslint/explicit-function-return-type
					(iframe.contentWindow as IChildWindow<SharedLibrariesHandlersMap>).__ZAPP_HANDLERS__ = (handlers) => {
						updateAppHandlers(appPkg, handlers);
						resolve();
					};
					// eslint-disable-next-line max-len,@typescript-eslint/explicit-function-return-type
					(iframe.contentWindow as IChildWindow<SharedLibrariesHandlersMap>).__ZAPP_HMR_HANDLERS__ = (handlers) => updateAppHandlers(appPkg, handlers);
					script.type = 'text/javascript';
					script.setAttribute('src', path);
					script.addEventListener('error', reject);
					iframe.contentDocument.body.appendChild(script);
					_iframes[`${appPkg.package}-handlers-${_iframeId += 1}`] = iframe;
				}
				else reject(new Error('Cannot create extension loader'));
			}
			catch (err) {
				reject(err);
			}
		});
	}
	return Promise.resolve();
}

function loadAppModule(
	appPkg: AppPkgDescription,
	{
		appContext,
		createOptions,
		entryPoint,
		mainMenuItems,
		routes,
		sharedUiComponents,
		store
	}: AppInjections,
	fiberChannelFactory: IFiberChannelFactory,
	shellNetworkService: ShellNetworkService
): Promise<ComponentClass> {
	return loadAppHandlers(appPkg, fiberChannelFactory)
		.then(() => new Promise((resolve, reject) => {
			try {
				const path = `${appPkg.resourceUrl}/${appPkg.entryPoint}`;
				const iframe: HTMLIFrameElement = document.createElement('iframe');
				iframe.setAttribute('data-pkg_name', appPkg.package);
				iframe.setAttribute('data-pkg_version', appPkg.version);
				iframe.setAttribute('data-is_handlers', 'true');
				iframe.style.display = 'none';
				document.body.appendChild(iframe);
				if (iframe.contentWindow && iframe.contentDocument) {
					const script: HTMLScriptElement = iframe.contentDocument.createElement('script');
					iframe.contentWindow.onerror = (
						msg,
						url,
						lineNo,
						columnNo,
						error
					): void => {
						fiberChannelFactory.getAppFiberChannelSink(appPkg)({ event: 'report-exception', data: { exception: error } });
					};
					// eslint-disable-next-line max-len
					// const revertables = _revertableActions[appPkg.package] = new RevertableActionCollection(
					// 	this._routerSrvc,
					// 	this._itemActionSrvc
					// );
					// eslint-disable-next-line
					// const syncOperations: BehaviorSubject<Array<ISyncOperation<unknown, ISyncOpRequest<unknown>>>> = new BehaviorSubject(
					// 	map(
					// 		loFilter(
					// 			this._syncSrvc.syncOperations.getValue(),
					// 			(op) => op.app.package === appPkg.package
					// 		),
					// 		(op) => op.operation
					// 	)
					// );
					// this._syncSrvc.syncOperations
					// 	.subscribe((ops) => {
					// 		syncOperations.next(
					// 			map(
					// 				loFilter(
					// 					ops,
					// 					(op) => op.app.package === appPkg.package
					// 				),
					// 				(op) => op.operation
					// 			)
					// 		);
					// 	});
					// eslint-disable-next-line max-len
					(iframe.contentWindow as IChildWindow<SharedLibrariesAppsMap>).__ZAPP_SHARED_LIBRARIES__ = {
						react: React,
						'react-dom': ReactDOM,
						'react-i18next': ReactI18n,
						'react-redux': ReactRedux,
						lodash: Lodash,
						rxjs: RxJS,
						'rxjs/operators': RxJSOperators,
						'react-router-dom': {
							...ReactRouterDom,
							Link: AppLink
						},
						moment: Moment,
						'prop-types': PropTypes,
						'styled-components': StyledComponents,
						'@reduxjs/toolkit': {
							...ReduxJSToolkit,
							configureStore: (): void => {
								throw new Error('Apps must use the store given by the Shell.');
							},
							createStore: (): void => {
								throw new Error('Apps must use the store given by the Shell.');
							}
						},
						'@zextras/zapp-shell': {
							store: {
								store,
								setReducer: (reducer): void => store.replaceReducer(reducer)
							},
							setMainMenuItems: (items): void => mainMenuItems.next(items),
							setRoutes: (r): void => routes.next(r),
							setCreateOptions: (options): void => createOptions.next(options),
							setAppContext: (obj: any): void => appContext.next(obj),
							registerSharedUiComponents: (
								components: { [id: string]: { versions: { [version: string]: FC } } }
							): void => {
								sharedUiComponents.next(
									reduce(
										components,
										(
											acc: SharedUiComponentsDescriptor,
											comp: { versions: Record<string, FC> },
											id: string
										): SharedUiComponentsDescriptor => ({
											...acc,
											[id]: {
												pkg: appPkg.package,
												versions: comp.versions
											}
										}),
										sharedUiComponents.getValue()
									)
								);
							},
							fiberChannel: fiberChannelFactory.getAppFiberChannel(appPkg),
							fiberChannelSink: fiberChannelFactory.getAppFiberChannelSink(appPkg),
							hooks,
							network: {
								soapFetch: shellNetworkService.getAppSoapFetch(appPkg)
							}
						},
						'@zextras/zapp-ui': { ...ZappUI, RichTextEditor }
					};
					(iframe.contentWindow as IChildWindow<SharedLibrariesAppsMap>).__ZAPP_EXPORT__ = resolve;
					// eslint-disable-next-line max-len
					(iframe.contentWindow as IChildWindow<SharedLibrariesAppsMap>).__ZAPP_HMR_EXPORT__ = (appClass: ComponentClass): void => {
						// Errors are not collected here because the HMR works only on develpment mode.
						console.log(`HMR ${path}`);
						entryPoint.next(appClass);
					};
					switch (FLAVOR) {
						case 'NPM':
						case 'E2E':
							e2e.installOnWindow(iframe.contentWindow);
							break;
						default:
					}
					script.type = 'text/javascript';
					script.setAttribute('src', path);
					script.addEventListener('error', reject);
					iframe.contentDocument.body.appendChild(script);
					_iframes[`${appPkg.package}-loader-${_iframeId += 1}`] = iframe;
				}
				else reject(new Error('Cannot create extension loader'));
			}
			catch (err) {
				reject(err);
			}
		}));
}

function loadApp(
	pkg: AppPkgDescription,
	fiberChannelFactory: IFiberChannelFactory,
	shellNetworkService: ShellNetworkService,
	storeFactory: StoreFactory,
): Promise<LoadedAppRuntime|undefined> {
	// this._fcSink<{ package: string }>('app:preload', { package: pkg.package });
	const mainMenuItems = new BehaviorSubject<MainMenuItemData[]>([]);
	const routes = new BehaviorSubject<AppRouteDescription[]>([]);
	const createOptions = new BehaviorSubject<AppCreateOption[]>([]);
	const appContext = new BehaviorSubject<any>({});
	const sharedUiComponents = new BehaviorSubject<SharedUiComponentsDescriptor>({});
	const entryPoint = new BehaviorSubject<ComponentClass|null>(null);
	const store = storeFactory.getStoreForApp(pkg);
	return loadAppModule(
		pkg,
		{
			appContext,
			createOptions,
			entryPoint,
			mainMenuItems,
			routes,
			sharedUiComponents,
			store
		},
		fiberChannelFactory,
		shellNetworkService
	)
		.then((appClass) => entryPoint.next(appClass))
		// .then(() => {
		// 	this._fcSink<{ package: string; version: string }>('app:loaded', {
		// 		package: pkg.package,
		// 		version: pkg.version
		// 	});
		// })
		// .catch((err) => {
		// 	this._fcSink<{ package: string; version: string; error: Error }>('app:load-error', {
		// 		package: pkg.package,
		// 		version: pkg.version,
		// 		error: err
		// 	});
		// })
		.then(() => true)
		.catch((e) => {
			const sink = fiberChannelFactory.getAppFiberChannelSink(pkg);
			sink({
				event: 'report-exception',
				data: {
					exception: e
				}
			});
			return false;
		})
		.then((loaded) => (loaded ? {
			pkg,
			appContext,
			createOptions,
			entryPoint,
			mainMenuItems,
			routes,
			sharedUiComponents,
			store
		} : undefined));
}

export function loadApps(
	accounts: Array<Account>,
	fiberChannelFactory: IFiberChannelFactory,
	shellNetworkService: ShellNetworkService,
	storeFactory: StoreFactory
): Promise<LoadedAppsCache> {
	return Promise.all(
		map(
			orderBy(accounts[0].apps, 'priority'),
			(pkg) => loadApp(
				pkg,
				fiberChannelFactory,
				shellNetworkService,
				storeFactory
			)
		)
	)
		.then((loaded) => compact(loaded))
		.then((loaded) => keyBy(loaded, 'pkg.package'))
		.then((loaded) => {
			const sink = fiberChannelFactory.getShellFiberChannelSink();
			sink({
				to: {
					version: PACKAGE_VERSION,
					app: PACKAGE_NAME
				},
				event: 'all-apps-loaded',
				data: loaded
			});
			return loaded;
		});
}

export function unloadApps(): Promise<void> {
	return Promise.resolve()
		.then(() => {
			forOwn(
				_iframes,
				(iframe) => {
					if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
				}
			);
		});
}
