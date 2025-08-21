/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import type { Locale } from 'date-fns';
import type { TFunction } from 'i18next';

export type LocaleDescriptor = {
	name: string;
	value: string;
	// Import of the date-fns translation file
	dateFnsLocale: { key?: string; localeImportPath: () => Promise<Locale> } | undefined;
	/*
	 * Name of the tinymce translation file if different from the value field.
	 * See https://www.tiny.cloud/docs/tinymce/6/ui-localization/
	 * and https://www.tiny.cloud/get-tiny/language-packages/
	 */
	tinymceLocale?: string;
};
export const SUPPORTED_LOCALES: Record<string, LocaleDescriptor> = {
	zh_CN: {
		name: '中文 (中国)',
		value: 'zh_CN',
		dateFnsLocale: {
			key: 'zh-CN',
			localeImportPath: () =>
				/* webpackMode: "lazy", webpackChunkName: "zh-CN" */ import('date-fns/locale/zh-CN').then(
					({ zhCN }) => zhCN
				)
		},
		tinymceLocale: 'zh-Hans'
	},
	nl: {
		name: 'Nederlands',
		value: 'nl',
		dateFnsLocale: {
			localeImportPath: () =>
				/* webpackMode: "lazy", webpackChunkName: "nl" */ import('date-fns/locale/nl').then(
					({ nl }) => nl
				)
		}
	},
	en: {
		name: 'English',
		value: 'en',
		dateFnsLocale: {
			key: 'en-US',
			localeImportPath: () =>
				/* webpackMode: "lazy", webpackChunkName: "en-US" */ import('date-fns/locale/en-US').then(
					({ enUS }) => enUS
				)
		}
	},
	de: {
		name: 'Deutsch',
		value: 'de',
		dateFnsLocale: {
			localeImportPath: () =>
				/* webpackMode: "lazy", webpackChunkName: "de" */ import('date-fns/locale/de').then(
					({ de }) => de
				)
		}
	},
	hi: {
		name: 'हिंदी',
		value: 'hi',
		dateFnsLocale: {
			localeImportPath: () =>
				/* webpackMode: "lazy", webpackChunkName: "hi" */ import('date-fns/locale/hi').then(
					({ hi }) => hi
				)
		}
	},
	hu: {
		name: 'Magyar',
		value: 'hu',
		tinymceLocale: 'hu_HU',
		dateFnsLocale: {
			localeImportPath: () =>
				/* webpackMode: "lazy", webpackChunkName: "hu" */ import('date-fns/locale/hu').then(
					({ hu }) => hu
				)
		}
	},
	it: {
		name: 'italiano',
		value: 'it',
		dateFnsLocale: {
			localeImportPath: () =>
				/* webpackMode: "lazy", webpackChunkName: "it" */ import('date-fns/locale/it').then(
					({ it }) => it
				)
		}
	},
	ja: {
		name: '日本語',
		value: 'ja',
		dateFnsLocale: {
			localeImportPath: () =>
				/* webpackMode: "lazy", webpackChunkName: "ja" */ import('date-fns/locale/ja').then(
					({ ja }) => ja
				)
		}
	},

	pt: {
		name: 'português',
		value: 'pt',
		tinymceLocale: 'pt_BR',
		dateFnsLocale: {
			localeImportPath: () =>
				/* webpackMode: "lazy", webpackChunkName: "pt" */ import('date-fns/locale/pt').then(
					({ pt }) => pt
				)
		}
	},
	pl: {
		name: 'polski',
		value: 'pl',
		dateFnsLocale: {
			localeImportPath: () =>
				/* webpackMode: "lazy", webpackChunkName: "pl" */ import('date-fns/locale/pl').then(
					({ pl }) => pl
				)
		}
	},

	ro: {
		name: 'română',
		value: 'ro',
		dateFnsLocale: {
			localeImportPath: () =>
				/* webpackMode: "lazy", webpackChunkName: "ro" */ import('date-fns/locale/ro').then(
					({ ro }) => ro
				)
		}
	},
	ru: {
		name: 'русский',
		value: 'ru',
		dateFnsLocale: {
			localeImportPath: () =>
				/* webpackMode: "lazy", webpackChunkName: "ru" */ import('date-fns/locale/ru').then(
					({ ru }) => ru
				)
		}
	},
	es: {
		name: 'español',
		value: 'es',
		dateFnsLocale: {
			localeImportPath: () =>
				/* webpackMode: "lazy", webpackChunkName: "es" */ import('date-fns/locale/es').then(
					({ es }) => es
				)
		}
	},
	th: {
		name: 'ไทย',
		value: 'th',
		tinymceLocale: 'th_TH',
		dateFnsLocale: {
			localeImportPath: () =>
				/* webpackMode: "lazy", webpackChunkName: "th" */ import('date-fns/locale/th').then(
					({ th }) => th
				)
		}
	},
	tr: {
		name: 'Türkçe',
		value: 'tr',
		dateFnsLocale: {
			localeImportPath: () =>
				/* webpackMode: "lazy", webpackChunkName: "tr" */ import('date-fns/locale/tr').then(
					({ tr }) => tr
				)
		}
	},
	fr: {
		name: 'français',
		value: 'fr',
		tinymceLocale: 'fr_FR',
		dateFnsLocale: {
			localeImportPath: () =>
				/* webpackMode: "lazy", webpackChunkName: "fr" */ import('date-fns/locale/fr').then(
					({ fr }) => fr
				)
		}
	},
	vi: {
		name: 'Tiếng Việt',
		value: 'vi',
		dateFnsLocale: {
			localeImportPath: () =>
				/* webpackMode: "lazy", webpackChunkName: "vi" */ import('date-fns/locale/vi').then(
					({ vi }) => vi
				)
		}
	},
	ky: {
		name: 'Кыргызча',
		value: 'ky',
		dateFnsLocale: undefined
	},
	bs: {
		name: 'Bosanski',
		value: 'bs',
		dateFnsLocale: {
			localeImportPath: () =>
				/* webpackMode: "lazy", webpackChunkName: "bs" */ import('date-fns/locale/bs').then(
					({ bs }) => bs
				)
		}
	},
	sl: {
		name: 'Slovenščina',
		value: 'sl',
		tinymceLocale: 'sl_SI',
		dateFnsLocale: {
			localeImportPath: () =>
				/* webpackMode: "lazy", webpackChunkName: "sl" */ import('date-fns/locale/sl').then(
					({ sl }) => sl
				)
		}
	}
} as const;

export type LocaleDescriptorWithLabels = LocaleDescriptor & {
	id: string;
	label: string;
	localName: string;
};
export const localeList = (t: TFunction): Array<LocaleDescriptorWithLabels> => [
	{
		id: 'zh_CN',
		...SUPPORTED_LOCALES.zh_CN,
		localName: t('locale.chinese_china', 'Chinese (China)'),
		label: t('locale.label_chinese', {
			value: SUPPORTED_LOCALES.zh_CN.name,
			defaultValue: 'Chinese (China) - {{value}}'
		})
	},
	{
		id: 'nl',
		...SUPPORTED_LOCALES.nl,
		localName: t('locale.dutch', 'Dutch'),
		label: t('locale.label_dutch', {
			value: SUPPORTED_LOCALES.nl.name,
			defaultValue: 'Dutch - {{value}}'
		})
	},
	{
		id: 'en',
		...SUPPORTED_LOCALES.en,
		localName: t('locale.English', 'English'),
		label: t('locale.label_english', {
			value: SUPPORTED_LOCALES.en.name,
			defaultValue: 'English - {{value}}'
		})
	},
	{
		id: 'de',
		...SUPPORTED_LOCALES.de,
		localName: t('locale.german', 'German'),
		label: t('locale.label_german', {
			value: SUPPORTED_LOCALES.de.name,
			defaultValue: 'German - {{value}}'
		})
	},
	{
		id: 'hi',
		...SUPPORTED_LOCALES.hi,
		localName: t('locale.hindi', 'Hindi'),
		label: t('locale.label_hindi', {
			value: SUPPORTED_LOCALES.hi.name,
			defaultValue: 'Hindi - {{value}}'
		})
	},
	{
		id: 'hu',
		...SUPPORTED_LOCALES.hu,
		localName: t('locale.hungarian', 'Hungarian'),
		label: t('locale.label_hungarian', {
			value: SUPPORTED_LOCALES.hu.name,
			defaultValue: 'Hungarian - {{value}}'
		})
	},
	{
		id: 'it',
		...SUPPORTED_LOCALES.it,
		localName: t('locale.italian', 'Italian'),
		label: t('locale.label_italian', {
			value: SUPPORTED_LOCALES.it.name,
			defaultValue: 'Italian - {{value}}'
		})
	},
	{
		id: 'ja',
		...SUPPORTED_LOCALES.ja,
		localName: t('locale.japanese', 'Japanese'),
		label: t('locale.label_japanese', {
			value: SUPPORTED_LOCALES.ja.name,
			defaultValue: 'Japanese - {{value}}'
		})
	},

	{
		id: 'pt',
		...SUPPORTED_LOCALES.pt,
		localName: t('locale.portuguese', 'Portuguese'),
		label: t('locale.label_portuguese', {
			value: SUPPORTED_LOCALES.pt.name,
			defaultValue: 'Portuguese - {{value}}'
		})
	},
	{
		id: 'pl',
		...SUPPORTED_LOCALES.pl,
		localName: t('locale.polish', 'Polish'),
		label: t('locale.label_polish', {
			value: SUPPORTED_LOCALES.pl.name,
			defaultValue: 'Polish - {{value}}'
		})
	},

	{
		id: 'ro',
		...SUPPORTED_LOCALES.ro,
		localName: t('locale.romanian', 'Romanian'),
		label: t('locale.label_romanian', {
			value: SUPPORTED_LOCALES.ro.name,
			defaultValue: 'Romanian - {{value}}'
		})
	},
	{
		id: 'ru',
		...SUPPORTED_LOCALES.ru,
		localName: t('locale.russian', 'Russian'),
		label: t('locale.label_russian', {
			value: SUPPORTED_LOCALES.ru.name,
			defaultValue: 'Russian - {{value}}'
		})
	},

	{
		id: 'es',
		...SUPPORTED_LOCALES.es,
		localName: t('locale.spanish', 'Spanish'),
		label: t('locale.label_spanish', {
			value: SUPPORTED_LOCALES.es.name,
			defaultValue: 'Spanish - {{value}}'
		})
	},

	{
		id: 'th',
		...SUPPORTED_LOCALES.th,
		localName: t('locale.thai', 'Thai'),
		label: t('locale.label_thai', {
			value: SUPPORTED_LOCALES.th.name,
			defaultValue: 'Thai - {{value}}'
		})
	},
	{
		id: 'tr',
		...SUPPORTED_LOCALES.tr,
		localName: t('locale.turkish', 'Turkish'),
		label: t('locale.label_turkish', {
			value: SUPPORTED_LOCALES.tr.name,
			defaultValue: 'Turkish - {{value}}'
		})
	},
	{
		id: 'fr',
		...SUPPORTED_LOCALES.fr,
		localName: t('locale.french', 'French'),
		label: t('locale.label_french', {
			value: SUPPORTED_LOCALES.fr.name,
			defaultValue: 'French - {{value}}'
		})
	},
	{
		id: 'vi',
		...SUPPORTED_LOCALES.vi,
		localName: t('locale.vietnamese', 'Vietnamese'),
		label: t('locale.label_vietnamese', {
			value: SUPPORTED_LOCALES.vi.name,
			defaultValue: 'Vietnamese - {{value}}'
		})
	},
	{
		id: 'ky',
		...SUPPORTED_LOCALES.ky,
		localName: t('locale.kyrgyz', 'Kyrgyz'),
		label: t('locale.label_kyrgyz', {
			value: SUPPORTED_LOCALES.ky.name,
			defaultValue: 'Kyrgyz - {{value}}'
		})
	},
	{
		id: 'bs',
		...SUPPORTED_LOCALES.bs,
		localName: t('locale.bosnian', 'Bosnian'),
		label: t('locale.label_bosnian', {
			value: SUPPORTED_LOCALES.bs.name,
			defaultValue: 'Bosnian - {{value}}'
		})
	},
	{
		id: 'sl',
		...SUPPORTED_LOCALES.sl,
		localName: t('locale.slovenian', 'Slovenian'),
		label: t('locale.label_slovenian', {
			value: SUPPORTED_LOCALES.sl.name,
			defaultValue: 'Slovenian - {{value}}'
		})
	}
];
