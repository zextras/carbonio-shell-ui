/*
 * *** BEGIN LICENSE BLOCK *****
 * Copyright (C) 2011-2021 Zextras
 *
 *  The contents of this file are subject to the Zextras EULA;
 * you may not use this file except in compliance with the EULA.
 * You may obtain a copy of the EULA at
 * http://www.zextras.com/zextras-eula.html
 * *** END LICENSE BLOCK *****
 */

import i18next, { i18n } from 'i18next';
import { ZextrasModule } from '../store/account/types';
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
