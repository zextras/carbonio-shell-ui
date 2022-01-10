/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import i18next, { i18n } from 'i18next';
import { ZextrasModule } from '../../types';
import I18nFactory from './i18n-factory';

export default class I18nTestFactory extends I18nFactory {
	// eslint-disable-next-line class-methods-use-this
	public getAppI18n(appPkgDescription: ZextrasModule): i18n {
		const newI18n = i18next.createInstance();
		newI18n
			// init i18next
			// for all options read: https://www.i18next.com/overview/configuration-options
			.init({
				lng: 'en',
				fallbackLng: 'en',
				debug: false,

				interpolation: {
					escapeValue: false // not needed for react as it escapes by default
				},
				resources: { en: { translation: {} } }
			});
		return newI18n;
	}
}
