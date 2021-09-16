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
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { dropRight } from 'lodash';
import { II18nFactory, ZextrasModule } from '../../types';
import { getShell } from '../store/app/hooks';
import { SHELL_APP_ID } from '../constants';

export default class I18nFactory implements II18nFactory {
	_cache: { [pkg: string]: i18n } = {};

	public getShellI18n(): i18n {
		return this.getAppI18n(getShell() ?? { name: SHELL_APP_ID });
	}

	// eslint-disable-next-line class-methods-use-this
	public getAppI18n(appPkgDescription: ZextrasModule | { name: string }): i18n {
		if (this._cache[appPkgDescription.name]) {
			return this._cache[appPkgDescription.name];
		}
		const newI18n = i18next.createInstance();
		const baseI18nPath =
			appPkgDescription.name === SHELL_APP_ID
				? BASE_PATH
				: dropRight((appPkgDescription as ZextrasModule).js_entrypoint.split('/')).join('/');
		newI18n
			// load translation using http -> see /public/locales (i.e. https://github.com/i18next/react-i18next/tree/master/example/react/public/locales)
			// learn more: https://github.com/i18next/i18next-http-backend
			.use(Backend)
			// detect user language
			// learn more: https://github.com/i18next/i18next-browser-languageDetector
			.use(LanguageDetector)
			// init i18next
			// for all options read: https://www.i18next.com/overview/configuration-options
			.init({
				fallbackLng: 'en',
				debug: false,

				interpolation: {
					escapeValue: false // not needed for react as it escapes by default
				},

				missingKeyHandler: (lng, ns, key, fallbackValue) => {
					console.warn(`Missing translation with key '${key}'`);
				},

				backend: {
					loadPath: `${baseI18nPath}/i18n/{{lng}}.json`
				}
			});
		this._cache[appPkgDescription.name] = newI18n;
		return newI18n;
	}
}
