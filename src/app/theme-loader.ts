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

import { compact, forOwn, map, orderBy } from 'lodash';
import { BehaviorSubject, Subscription } from 'rxjs';
// import RevertableActionCollection from '../../extension/RevertableActionCollection';
import { IFiberChannelFactory } from '../fiberchannel/fiber-channel-types';
import { Account, AppPkgDescription, ThemePkgDescription } from '../../types';
import { injectSharedLibraries, IShellWindow, SharedLibrariesAppsMap } from './app-loader';

type ThemeInjections = {
	entryPoint: BehaviorSubject<ThemeModuleFunction|null>;
};

type ThemeModuleFunction = () => void;

type LoadedThemeRuntime = ThemeInjections & {
	pkg: ThemePkgDescription;
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
	{
		entryPoint
	}: ThemeInjections,
	fiberChannelFactory: IFiberChannelFactory,
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
			(window as unknown as IShellWindow<SharedLibrariesAppsMap, ThemeModuleFunction>).__ZAPP_HMR_EXPORT__[appPkg.package] = (themeFn: ThemeModuleFunction): void => {
				entryPoint.next(themeFn);
				resolve();
			}
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
): Promise<LoadedThemeRuntime|undefined> {
	const entryPoint = new BehaviorSubject<ThemeModuleFunction|null>(null);
	return loadThemeModule(
		pkg,
		{
			entryPoint
		},
		fiberChannelFactory,
	)
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
			entryPoint
		} : undefined));
}

let subscription: Subscription|undefined;

export function loadThemes(
	accounts: Array<Account>,
	fiberChannelFactory: IFiberChannelFactory,
	setThemeCache: (cache: any) => void,
): Promise<void> {
	injectSharedLibraries();
	return Promise.all<LoadedThemeRuntime|undefined>(
		map(
			orderBy(accounts[0].themes, 'priority'),
			(pkg) => loadTheme(
				pkg,
				fiberChannelFactory
			)
		)
	)
		.then((loaded) => compact<LoadedThemeRuntime>(loaded))
		.then((loaded) => orderBy<LoadedThemeRuntime>(loaded, 'pkg.priority'))
		.then((loaded) => {
			if (subscription) {
				subscription.unsubscribe();
				subscription = undefined;
			}
			if (loaded.length > 0) {
				subscription = loaded[0].entryPoint.subscribe((themeFn) => {
					if (themeFn) {
						setThemeCache(themeFn());
					}
				});
			}
			return loaded;
		})
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
		});
}

export function unloadThemes(): Promise<void> {
	if (subscription) {
		subscription.unsubscribe();
		subscription = undefined;
	}
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
