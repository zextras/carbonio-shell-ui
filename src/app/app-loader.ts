/*
 * *** BEGIN LICENSE BLOCK *****
 * Copyright (C) 2011-2020 ZeXtras
 *
 * The contents of this file are subject to the ZeXtras EULA;
 * you may not use this file except in compliance with the EULA.
 * You may obtain a copy of the EULA at
 * http://www.zextras.com/zextras-eula.html
 * *** END LICENSE BLOCK *****
 */

import { default as Lodash, map, orderBy, compact, keyBy } from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { LazyExoticComponent } from 'react';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as RxJS from 'rxjs';
import * as RxJSOperators from 'rxjs/operators';
import * as ReactRouterDom from 'react-router-dom';
import * as PropTypes from 'prop-types';
import * as Moment from 'moment';
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import * as ZappUI from "@zextras/zapp-ui";
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import * as StyledComponents from 'styled-components';
// import RevertableActionCollection from '../../extension/RevertableActionCollection';
import { AccountAppsData, AppPkgDescription } from '../db/account';
import * as hooks from '../shell/hooks';

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import AppLink from './app-link';
import { wrapAppDbConstructor } from './app-db';
import { FC, FCSink, IFiberChannelFactory } from '../fiberchannel/fiber-channel-types';

type AppModuleFunction = () => void;

type IChildWindow = Window & {
	__ZAPP_SHARED_LIBRARIES__: SharedLibrariesAppsMap;
	__ZAPP_EXPORT__: (value?: AppModuleFunction | PromiseLike<AppModuleFunction> | undefined) => void;
	__ZAPP_HMR_EXPORT__: (mod: AppModuleFunction) => void;
};

type SharedLibrariesAppsMap = {
	'dexie': {};
	'react': {};
	'react-dom': {};
	'lodash': {};
	'rxjs': {};
	'rxjs/operators': {};
	'react-router-dom': {};
	'styled-components': {};
	'prop-types': {};
	'moment': {};
	'@zextras/zapp-shell': {
		// These signatures are in the documentation
		// If changed update also the documentation.
		setMainMenuItems: (items: MainMenuItemData[]) => void;
		setRoutes: (routes: AppRouteDescription[]) => void;
		setCreateOptions: (options: AppCreateOption[]) => void;
		setAppContext: (obj: any) => void;
		fiberChannel: FC;
		fiberChannelSink: FCSink;
		hooks: any;
	};
	'@zextras/zapp-ui': {};
};

// Type is in the documentation. If changed update also the documentation.
type MainSubMenuItemData = {
	id: string;
	icon?: string;
	label: string;
	to: string;
	children?: Array<MainSubMenuItemData>;
};

// Type is in the documentation. If changed update also the documentation.
type MainMenuItemData = {
	id: string;
	icon: string;
	label: string;
	to: string;
	children?: Array<MainSubMenuItemData>;
	app: string;
};

// Type is in the documentation. If changed update also the documentation.
type AppRouteDescription = {
	route: string;
	view: LazyExoticComponent<any>;
	label: LazyExoticComponent<any>;
};

// Type is in the documentation. If changed update also the documentation.
type AppCreateOption = {
	id: string;
	onClick?: () => void;
	panel?: {
		path: string;
	};
	label: string;
};

type LoadedAppRuntime = AppInjections & {
	pkg: AppPkgDescription;
};

type LoadedAppsCache = {
	[pkgName: string]: LoadedAppRuntime;
};

type AppInjections = {
	mainMenuItems: BehaviorSubject<MainMenuItemData[]>;
	routes: BehaviorSubject<AppRouteDescription[]>;
	createOptions: BehaviorSubject<AppCreateOption[]>;
	appContext: BehaviorSubject<any>;
};

const _iframes: { [pkgName: string]: HTMLIFrameElement } = {};
// const _revertableActions: { [pkgName: string]: RevertableActionCollection } = {};

function loadAppModule(
	appPkg: AppPkgDescription,
	{
		mainMenuItems,
		routes,
		createOptions,
		appContext
	}: AppInjections,
	fiberChannelFactory: IFiberChannelFactory,
): Promise<AppModuleFunction> {
	return new Promise((resolve, reject) => {
		const path = `${ appPkg.resourceUrl }/${ appPkg.entryPoint }`;
		const iframe: HTMLIFrameElement = document.createElement('iframe');
		iframe.style.display = 'none';
		// iframe.setAttribute('src', path);
		document.body.appendChild(iframe);
		if (iframe.contentWindow && iframe.contentDocument) {
			const script: HTMLScriptElement = iframe.contentDocument.createElement('script');
			// const revertables = _revertableActions[appPkg.package] = new RevertableActionCollection(
			// 	this._routerSrvc,
			// 	this._itemActionSrvc
			// );
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
			(iframe.contentWindow as IChildWindow).__ZAPP_SHARED_LIBRARIES__ = {
				'dexie': wrapAppDbConstructor(appPkg),
				'react': React,
				'react-dom': ReactDOM,
				'lodash': Lodash,
				'rxjs': RxJS,
				'rxjs/operators': RxJSOperators,
				'react-router-dom': {
					...ReactRouterDom,
					Link: AppLink
				},
				'styled-components': StyledComponents,
				'prop-types': PropTypes,
				'moment': Moment,
				'@zextras/zapp-shell': {
					setMainMenuItems: (items) => mainMenuItems.next(items),
					setRoutes: (r) => routes.next(r),
					setCreateOptions: (options) => createOptions.next(options),
					setAppContext: (obj: any) => appContext.next(obj),
					fiberChannel: fiberChannelFactory.getAppFiberChannel(appPkg),
					fiberChannelSink: fiberChannelFactory.getAppFiberChannelSink(appPkg),
					hooks,
				},
				'@zextras/zapp-ui': ZappUI
			};
			(iframe.contentWindow as IChildWindow).__ZAPP_EXPORT__ = resolve;
			(iframe.contentWindow as IChildWindow).__ZAPP_HMR_EXPORT__ = (extModule: AppModuleFunction): void => {
				console.log(`HMR ${ path }`, extModule);
				// revertables.revert();
				extModule.call(undefined);
			};
			script.type = 'text/javascript';
			script.setAttribute('src', path);
			script.addEventListener('error', reject);
			iframe.contentDocument.body.appendChild(script);
			_iframes[appPkg.package] = iframe;
		} else
			reject(new Error('Cannot create extension loader'));
	});
}

function loadApp(
	pkg: AppPkgDescription,
	fiberChannelFactory: IFiberChannelFactory
): Promise<LoadedAppRuntime|undefined> {
	// this._fcSink<{ package: string }>('app:preload', { package: pkg.package });
	const mainMenuItems = new BehaviorSubject<MainMenuItemData[]>([]);
	const routes = new BehaviorSubject<AppRouteDescription[]>([]);
	const createOptions = new BehaviorSubject<AppCreateOption[]>([]);
	const appContext = new BehaviorSubject<any>({});
	return loadAppModule(
		pkg,
		{
			mainMenuItems,
			routes,
			createOptions,
			appContext
		},
		fiberChannelFactory
	)
		.then((appModule) => appModule.call(undefined))
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
		.catch((e) => false)
		.then((loaded) => (loaded ? {
			pkg,
			mainMenuItems,
			routes,
			createOptions,
			appContext
		} : undefined));
}

export function loadApps(
	apps: AccountAppsData,
	fiberChannelFactory: IFiberChannelFactory
): Promise<LoadedAppsCache> {
	return Promise.all(
		map(
			orderBy(apps, 'priority'),
			(pkg) => loadApp(pkg, fiberChannelFactory)
		)
	)
		// .then(() => this._fcSink(
		// 	'app:all-loaded',
		// 	apps
		// ))
		.then((loaded) => compact(loaded))
		.then((loaded) => keyBy(loaded, 'pkg.package'));
}
