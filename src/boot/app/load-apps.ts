/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { filter, map } from 'lodash';

import { registerLocale, setDefaultLocale } from '@zextras/carbonio-design-system';
import type { Locale as DateFnsLocale } from 'date-fns';
import { CarbonioModule } from '../../../types';
import { SHELL_APP_ID } from '../../constants';
import { useReporter } from '../../reporting';
import { getUserSetting, useAccountStore } from '../../store/account';
import { getT, useI18nStore } from '../../store/i18n';
import { loadApp, unloadApps } from './load-app';
import { injectSharedLibraries } from './shared-libraries';
import { localeList } from '../../settings/components/utils';

const getDateFnsLocale = (locale: string): Promise<DateFnsLocale> =>
	import(`date-fns/locale/${locale}/index.js`);

export function loadApps(
	apps: Array<CarbonioModule>
): Promise<PromiseSettledResult<CarbonioModule>[]> {
	injectSharedLibraries();
	const appsToLoad = filter(apps, (app) => {
		if (app.name === SHELL_APP_ID) return false;
		return !(app.attrKey && getUserSetting('attrs', app.attrKey) === 'FALSE');
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
	const localeObj = localeList(getT()).find((item) => item.id === locale);
	if (localeObj) {
		const localeDateFnsKey = localeObj.dateFnsLocale || localeObj.value;
		getDateFnsLocale(localeDateFnsKey).then((localeDateFns) => {
			registerLocale(localeDateFnsKey, localeDateFns);
			setDefaultLocale(localeDateFnsKey);
		});
	}
	useReporter.getState().setClients(appsToLoad);
	return Promise.allSettled(map(appsToLoad, (app) => loadApp(app)));
}

export function unloadAllApps(): Promise<void> {
	return unloadApps();
}
