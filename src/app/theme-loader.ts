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
import { ComponentClass, LazyExoticComponent } from 'react';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as RxJS from 'rxjs';
import * as RxJSOperators from 'rxjs/operators';
import * as ReactRouterDom from 'react-router-dom';
import * as PropTypes from 'prop-types';
import * as Moment from 'moment';
import * as ReactI18n from 'react-i18next';
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import * as ZappUI from "@zextras/zapp-ui";
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import * as StyledComponents from 'styled-components';
// import RevertableActionCollection from '../../extension/RevertableActionCollection';
import { AccountAppsData, AppPkgDescription, ThemePkgDescription } from '../db/account';
import * as hooks from '../shell/hooks';
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import SharedUiComponentsFactory from '../shared-ui-components/shared-ui-components-factory'

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import AppLink from './app-link';
import { wrapAppDbConstructor } from './app-db';
import { FC, FCSink, IFiberChannelFactory } from '../fiberchannel/fiber-channel-types';
import validateSharedUiComponent from '../shared-ui-components/shared-ui-components-validator';
import ShellDb from '../db/shell-db';
import ShellNetworkService from '../network/shell-network-service';

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

function loadThemeModule(
	appPkg: AppPkgDescription,
): Promise<AppModuleFunction> {
	return new Promise((resolve, reject) => {
		const path = `${ appPkg.resourceUrl }/${ appPkg.entryPoint }`;
		const iframe: HTMLIFrameElement = document.createElement('iframe');
		iframe.style.display = 'none';
		// iframe.setAttribute('src', path);
		document.body.appendChild(iframe);
		if (iframe.contentWindow && iframe.contentDocument) {
			const script: HTMLScriptElement = iframe.contentDocument.createElement('script');
			(iframe.contentWindow as IChildWindow).__ZAPP_SHARED_LIBRARIES__ = {
				'react': React,
				'react-dom': ReactDOM,
				'lodash': Lodash,
				'styled-components': StyledComponents,
				'@zextras/zapp-ui': ZappUI
			};
			(iframe.contentWindow as IChildWindow).__ZAPP_EXPORT__ = resolve;
			(iframe.contentWindow as IChildWindow).__ZAPP_HMR_EXPORT__ = (extModule: AppModuleFunction): void => {
				// Errors are not collected here because the HMR works only on development mode.
				console.log(`HMR ${ path }`, extModule);
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
		} else
			reject(new Error('Cannot create extension loader'));
	});
}

function loadTheme(
	pkg: ThemePkgDescription,
	fiberChannelFactory: IFiberChannelFactory,
	theme: any
): Promise<any|undefined> {
	// this._fcSink<{ package: string }>('app:preload', { package: pkg.package });
	return loadThemeModule(pkg)
		.then((themeModule) => themeModule.call(theme))
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
}

export function loadThemes(
	themes: AccountAppsData,
	fiberChannelFactory: IFiberChannelFactory,
	theme: any
): Promise<any> {
	return Promise.all(
		map(
			orderBy(themes, 'priority'),
			(pkg) => loadTheme(pkg, fiberChannelFactory, theme)
		)
	)
		.then((pkgTheme) => {
			const sink = fiberChannelFactory.getShellFiberChannelSink();
			sink({
				to: {
					version: PACKAGE_VERSION,
					app: PACKAGE_NAME
				},
				event: 'all-apps-loaded',
				data: pkgTheme
			});
			return pkgTheme;
		});
}
