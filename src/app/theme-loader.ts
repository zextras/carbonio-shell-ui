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

import { forOwn, map, orderBy } from 'lodash';
import { RequestHandlersList } from 'msw/lib/types/setupWorker/glossary';
// import RevertableActionCollection from '../../extension/RevertableActionCollection';
import { IFiberChannelFactory } from '../fiberchannel/fiber-channel-types';
import { AccountAppsData, AppPkgDescription, ThemePkgDescription } from '../../types';
import { injectSharedLibraries, SharedLibrariesAppsMap } from './app-loader';

type AppModuleFunction = () => void;

export type IShellWindow<T> = Window & {
	__ZAPP_SHARED_LIBRARIES__: T;
	// eslint-disable-next-line max-len
	__ZAPP_EXPORT__: {[pkgName: string]: (value?: AppModuleFunction | PromiseLike<AppModuleFunction> | undefined) => void};
	__ZAPP_HMR_EXPORT__: {[pkgName: string]: (mod: AppModuleFunction) => void};
	__ZAPP_HANDLERS__: {[pkgName: string]: (handlers: RequestHandlersList) => void};
	__ZAPP_HMR_HANDLERS__: {[pkgName: string]: (handlers: RequestHandlersList) => void};
};

// Type is in the documentation. If changed update also the documentation.
type MainSubMenuItemData = {
	id: string;
	icon?: string;
	label: string;
	to: string;
	children?: Array<MainSubMenuItemData>;
};

const _scripts: { [pkgName: string]: HTMLScriptElement } = {};
let _scriptId = 0;
// const _revertableActions: { [pkgName: string]: RevertableActionCollection } = {};

function loadThemeModule(
	appPkg: AppPkgDescription,
	fiberChannelFactory: IFiberChannelFactory,
): Promise<AppModuleFunction> {
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
			(window as unknown as IShellWindow<SharedLibrariesAppsMap>).__ZAPP_EXPORT__[appPkg.package] = resolve;
			// eslint-disable-next-line max-len
			(window as unknown as IShellWindow<SharedLibrariesAppsMap>).__ZAPP_HMR_EXPORT__[appPkg.package] = (extModule: AppModuleFunction): void => {
				// Errors are not collected here because the HMR works only on develpment mode.
				console.log(`HMR '${appPkg.resourceUrl}/${appPkg.entryPoint}'`);
				extModule.call(undefined);
			};
			const script: HTMLScriptElement = document.createElement('script');
			script.setAttribute('type', 'text/javascript');
			script.setAttribute('data-pkg_name', appPkg.package);
			script.setAttribute('data-pkg_version', appPkg.version);
			script.setAttribute('data-is_theme', 'true');
			script.setAttribute('src', `${appPkg.resourceUrl}/${appPkg.entryPoint}`);
			script.addEventListener('error', (ev) => {
				fiberChannelFactory.getAppFiberChannelSink(appPkg)({ event: 'report-exception', data: { exception: ev.error } });
				reject(ev.error);
			});
			document.body.appendChild(script);
			_scripts[`${appPkg.package}-theme-${_scriptId += 1}`] = script;
		}
		catch (err) {
			reject(err);
		}
	});
}

function loadTheme(
	pkg: ThemePkgDescription,
	fiberChannelFactory: IFiberChannelFactory,
	theme: any
): Promise<any|undefined> {
	// this._fcSink<{ package: string }>('app:preload', { package: pkg.package });
	return loadThemeModule(
		pkg,
		fiberChannelFactory,
	)
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
	injectSharedLibraries();
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

export function unloadThemes(): Promise<void> {
	return Promise.resolve()
		.then(() => {
			forOwn(
				_scripts,
				(script) => {
					if (script.parentNode) script.parentNode.removeChild(script);
				}
			);
		});
}
