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

import i18next from 'i18next';

function createMockedI18n(): any {
	const newI18n = i18next.createInstance();
	newI18n
		.init({
			fallbackLng: 'en',
			debug: false,

			ns: ['translations'],
			defaultNS: 'translations',

			resources: {
				en: {},
			},

			interpolation: {
				escapeValue: false, // not needed for react as it escapes by default
			}
		});
	return newI18n;
}

const i18nFactory = jest.fn().mockImplementation(() => ({
	getShellI18n: jest.fn().mockImplementation(createMockedI18n),
	getAppI18n: jest.fn().mockImplementation(createMockedI18n)
}));

export default i18nFactory;
