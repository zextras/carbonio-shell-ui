/* eslint-disable @typescript-eslint/camelcase */
/*
 * *** BEGIN LICENSE BLOCK *****
 * Copyright (C) 2011-2019 ZeXtras
 *
 * The contents of this file are subject to the ZeXtras EULA;
 * you may not use this file except in compliance with the EULA.
 * You may obtain a copy of the EULA at
 * http://www.zextras.com/zextras-eula.html
 * *** END LICENSE BLOCK *****
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import LanguageDetector from 'i18next-browser-languagedetector';

import translations_en from './com_zextras_zapp_shell_en.properties';
import translations_it from './com_zextras_zapp_shell_it.properties';

i18n
// detect user language
// learn more: https://github.com/i18next/i18next-browser-languageDetector
	.use(LanguageDetector)
	// pass the i18n instance to react-i18next.
	.use(initReactI18next)
	// init i18next
	// for all options read: https://www.i18next.com/overview/configuration-options
	.init({
		resources: {
			en: {
				[`${PACKAGE_NAME}`]: translations_en
			},
			it: {
				[`${PACKAGE_NAME}`]: translations_it
			}
		},
		ns: [ PACKAGE_NAME ],
		defaultNS: PACKAGE_NAME,
		fallbackLng: 'en',
		debug: true,
		interpolation: {
			escapeValue: false
		}
	});

export default i18n;