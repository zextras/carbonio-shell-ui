import { map, orderBy, compact, keyBy } from 'lodash';
import { RequestHandlersList } from 'msw/lib/types/setupWorker/glossary';
import { BehaviorSubject } from 'rxjs';
import { ComponentClass } from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { IFiberChannelFactory } from '../fiberchannel/fiber-channel-types';
import { Account, AppPkgDescription, ThemePkgDescription } from '../../types';
import { IShellWindow, updateAppHandlers, _scripts } from './app-loader';

let _scriptId = -1;

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
			_scripts[`${themePkg.package}-loader-${(_scriptId -= 1)}`] = script;
		} catch (err) {
			reject(err);
		}
	});
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

export function loadThemes(
	accounts: Array<Account>,
	fiberChannelFactory: IFiberChannelFactory
): Promise<LoadedThemesCache> {
	// injectSharedLibraries();
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

type LoadedThemeRuntime = ThemeInjections & {
	pkg: ThemePkgDescription;
};

export type LoadedThemesCache = {
	[pkgName: string]: LoadedThemeRuntime;
};

type ThemeInjections = {
	entryPoint: BehaviorSubject<ComponentClass | null>;
};
