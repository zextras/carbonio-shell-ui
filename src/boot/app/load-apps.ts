/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { filter, map } from 'lodash';

import { CarbonioModule } from '../../../types';
import { SHELL_APP_ID } from '../../constants';
import { useReporter } from '../../reporting';
import { useAccountStore } from '../../store/account';
import { getUserSetting } from '../../store/account/hooks';
import { useI18nStore } from '../../store/i18n';
import { loadApp, unloadApps } from './load-app';
import { injectSharedLibraries } from './shared-libraries';

export function loadApps(apps: Array<CarbonioModule>): void {
	injectSharedLibraries();
	const appsToLoad = filter(apps, (app) => {
		if (app.name === SHELL_APP_ID) return false;
		if (app.attrKey && getUserSetting('attrs', app.attrKey) === 'FALSE') return false;
		return true;
	});
	console.log(
		'%cLOADING APPS',
		'color: white; background: #2b73d2;padding: 4px 8px 2px 4px; font-family: sans-serif; border-radius: 12px; width: 100%'
	);
	const { settings } = useAccountStore.getState();
	const locale =
		(settings?.prefs?.zimbraPrefLocale as string) ??
		(settings?.attrs?.zimbraLocale as string) ??
		'en';
	useI18nStore.getState().actions.addI18n(appsToLoad, locale);
	useReporter.getState().setClients(appsToLoad);
	Promise.allSettled(map(appsToLoad, (app) => loadApp(app)));
}

export function unloadAllApps(): Promise<void> {
	return unloadApps();
}
