/*
 * *** BEGIN LICENSE BLOCK *****
 * Copyright (C) 2011-2020 Zextras
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
import { AppPkgDescription } from '../../types';

export default class I18nFactory {
	private _cache: { [pkg: string]: i18n } = {};

	public getShellI18n(): i18n {
		return this.getAppI18n({
			priority: 0,
			package: PACKAGE_NAME,
			name: PACKAGE_NAME,
			description: '',
			version: PACKAGE_VERSION,
			resourceUrl: '',
			entryPoint: ''
		});
	}

	// eslint-disable-next-line class-methods-use-this
	public getAppI18n(appPkgDescription: AppPkgDescription): i18n {
		// const sink = this._fcFactory.getAppFiberChannelSink(appPkgDescription);
		if (this._cache[appPkgDescription.package]) {
			return this._cache[appPkgDescription.package];
		}
		const newI18n = i18next.createInstance();
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
					loadPath: `/zx/zimlet/${appPkgDescription.package}/i18n/{{lng}}.json`
				}
			});
		this._cache[appPkgDescription.package] = newI18n;
		return newI18n;
	}
}
