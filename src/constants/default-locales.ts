/*
 * SPDX-FileCopyrightText: 2025 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import dynamicLocales from './dynamic-locales.json';

type LocaleValue = {
	value: string;
	name: string;
	labelKey: string;
	labelDefaultValue: string;
};

export const STATIC_LOCALES: Record<string, LocaleValue> = {
	nl: {
		name: 'Nederlands',
		value: 'nl',
		labelKey: 'locale.label_dutch',
		labelDefaultValue: 'Dutch - {{value}}'
	},
	en: {
		name: 'English',
		value: 'en',
		labelKey: 'locale.label_english',
		labelDefaultValue: 'English - {{value}}'
	},
	de: {
		name: 'Deutsch',
		value: 'de',
		labelKey: 'locale.label_german',
		labelDefaultValue: 'German - {{value}}'
	},
	hi: {
		name: 'हिंदी',
		value: 'hi',
		labelKey: 'locale.label_hindi',
		labelDefaultValue: 'Hindi - {{value}}'
	},
	hu: {
		name: 'Magyar',
		value: 'hu',
		labelKey: 'locale.label_hungarian',
		labelDefaultValue: 'Hungarian - {{value}}'
	},
	it: {
		name: 'italiano',
		value: 'it',
		labelKey: 'locale.label_italian',
		labelDefaultValue: 'Italian - {{value}}'
	},
	ja: {
		name: '日本語',
		value: 'ja',
		labelKey: 'locale.label_japanese',
		labelDefaultValue: 'Japanese - {{value}}'
	},
	pt: {
		name: 'português',
		value: 'pt',
		labelKey: 'locale.label_portuguese',
		labelDefaultValue: 'Portuguese - {{value}}'
	},
	pl: {
		name: 'polski',
		value: 'pl',
		labelKey: 'locale.label_polish',
		labelDefaultValue: 'Polish - {{value}}'
	},
	ro: {
		name: 'română',
		value: 'ro',
		labelKey: 'locale.label_romanian',
		labelDefaultValue: 'Romanian - {{value}}'
	},
	ru: {
		name: 'русский',
		value: 'ru',
		labelKey: 'locale.label_russian',
		labelDefaultValue: 'Russian - {{value}}'
	},
	es: {
		name: 'español',
		value: 'es',
		labelKey: 'locale.label_spanish',
		labelDefaultValue: 'Spanish - {{value}}'
	},
	th: {
		name: 'ไทย',
		value: 'th',
		labelKey: 'locale.label_thai',
		labelDefaultValue: 'Thai - {{value}}'
	},
	tr: {
		name: 'Türkçe',
		value: 'tr',
		labelKey: 'locale.label_turkish',
		labelDefaultValue: 'Turkish - {{value}}'
	},
	fr: {
		name: 'français',
		value: 'fr',
		labelKey: 'locale.label_french',
		labelDefaultValue: 'French - {{value}}'
	},
	vi: {
		name: 'Tiếng Việt',
		value: 'vi',
		labelKey: 'locale.label_vietnamese',
		labelDefaultValue: 'Vietnamese - {{value}}'
	},
	ky: {
		name: 'Кыргызча',
		value: 'ky',
		labelKey: 'locale.label_kyrgyz',
		labelDefaultValue: 'Kyrgyz - {{value}}'
	},
	id: {
		name: 'Bahasa Indonesia',
		value: 'id',
		labelKey: 'locale.label_indonesian',
		labelDefaultValue: 'Indonesian - {{value}}'
	},
	bs: {
		name: 'Bosanski',
		value: 'bs',
		labelKey: 'locale.label_bosnian',
		labelDefaultValue: 'Bosnian - {{value}}'
	},
	sl: {
		name: 'Slovenščina',
		value: 'sl',
		labelKey: 'locale.label_slovenian',
		labelDefaultValue: 'Slovenian - {{value}}'
	}
};

export const DEFAULT_LOCALES: Record<string, LocaleValue> = {
	...STATIC_LOCALES,
	...dynamicLocales
};
