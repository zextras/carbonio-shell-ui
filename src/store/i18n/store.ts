/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import type { i18n, InitOptions } from 'i18next';
import i18next from 'i18next';
import Backend from 'i18next-http-backend';
import { produce } from 'immer';
import { dropRight, forEach, reduce } from 'lodash';
import { initReactI18next } from 'react-i18next';
import { create } from 'zustand';

import type { CarbonioModule, I18nState } from '../../../types';
import { SHELL_APP_ID } from '../../constants';
import { useAccountStore } from '../account';

const addShell = (apps: Array<CarbonioModule>): Array<CarbonioModule> => [
	...apps,
	{
		commit: '',
		description: '',
		js_entrypoint: '',
		name: SHELL_APP_ID,
		priority: -1,
		version: '',
		type: 'shell',
		attrKey: '',
		icon: '',
		display: 'Shell'
	}
];

const { settings } = useAccountStore.getState();

const defaultLng =
	(settings?.prefs?.zimbraPrefLocale as string) ??
	(settings?.attrs?.zimbraLocale as string) ??
	'en';

const defaultI18n = i18next.createInstance({ lng: defaultLng });

const defaultI18nInitOptions: InitOptions = {
	returnEmptyString: true,
	returnNull: false,
	compatibilityJSON: 'v3',
	lng: defaultLng,
	fallbackLng: 'en',
	debug: false,
	interpolation: {
		escapeValue: false // not needed for react as it escapes by default
	},
	missingKeyHandler: (_, __, key) => {
		// eslint-disable-next-line no-console
		console.warn(`Missing translation with key '${key}'`);
	},
	backend: {
		loadPath: `${BASE_PATH}/i18n/{{lng}}.json`
	}
};

export const useI18nStore = create<I18nState>()((set) => ({
	instances: {},
	defaultI18n,
	locale: 'en',
	setters: {
		setLocale: (locale: string): void => {
			set(
				produce((state: I18nState) => {
					state.locale = locale;
					forEach(state.instances, (i18nInst) => i18nInst.changeLanguage(locale));
				})
			);
		}
	},
	getters: {
		getLocale: (state: I18nState): string => state.locale
	},
	actions: {
		addI18n: (apps: Array<CarbonioModule>, locale: string): void => {
			const appsWithShell = addShell(apps);
			set(
				produce((state: I18nState) => {
					state.instances = reduce<CarbonioModule, Record<string, i18n>>(
						appsWithShell,
						(acc, app): Record<string, i18n> => {
							const newI18n = i18next.createInstance();
							newI18n
								// load translation using http -> see /public/locales (i.e. https://github.com/i18next/react-i18next/tree/master/example/react/public/locales)
								// learn more: https://github.com/i18next/i18next-http-backend
								.use(Backend)
								// init i18next
								// for all options read: https://www.i18next.com/overview/configuration-options
								.init({
									...defaultI18nInitOptions,
									lng: locale,
									backend: {
										loadPath:
											app.name === SHELL_APP_ID
												? `${BASE_PATH}/i18n/{{lng}}.json`
												: `${dropRight(app.js_entrypoint.split('/')).join('/')}/i18n/{{lng}}.json`
									}
								});
							// eslint-disable-next-line no-param-reassign
							acc[app.name] = newI18n;
							return acc;
						},
						{}
					);
					state.defaultI18n.t = state.instances[SHELL_APP_ID].t;
					state.locale = locale;
				})
			);
		}
	}
}));

defaultI18n
	.use(Backend)
	// pass the i18n instance to react-i18next.
	.use(initReactI18next)
	// init i18next
	// for all options read: https://www.i18next.com/overview/configuration-options
	.init(defaultI18nInitOptions);
