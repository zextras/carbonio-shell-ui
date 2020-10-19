/* eslint-disable import/no-duplicates */
/* eslint-disable import/no-named-default */
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

import {
	default as Lodash, map, orderBy, compact, keyBy, pick
} from 'lodash';
import RxJS, { BehaviorSubject } from 'rxjs';
import React, { ComponentClass } from 'react';
import * as ReactDOM from 'react-dom';
import * as RxJSOperators from 'rxjs/operators';
import * as ReactRouterDom from 'react-router-dom';
import * as PropTypes from 'prop-types';
import * as Moment from 'moment';
import * as ReactI18n from 'react-i18next';
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import * as ZappUI from '@zextras/zapp-ui';
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import RichTextEditor from '../../zapp-ui/src/components/inputs/RichTextEditor';
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import * as StyledComponents from 'styled-components';
// import RevertableActionCollection from '../../extension/RevertableActionCollection';
import { IAccount } from '../db/account';
import * as hooks from '../shell/hooks';
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import SharedUiComponentsFactory from '../shared-ui-components/shared-ui-components-factory';

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import AppLink from './app-link';
import { wrapAppDbConstructor } from './app-db';
import { FC, IFiberChannelFactory } from '../fiberchannel/fiber-channel-types';
import validateSharedUiComponent from '../shared-ui-components/shared-ui-components-validator';
import ShellNetworkService from '../network/shell-network-service';
import {
	AppCreateOption, AppPkgDescription, AppRouteDescription, FCSink, MainMenuItemData, SoapFetch
} from '../../types';

type AppModuleFunction = () => void;

type IChildWindow = Window & {
	__ZAPP_SHARED_LIBRARIES__: SharedLibrariesAppsMap;
	__ZAPP_EXPORT__: (value?: AppModuleFunction | PromiseLike<AppModuleFunction> | undefined) => void;
	__ZAPP_HMR_EXPORT__: (mod: AppModuleFunction) => void;
};

type SharedLibrariesAppsMap = {
	'react': {};
	'react-dom': {};
	'react-i18next': {};
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
		db: {
			Database: any;
		};
		accounts: Array<{
			name: string;
			id: string;
			displayName: string;
		}>;
		network: {
			soapFetch: SoapFetch;
		};
		setMainMenuItems: (items: MainMenuItemData[]) => void;
		setRoutes: (routes: AppRouteDescription[]) => void;
		setCreateOptions: (options: AppCreateOption[]) => void;
		setAppContext: (obj: any) => void;
		addSharedUiComponent: (scope: string, componentClass: ComponentClass) => void;
		fiberChannel: FC;
		fiberChannelSink: FCSink;
		hooks: any;
		ui: any;
	};
	'@zextras/zapp-ui': {};
};

type SharedUiComponentsDescriptor = {
	[scope: string]: {
		pkg: AppPkgDescription;
		componentClass: ComponentClass;
	}[];
};

type LoadedAppRuntime = AppInjections & {
	pkg: AppPkgDescription;
};

export type LoadedAppsCache = {
	[pkgName: string]: LoadedAppRuntime;
};

type AppInjections = {
	mainMenuItems: BehaviorSubject<MainMenuItemData[]>;
	routes: BehaviorSubject<AppRouteDescription[]>;
	createOptions: BehaviorSubject<AppCreateOption[]>;
	appContext: BehaviorSubject<any>;
	sharedUiComponents: BehaviorSubject<SharedUiComponentsDescriptor>;
};

const _iframes: { [pkgName: string]: HTMLIFrameElement } = {};
// const _revertableActions: { [pkgName: string]: RevertableActionCollection } = {};

function loadAppModule(
	appPkg: AppPkgDescription,
	{
		mainMenuItems,
		routes,
		createOptions,
		sharedUiComponents,
		appContext,
	}: AppInjections,
	fiberChannelFactory: IFiberChannelFactory,
	accounts: Array<IAccount>,
	shellNetworkService: ShellNetworkService
): Promise<AppModuleFunction> {
	return new Promise((resolve, reject) => {
		try {
			const path = `${appPkg.resourceUrl}/${appPkg.entryPoint}`;
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
				(iframe.contentWindow as IChildWindow).__ZAPP_SHARED_LIBRARIES__ = {
					react: React,
					'react-dom': ReactDOM,
					'react-i18next': ReactI18n,
					lodash: Lodash,
					rxjs: RxJS,
					'rxjs/operators': RxJSOperators,
					'react-router-dom': {
						...ReactRouterDom,
						Link: AppLink
					},
					'styled-components': StyledComponents,
					'prop-types': PropTypes,
					moment: Moment,
					'@zextras/zapp-shell': {
						db: {
							Database: wrapAppDbConstructor(appPkg)
						},
						accounts: map(
							accounts,
							(acc) => pick(acc, ['name', 'id', 'displayName'])
						),
						setMainMenuItems: (items) => mainMenuItems.next(items),
						setRoutes: (r) => routes.next(r),
						setCreateOptions: (options) => createOptions.next(options),
						setAppContext: (obj: any) => appContext.next(obj),
						addSharedUiComponent: (scope: string, componentClass: ComponentClass) => {
							validateSharedUiComponent(componentClass);
							const scopes: SharedUiComponentsDescriptor = sharedUiComponents.getValue();
							sharedUiComponents.next({
								...scopes,
								[scope]: [
									...(scopes[scope] ? scopes[scope] : []),
									{
										pkg: appPkg,
										componentClass
									}
								]
							});
						},
						fiberChannel: fiberChannelFactory.getAppFiberChannel(appPkg),
						fiberChannelSink: fiberChannelFactory.getAppFiberChannelSink(appPkg),
						hooks,
						network: {
							soapFetch: shellNetworkService.getAppSoapFetch(appPkg)
						},
						ui: {
							SharedUiComponentsFactory
						}
					},
					'@zextras/zapp-ui': { ...ZappUI, RichTextEditor }
				};
				(iframe.contentWindow as IChildWindow).__ZAPP_EXPORT__ = resolve;
				// eslint-disable-next-line max-len
				(iframe.contentWindow as IChildWindow).__ZAPP_HMR_EXPORT__ = (extModule: AppModuleFunction): void => {
					// Errors are not collected here because the HMR works only on develpment mode.
					console.log(`HMR ${path}`, extModule);
					sharedUiComponents.next({});
					extModule.call(undefined);
				};
				switch (FLAVOR) {
					case 'NPM':
					case 'E2E':
						e2e.installOnWindow(iframe.contentWindow);
				}
				script.type = 'text/javascript';
				script.setAttribute('src', path);
				script.addEventListener('error', reject);
				iframe.contentDocument.body.appendChild(script);
				_iframes[appPkg.package] = iframe;
			}
			else reject(new Error('Cannot create extension loader'));
		}
		catch (err) {
			reject(err);
		}
	});
}

function loadApp(
	pkg: AppPkgDescription,
	fiberChannelFactory: IFiberChannelFactory,
	accounts: Array<IAccount>,
	shellNetworkService: ShellNetworkService
): Promise<LoadedAppRuntime|undefined> {
	// this._fcSink<{ package: string }>('app:preload', { package: pkg.package });
	const mainMenuItems = new BehaviorSubject<MainMenuItemData[]>([]);
	const routes = new BehaviorSubject<AppRouteDescription[]>([]);
	const createOptions = new BehaviorSubject<AppCreateOption[]>([]);
	const appContext = new BehaviorSubject<any>({});
	const sharedUiComponents = new BehaviorSubject<SharedUiComponentsDescriptor>({});
	return loadAppModule(
		pkg,
		{
			mainMenuItems,
			routes,
			createOptions,
			sharedUiComponents,
			appContext,
		},
		fiberChannelFactory,
		accounts,
		shellNetworkService
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
			mainMenuItems,
			routes,
			createOptions,
			sharedUiComponents,
			appContext
		} : undefined));
}

export function loadApps(
	accounts: Array<IAccount>,
	fiberChannelFactory: IFiberChannelFactory,
	shellNetworkService: ShellNetworkService
): Promise<LoadedAppsCache> {
	return Promise.all(
		map(
			orderBy(accounts[0].apps, 'priority'),
			(pkg) => loadApp(
				pkg,
				fiberChannelFactory,
				accounts,
				shellNetworkService
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
