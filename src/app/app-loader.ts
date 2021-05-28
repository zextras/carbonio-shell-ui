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
	default as Lodash,
	map,
	orderBy,
	compact,
	keyBy,
	forEach,
	forOwn,
	reduce,
	filter
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
	AppSettingsRouteDescription,
	FCSink,
	MainMenuItemData,
	SoapFetch,
	ThemePkgDescription
} from '../../types';
import {
	useAddSharedFunction,
	useRemoveSharedFunction,
	useSharedFunction
} from '../zustand/selectors';
import { UnknownFunction } from '../zustand/store-types';

type IShellWindow<T, R> = Window & {
	__ZAPP_SHARED_LIBRARIES__: T;
	__ZAPP_HMR_EXPORT__: { [pkgName: string]: (appClass: R) => void };
	__ZAPP_HMR_HANDLERS__: { [pkgName: string]: (handlers: RequestHandlersList) => void };
};

type SharedLibrariesAppsMap = {
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
		[pkgName: string]: {
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
			setSettingsRoutes: (routes: AppSettingsRouteDescription[]) => void;
			setCreateOptions: (options: AppCreateOption[]) => void;
			setAppContext: (obj: any) => void;
			useSharedFunction: (id: string) => UnknownFunction | undefined;
			useAddSharedFunction: (id: string, fn: UnknownFunction) => void;
			useRemoveSharedFunction: (id: string) => void;
			registerSharedUiComponents: (components: SharedUiComponentsDescriptor) => void;
			fiberChannel: FC;
			fiberChannelSink: FCSink;
			hooks: unknown;
		};
	};
	'@zextras/zapp-ui': unknown;
	msw?: unknown;
	faker?: unknown;
};

type SharedLibrariesThemesMap = {
	react: unknown;
	'react-dom': unknown;
	lodash: unknown;
	'styled-components': unknown;
	'prop-types': unknown;
	'@zextras/zapp-ui': unknown;
	msw?: unknown;
	faker?: unknown;
};

type SharedUiComponentsDescriptor = {
	[id: string]: { pkg: AppPkgDescription; versions: { [version: string]: FC } };
};

type LoadedAppRuntime = AppInjections & {
	pkg: AppPkgDescription;
};

type LoadedThemeRuntime = ThemeInjections & {
	pkg: ThemePkgDescription;
};

export type LoadedAppsCache = {
	[pkgName: string]: LoadedAppRuntime;
};

export type LoadedThemesCache = {
	[pkgName: string]: LoadedThemeRuntime;
};

type AppInjections = {
	appContext: BehaviorSubject<any>;
	createOptions: BehaviorSubject<AppCreateOption[]>;
	entryPoint: BehaviorSubject<ComponentClass | null>;
	mainMenuItems: BehaviorSubject<MainMenuItemData[]>;
	routes: BehaviorSubject<AppRouteDescription[]>;
	settingsRoutes: BehaviorSubject<AppSettingsRouteDescription[]>;
	sharedUiComponents: BehaviorSubject<SharedUiComponentsDescriptor>;
	store: Store<any>;
};

type ThemeInjections = {
	entryPoint: BehaviorSubject<ComponentClass | null>;
};

const _scripts: { [pkgName: string]: HTMLScriptElement } = {};
let _scriptId = 0;
// const _revertableActions: { [pkgName: string]: RevertableActionCollection } = {};

function updateAppHandlers(appPkg: AppPkgDescription, handlers: RequestHandlersList): void {
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
	{
		appContext,
		createOptions,
		entryPoint,
		mainMenuItems,
		routes,
		settingsRoutes,
		sharedUiComponents,
		store
	}: AppInjections,
	fiberChannelFactory: IFiberChannelFactory,
	shellNetworkService: ShellNetworkService
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
				setMainMenuItems: (items): void => mainMenuItems.next(items),
				setRoutes: (r): void => routes.next(r),
				setSettingsRoutes: (r): void => settingsRoutes.next(r),
				setCreateOptions: (options): void => createOptions.next(options),
				setAppContext: (obj: any): void => appContext.next(obj),
				useAddSharedFunction: useAddSharedFunction(appPkg.package),
				useRemoveSharedFunction: useRemoveSharedFunction(appPkg.package),
				useSharedFunction,
				registerSharedUiComponents: (components: {
					[id: string]: { versions: { [version: string]: FC } };
				}): void => {
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
									pkg: appPkg,
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
			};

			// eslint-disable-next-line max-len
			((window as unknown) as IShellWindow<
				SharedLibrariesAppsMap,
				ComponentClass
			>).__ZAPP_HMR_EXPORT__[appPkg.package] = (appClass: ComponentClass): void => {
				entryPoint.next(appClass);
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
			script.addEventListener('error', (ev) => {
				fiberChannelFactory.getAppFiberChannelSink(appPkg)({
					event: 'report-exception',
					data: { exception: ev.error }
				});
				reject(ev.error);
			});
			document.body.appendChild(script);
			_scripts[`${appPkg.package}-loader-${(_scriptId += 1)}`] = script;
		} catch (err) {
			reject(err);
		}
	});
}

function loadThemeModule(
	themePkg: AppPkgDescription,
	{ entryPoint }: ThemeInjections,
	fiberChannelFactory: IFiberChannelFactory
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
				SharedLibrariesThemesMap,
				ComponentClass
			>).__ZAPP_HMR_EXPORT__[themePkg.package] = (appClass: ComponentClass): void => {
				entryPoint.next(appClass);
				resolve();
			};

			if (FLAVOR === 'NPM' && typeof cliSettings !== 'undefined' && cliSettings.hasHandlers) {
				// eslint-disable-next-line max-len
				((window as unknown) as IShellWindow<
					SharedLibrariesThemesMap,
					ComponentClass
				>).__ZAPP_HMR_HANDLERS__[themePkg.package] = (handlers: RequestHandlersList): void =>
					updateAppHandlers(themePkg, handlers);
			}
			const script: HTMLScriptElement = document.createElement('script');
			script.setAttribute('type', 'text/javascript');
			script.setAttribute('data-pkg_name', themePkg.package);
			script.setAttribute('data-pkg_version', themePkg.version);
			script.setAttribute('data-is_theme', 'true');
			script.setAttribute('src', `${themePkg.resourceUrl}/${themePkg.entryPoint}`);
			script.addEventListener('error', (ev) => {
				fiberChannelFactory.getAppFiberChannelSink(themePkg)({
					event: 'report-exception',
					data: { exception: ev.error }
				});
				reject(ev.error);
			});
			document.body.appendChild(script);
			_scripts[`${themePkg.package}-loader-${(_scriptId += 1)}`] = script;
		} catch (err) {
			reject(err);
		}
	});
}

function loadApp(
	pkg: AppPkgDescription,
	fiberChannelFactory: IFiberChannelFactory,
	shellNetworkService: ShellNetworkService,
	storeFactory: StoreFactory
): Promise<LoadedAppRuntime | undefined> {
	// this._fcSink<{ package: string }>('app:preload', { package: pkg.package });
	const mainMenuItems = new BehaviorSubject<MainMenuItemData[]>([]);
	const routes = new BehaviorSubject<AppRouteDescription[]>([]);
	const settingsRoutes = new BehaviorSubject<AppSettingsRouteDescription[]>([]);
	const createOptions = new BehaviorSubject<AppCreateOption[]>([]);
	const appContext = new BehaviorSubject<any>({});
	const sharedUiComponents = new BehaviorSubject<SharedUiComponentsDescriptor>({});
	const entryPoint = new BehaviorSubject<ComponentClass | null>(null);
	const store = storeFactory.getStoreForApp(pkg);
	return (
		loadAppModule(
			pkg,
			{
				appContext,
				createOptions,
				entryPoint,
				mainMenuItems,
				routes,
				settingsRoutes,
				sharedUiComponents,
				store
			},
			fiberChannelFactory,
			shellNetworkService
		)
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
			.then((loaded) =>
				loaded
					? {
							pkg,
							appContext,
							createOptions,
							entryPoint,
							mainMenuItems,
							routes,
							settingsRoutes,
							sharedUiComponents,
							store
					  }
					: undefined
			)
	);
}

function loadTheme(
	pkg: AppPkgDescription,
	fiberChannelFactory: IFiberChannelFactory
): Promise<LoadedThemeRuntime | undefined> {
	// this._fcSink<{ package: string }>('theme:preload', { package: pkg.package });
	const entryPoint = new BehaviorSubject<ComponentClass | null>(null);
	return (
		loadThemeModule(
			pkg,
			{
				entryPoint
			},
			fiberChannelFactory
		)
			// .then(() => {
			// 	this._fcSink<{ package: string; version: string }>('theme:loaded', {
			// 		package: pkg.package,
			// 		version: pkg.version
			// 	});
			// })
			// .catch((err) => {
			// 	this._fcSink<{ package: string; version: string; error: Error }>('theme:load-error', {
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
			.then((loaded) =>
				loaded
					? {
							pkg,
							entryPoint
					  }
					: undefined
			)
	);
}

function injectSharedLibraries(): void {
	// eslint-disable-next-line max-len
	const wnd: IShellWindow<
		SharedLibrariesAppsMap,
		ComponentClass
	> = (window as unknown) as IShellWindow<SharedLibrariesAppsMap, ComponentClass>;
	if (wnd.__ZAPP_SHARED_LIBRARIES__) {
		return;
	}
	wnd.__ZAPP_SHARED_LIBRARIES__ = {
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
		'@zextras/zapp-shell': {},
		'@zextras/zapp-ui': { ...ZappUI, RichTextEditor }
	};
	wnd.__ZAPP_HMR_EXPORT__ = {};
	switch (FLAVOR) {
		case 'NPM':
			wnd.__ZAPP_SHARED_LIBRARIES__.faker = Faker;
			wnd.__ZAPP_SHARED_LIBRARIES__.msw = Msw;
			wnd.__ZAPP_HMR_HANDLERS__ = {};
			break;
		default:
	}
}

export function loadApps(
	accounts: Array<Account>,
	fiberChannelFactory: IFiberChannelFactory,
	shellNetworkService: ShellNetworkService,
	storeFactory: StoreFactory
): Promise<LoadedAppsCache> {
	injectSharedLibraries();
	const orderedApps = orderBy(accounts[0]?.apps ?? [], 'priority');
	const apps =
		typeof cliSettings === 'undefined' || cliSettings.enableErrorReporter
			? orderedApps
			: filter(orderedApps, (pkg) => pkg.package !== 'com_zextras_zapp_error_reporter');
	return Promise.all(
		map(apps, (pkg) => loadApp(pkg, fiberChannelFactory, shellNetworkService, storeFactory))
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

export function loadThemes(
	accounts: Array<Account>,
	fiberChannelFactory: IFiberChannelFactory
): Promise<LoadedThemesCache> {
	injectSharedLibraries();
	const orderedThemes = orderBy(accounts[0].themes, 'priority');
	// Load only the first theme by priority
	const themes = orderedThemes.length < 1 ? [] : [orderedThemes[0]];
	return Promise.all(map(themes, (pkg) => loadTheme(pkg, fiberChannelFactory)))
		.then((loaded) => compact(loaded))
		.then((loaded) => keyBy(loaded, 'pkg.package'))
		.then((loaded) => {
			const sink = fiberChannelFactory.getShellFiberChannelSink();
			sink({
				to: {
					version: PACKAGE_VERSION,
					app: PACKAGE_NAME
				},
				event: 'all-themes-loaded',
				data: loaded
			});
			return loaded;
		});
}

export function unloadAppsAndThemes(): Promise<void> {
	return Promise.resolve().then(() => {
		forOwn(_scripts, (script) => {
			if (script.parentNode) script.parentNode.removeChild(script);
		});
	});
}
