/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { registerLocale, setDefaultLocale } from '@zextras/carbonio-design-system';
import type { Locale as DateFnsLocale } from 'date-fns';
import { filter, map } from 'lodash';

import { loadApp, unloadApps } from './load-app';
import { injectSharedLibraries } from './shared-libraries';
import { SHELL_APP_ID } from '../../constants';
import { SUPPORTED_LOCALES } from '../../constants/locales';
import { useReporter } from '../../reporting/store';
import { getUserSetting, useAccountStore } from '../../store/account';
import { useI18nStore } from '../../store/i18n/store';
import type { CarbonioModule } from '../../types/apps';

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
	// eslint-disable-next-line no-console
	console.log(
		'%cLOADING APPS',
		'color: white; background: #2b73d2;padding: 4px 8px 2px 4px; font-family: sans-serif; border-radius: 12px; width: 100%'
	);
	const { settings } = useAccountStore.getState();
	const locale =
		(settings?.prefs?.zimbraPrefLocale as string) ??
		(settings?.attrs?.zimbraLocale as string) ??
		'en';
	useI18nStore.getState().addI18n(appsToLoad, locale);
	const localeObj =
		locale in SUPPORTED_LOCALES && SUPPORTED_LOCALES[locale as keyof typeof SUPPORTED_LOCALES];
	if (localeObj) {
		const localeDateFnsKey =
			('dateFnsLocale' in localeObj && localeObj.dateFnsLocale) || localeObj.value;
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
