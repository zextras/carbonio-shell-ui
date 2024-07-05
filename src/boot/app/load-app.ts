/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import type { ComponentType } from 'react';
import { memo } from 'react';

import { forOwn } from 'lodash';

import { getAppDependantExports } from './app-dependant-exports';
import * as appExports from './app-direct-exports';
import * as CONSTANTS from '../../constants';
import type * as ExportsForApp from '../../lib';
import { report } from '../../reporting/functions';
import { SettingsHeader } from '../../settings/components/settings-header';
import { useAppStore } from '../../store/app';
import type { CarbonioModule } from '../../types/apps';
import { AppLink } from '../../ui-extras/app-link';
import { Spinner } from '../../ui-extras/spinner';

export const _scripts: { [pkgName: string]: HTMLScriptElement } = {};
let _scriptId = 0;

export function loadApp(appPkg: CarbonioModule): Promise<CarbonioModule> {
	return new Promise((resolve, reject) => {
		try {
			if (window.__ZAPP_SHARED_LIBRARIES__?.['@zextras/carbonio-shell-ui']) {
				window.__ZAPP_SHARED_LIBRARIES__['@zextras/carbonio-shell-ui'][appPkg.name] = {
					report: report(appPkg.name),
					AppLink,
					Spinner,
					SettingsHeader,
					...getAppDependantExports(appPkg),
					...appExports,
					...CONSTANTS
				} satisfies typeof ExportsForApp;
			}

			window.__ZAPP_HMR_EXPORT__[appPkg.name] = (appComponent: ComponentType): void => {
				useAppStore.setState((state) => ({
					entryPoints: {
						...state.entryPoints,
						[appPkg.name]: memo(appComponent)
					}
				}));
				// eslint-disable-next-line no-console
				console.info(
					`%c loaded ${appPkg.name}`,
					'color: white; background: #539507;padding: 4px 8px 2px 4px; font-family: sans-serif; border-radius: 12px; width: 100%'
				);
				resolve(appPkg);
			};

			const script = document.createElement('script');
			script.setAttribute('type', 'text/javascript');
			script.setAttribute('data-pkg_name', appPkg.name);
			script.setAttribute('data-pkg_version', appPkg.version);
			script.setAttribute('data-is_app', 'true');
			script.setAttribute('src', `${appPkg.js_entrypoint}`);
			document.body.appendChild(script);
			_scriptId += 1;
			_scripts[`${appPkg.name}-loader-${_scriptId}`] = script;
		} catch (err: unknown) {
			console.error(err);
			reject(err);
		}
	});
}

export function unloadApps(): Promise<void> {
	return new Promise((resolve) => {
		forOwn(_scripts, (script) => {
			if (script.parentNode) {
				script.parentNode.removeChild(script);
			}
		});
		resolve();
	});
}
