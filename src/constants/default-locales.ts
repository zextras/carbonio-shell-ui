/*
 * SPDX-FileCopyrightText: 2025 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

type LocaleValue = {
	value: string;
	name: string;
	tinymceLocale: string | undefined;
	labelKey: string;
	labelDefaultValue: string;
};

export const DEFAULT_LOCALES: Record<string, LocaleValue> = {
	zh_CN: {
		name: '中文 (中国)',
		value: 'zh_CN',
		tinymceLocale: 'zh-Hans',
		labelKey: 'locale.label_chinese',
		labelDefaultValue: 'Chinese (China) - {{value}}'
	},
	nl: {
		name: 'Nederlands',
		value: 'nl',
		tinymceLocale: 'nl',
		labelKey: 'locale.label_dutch',
		labelDefaultValue: 'Dutch - {{value}}'
	},
	en: {
		name: 'English',
		value: 'en',
		tinymceLocale: 'en',
		labelKey: 'locale.label_english',
		labelDefaultValue: 'English - {{value}}'
	},
	de: {
		name: 'Deutsch',
		value: 'de',
		tinymceLocale: 'de',
		labelKey: 'locale.label_german',
		labelDefaultValue: 'German - {{value}}'
	},
	hi: {
		name: 'हिंदी',
		value: 'hi',
		tinymceLocale: 'hi',
		labelKey: 'locale.label_hindi',
		labelDefaultValue: 'Hindi - {{value}}'
	},
	hu: {
		name: 'Magyar',
		value: 'hu',
		tinymceLocale: 'hu_HU',
		labelKey: 'locale.label_hungarian',
		labelDefaultValue: 'Hungarian - {{value}}'
	},
	it: {
		name: 'italiano',
		value: 'it',
		tinymceLocale: 'it',
		labelKey: 'locale.label_italian',
		labelDefaultValue: 'Italian - {{value}}'
	},
	ja: {
		name: '日本語',
		value: 'ja',
		tinymceLocale: 'ja',
		labelKey: 'locale.label_japanese',
		labelDefaultValue: 'Japanese - {{value}}'
	},
	pt: {
		name: 'português',
		value: 'pt',
		tinymceLocale: 'pt_BR',
		labelKey: 'locale.label_portuguese',
		labelDefaultValue: 'Portuguese - {{value}}'
	},
	pl: {
		name: 'polski',
		value: 'pl',
		tinymceLocale: 'pl',
		labelKey: 'locale.label_polish',
		labelDefaultValue: 'Polish - {{value}}'
	},
	ro: {
		name: 'română',
		value: 'ro',
		tinymceLocale: 'ro',
		labelKey: 'locale.label_romanian',
		labelDefaultValue: 'Romanian - {{value}}'
	},
	ru: {
		name: 'русский',
		value: 'ru',
		tinymceLocale: 'ru',
		labelKey: 'locale.label_russian',
		labelDefaultValue: 'Russian - {{value}}'
	},
	es: {
		name: 'español',
		value: 'es',
		tinymceLocale: 'es',
		labelKey: 'locale.label_spanish',
		labelDefaultValue: 'Spanish - {{value}}'
	},
	th: {
		name: 'ไทย',
		value: 'th',
		tinymceLocale: 'th_TH',
		labelKey: 'locale.label_thai',
		labelDefaultValue: 'Thai - {{value}}'
	},
	tr: {
		name: 'Türkçe',
		value: 'tr',
		tinymceLocale: 'tr',
		labelKey: 'locale.label_turkish',
		labelDefaultValue: 'Turkish - {{value}}'
	},
	fr: {
		name: 'français',
		value: 'fr',
		tinymceLocale: 'fr_FR',
		labelKey: 'locale.label_french',
		labelDefaultValue: 'French - {{value}}'
	},
	vi: {
		name: 'Tiếng Việt',
		value: 'vi',
		tinymceLocale: 'vi',
		labelKey: 'locale.label_vietnamese',
		labelDefaultValue: 'Vietnamese - {{value}}'
	},
	ky: {
		name: 'Кыргызча',
		value: 'ky',
		tinymceLocale: 'ky',
		labelKey: 'locale.label_kyrgyz',
		labelDefaultValue: 'Kyrgyz - {{value}}'
	},
	bs: {
		name: 'Bosanski',
		value: 'bs',
		tinymceLocale: 'bs',
		labelKey: 'locale.label_bosnian',
		labelDefaultValue: 'Bosnian - {{value}}'
	},
	sl: {
		name: 'Slovenščina',
		value: 'sl',
		tinymceLocale: 'sl_SI',
		labelKey: 'locale.label_slovenian',
		labelDefaultValue: 'Slovenian - {{value}}'
	}
};
