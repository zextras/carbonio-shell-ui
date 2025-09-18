/*
 * SPDX-FileCopyrightText: 2025 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import {
	DEFAULT_LOCALES as FIRST_IMPORTED_DEFAULT_LOCALES,
	STATIC_LOCALES
} from './default-locales';

it('DEFAULT_LOCALES should be equal to STATIC_LOCALES if env LOCALES is not defined', () => {
	expect(process.env.LOCALES).toBeUndefined();
	expect(FIRST_IMPORTED_DEFAULT_LOCALES).toEqual(STATIC_LOCALES);
});

it('DEFAULT_LOCALES should be equal to STATIC_LOCALES merger with LOCALES env if available', () => {
	process.env.LOCALES =
		'{"test":{"name":"test","value":"test","tinymceLocale":"test","labelKey":"locale.label_test","labelDefaultValue":"test (test) - {{value}}"}}';

	jest.resetModules();

	import('./default-locales').then(({ DEFAULT_LOCALES: RELOADED_DEFAULT_LOCALES }) => {
		expect(RELOADED_DEFAULT_LOCALES).toEqual({
			...STATIC_LOCALES,
			test: {
				name: 'test',
				value: 'test',
				tinymceLocale: 'test',
				labelKey: 'locale.label_test',
				labelDefaultValue: 'test (test) - {{value}}'
			}
		});
		delete process.env.LOCALES;
	});
});
