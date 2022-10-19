/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import i18next, { i18n } from 'i18next';
import { dropRight, forEach, map, reduce } from 'lodash';
import create from 'zustand';
import Backend from 'i18next-http-backend';
import { CarbonioModule, I18nState } from '../../../types';

const defaultI18n = i18next.createInstance();

export const useI18nStore = create<I18nState>(() => ({
	instances: {},
	defaultI18n,
	locale: 'en'
}));

export const setLocale = (locale: string): void => {
	const { instances } = useI18nStore.getState();
	forEach(instances, (i18nInst) => i18nInst.changeLanguage(locale));
	useI18nStore.setState(() => ({
		locale
	}));
};

defaultI18n
	.use(Backend)
	// init i18next
	// for all options read: https://www.i18next.com/overview/configuration-options
	.init({
		returnEmptyString: true,
		compatibilityJSON: 'v3',
		lng: useI18nStore.getState().locale,
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
	});

export const addI18n = (apps: CarbonioModule[]): void => {
	useI18nStore.setState({
		instances: reduce(
			apps,
			(acc, app) => {
				const newI18n = i18next.createInstance();
				newI18n
					// load translation using http -> see /public/locales (i.e. https://github.com/i18next/react-i18next/tree/master/example/react/public/locales)
					// learn more: https://github.com/i18next/i18next-http-backend
					.use(Backend)
					// init i18next
					// for all options read: https://www.i18next.com/overview/configuration-options
					.init({
						returnEmptyString: true,
						compatibilityJSON: 'v3',
						lng: useI18nStore.getState().locale,
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
							loadPath: `${dropRight(app.js_entrypoint.split('/')).join('/')}/i18n/{{lng}}.json`
						}
					});
				// eslint-disable-next-line no-param-reassign
				acc[app.name] = newI18n;
				return acc;
			},
			{} as Record<string, i18n>
		)
	});
};
