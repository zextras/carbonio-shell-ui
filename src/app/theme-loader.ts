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
// eslint-disable-next-line
import { default as Lodash, map, orderBy } from 'lodash';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
// eslint-disable-next-line
import * as ZappUI from '@zextras/zapp-ui';
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import * as StyledComponents from 'styled-components';
// import RevertableActionCollection from '../../extension/RevertableActionCollection';
import { AccountAppsData, ThemePkgDescription } from '../db/account';
import { IFiberChannelFactory } from '../fiberchannel/fiber-channel-types';
import { AppPkgDescription } from '../../types';

type AppModuleFunction = () => void;

type IChildWindow = Window & {
	__ZAPP_SHARED_LIBRARIES__: SharedLibrariesAppsMap;
	__ZAPP_EXPORT__: (value?: AppModuleFunction | PromiseLike<AppModuleFunction> | undefined) => void;
	__ZAPP_HMR_EXPORT__: (mod: AppModuleFunction) => void;
};

type SharedLibrariesAppsMap = {
	'react': {};
	'react-dom': {};
	'lodash': {};
	'styled-components': {};
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

const _iframes: { [pkgName: string]: HTMLIFrameElement } = {};
// const _revertableActions: { [pkgName: string]: RevertableActionCollection } = {};

function loadThemeModule(
	appPkg: AppPkgDescription,
): Promise<AppModuleFunction> {
	return new Promise((resolve, reject) => { // eslint-disable-next-line
		const path = `${ appPkg.resourceUrl }/${ appPkg.entryPoint }`;
		const iframe: HTMLIFrameElement = document.createElement('iframe');
		iframe.style.display = 'none';
		// iframe.setAttribute('src', path);
		document.body.appendChild(iframe);
		if (iframe.contentWindow && iframe.contentDocument) {
			const script: HTMLScriptElement = iframe.contentDocument.createElement('script');
			(iframe.contentWindow as IChildWindow).__ZAPP_SHARED_LIBRARIES__ = {
				// eslint-disable-next-line
				'react': React,
				'react-dom': ReactDOM, // eslint-disable-next-line
				'lodash': Lodash,
				'styled-components': StyledComponents,
				'@zextras/zapp-ui': ZappUI
			};
			(iframe.contentWindow as IChildWindow).__ZAPP_EXPORT__ = resolve; // eslint-disable-next-line
			(iframe.contentWindow as IChildWindow).__ZAPP_HMR_EXPORT__ = (extModule: AppModuleFunction): void => {
				// Errors are not collected here because the HMR works only on development mode.
				// eslint-disable-next-line
				console.log(`HMR ${ path }`, extModule);
				extModule.call(undefined);
			}; // eslint-disable-next-line
			switch (FLAVOR) {
				case 'NPM':
				case 'E2E': // eslint-disable-next-line
					e2e.installOnWindow(iframe.contentWindow);
			}
			script.type = 'text/javascript';
			script.setAttribute('src', path);
			script.addEventListener('error', reject);
			iframe.contentDocument.body.appendChild(script);
			_iframes[appPkg.package] = iframe; // eslint-disable-next-line
		} else reject(new Error('Cannot create extension loader'));
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
		});
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
				to: { // eslint-disable-next-line
					version: PACKAGE_VERSION, // eslint-disable-next-line
					app: PACKAGE_NAME
				},
				event: 'all-apps-loaded',
				data: pkgTheme
			});
			return pkgTheme;
		});
}
