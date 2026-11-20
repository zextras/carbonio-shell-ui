/*
 * SPDX-FileCopyrightText: 2026 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { getAccountLocale } from './store';
import type { AccountSettings } from '../../types/account';

const settingsWith = (prefLocale?: string, locale?: string): AccountSettings => ({
	attrs: locale === undefined ? {} : { zimbraLocale: locale },
	prefs: prefLocale === undefined ? {} : { zimbraPrefLocale: prefLocale },
	props: []
});

describe('getAccountLocale', () => {
	it('reduces the server default Java locale to a supported language', () => {
		expect(getAccountLocale(settingsWith(undefined, 'en_US'))).toBe('en');
		expect(getAccountLocale(settingsWith(undefined, 'it_IT'))).toBe('it');
	});

	it('reduces a BCP 47 regional tag to a supported language', () => {
		expect(getAccountLocale(settingsWith('pt-BR'))).toBe('pt');
	});

	it('gives precedence to the user preference over the server locale', () => {
		expect(getAccountLocale(settingsWith('de', 'en_US'))).toBe('de');
	});

	it('keeps locales that are not supported, letting i18next fall back', () => {
		expect(getAccountLocale(settingsWith('xx_YY'))).toBe('xx_YY');
	});

	it('defaults to english without settings', () => {
		expect(getAccountLocale(undefined)).toBe('en');
	});
});
