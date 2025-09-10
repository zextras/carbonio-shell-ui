/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import type { Locale } from 'date-fns';
import type { TFunction } from 'i18next';

export type LocaleValue = {
	value: string;
	name: string;
	tinymceLocale: string;
	dateFnsLocale: string | undefined;
};

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

const mapCacheToSupportedLocales = (
	cache: Record<string, LocaleValue>
): Record<string, LocaleDescriptor> =>
	Object.values(cache).reduce(
		(previousValue, currentValue) => {
			// eslint-disable-next-line no-param-reassign
			previousValue[currentValue.value] = {
				value: currentValue.value,
				name: currentValue.name,
				tinymceLocale: currentValue.tinymceLocale,
				dateFnsLocale:
					typeof currentValue.dateFnsLocale === 'string'
						? {
								localeImportPath: () =>
									/* webpackMode: "lazy" */ import(
										`date-fns/locale/${currentValue.dateFnsLocale}`
									).then(
										(m) =>
											m[
												(currentValue.dateFnsLocale as string).replace('-', '')
											] as unknown as Locale
									)
							}
						: undefined
			};
			return previousValue;
		},
		{} as Record<string, LocaleDescriptor>
	);

export const SUPPORTED_LOCALES: Record<string, LocaleDescriptor> = {
	zh_CN: {
		name: '中文 (中国)',
		value: 'zh_CN',
		dateFnsLocale: {
			key: 'zh-CN',
			localeImportPath: () =>
				/* webpackMode: "lazy" */ import('date-fns/locale/zh-CN').then(({ zhCN }) => zhCN)
		},
		tinymceLocale: 'zh-Hans'
	},
	nl: {
		name: 'Nederlands',
		value: 'nl',
		dateFnsLocale: {
			localeImportPath: () =>
				/* webpackMode: "lazy" */ import('date-fns/locale/nl').then((value) => value.nl)
		}
	},
	en: {
		name: 'English',
		value: 'en',
		dateFnsLocale: {
			key: 'en-US',
			localeImportPath: () =>
				/* webpackMode: "lazy" */ import('date-fns/locale/en-US').then(({ enUS }) => enUS)
		}
	},
	de: {
		name: 'Deutsch',
		value: 'de',
		dateFnsLocale: {
			localeImportPath: () =>
				/* webpackMode: "lazy" */ import('date-fns/locale/de').then(({ de }) => de)
		}
	},
	hi: {
		name: 'हिंदी',
		value: 'hi',
		dateFnsLocale: {
			localeImportPath: () =>
				/* webpackMode: "lazy" */ import('date-fns/locale/hi').then(({ hi }) => hi)
		}
	},
	hu: {
		name: 'Magyar',
		value: 'hu',
		tinymceLocale: 'hu_HU',
		dateFnsLocale: {
			localeImportPath: () =>
				/* webpackMode: "lazy" */ import('date-fns/locale/hu').then(({ hu }) => hu)
		}
	},
	it: {
		name: 'italiano',
		value: 'it',
		dateFnsLocale: {
			localeImportPath: () =>
				/* webpackMode: "lazy" */ import('date-fns/locale/it').then(({ it }) => it)
		}
	},
	ja: {
		name: '日本語',
		value: 'ja',
		dateFnsLocale: {
			localeImportPath: () =>
				/* webpackMode: "lazy" */ import('date-fns/locale/ja').then(({ ja }) => ja)
		}
	},

	pt: {
		name: 'português',
		value: 'pt',
		tinymceLocale: 'pt_BR',
		dateFnsLocale: {
			localeImportPath: () =>
				/* webpackMode: "lazy" */ import('date-fns/locale/pt').then(({ pt }) => pt)
		}
	},
	pl: {
		name: 'polski',
		value: 'pl',
		dateFnsLocale: {
			localeImportPath: () =>
				/* webpackMode: "lazy" */ import('date-fns/locale/pl').then(({ pl }) => pl)
		}
	},

	ro: {
		name: 'română',
		value: 'ro',
		dateFnsLocale: {
			localeImportPath: () =>
				/* webpackMode: "lazy" */ import('date-fns/locale/ro').then(({ ro }) => ro)
		}
	},
	ru: {
		name: 'русский',
		value: 'ru',
		dateFnsLocale: {
			localeImportPath: () =>
				/* webpackMode: "lazy" */ import('date-fns/locale/ru').then(({ ru }) => ru)
		}
	},
	es: {
		name: 'español',
		value: 'es',
		dateFnsLocale: {
			localeImportPath: () =>
				/* webpackMode: "lazy" */ import('date-fns/locale/es').then(({ es }) => es)
		}
	},
	th: {
		name: 'ไทย',
		value: 'th',
		tinymceLocale: 'th_TH',
		dateFnsLocale: {
			localeImportPath: () =>
				/* webpackMode: "lazy" */ import('date-fns/locale/th').then(({ th }) => th)
		}
	},
	tr: {
		name: 'Türkçe',
		value: 'tr',
		dateFnsLocale: {
			localeImportPath: () =>
				/* webpackMode: "lazy" */ import('date-fns/locale/tr').then(({ tr }) => tr)
		}
	},
	fr: {
		name: 'français',
		value: 'fr',
		tinymceLocale: 'fr_FR',
		dateFnsLocale: {
			localeImportPath: () =>
				/* webpackMode: "lazy" */ import('date-fns/locale/fr').then(({ fr }) => fr)
		}
	},
	vi: {
		name: 'Tiếng Việt',
		value: 'vi',
		dateFnsLocale: {
			localeImportPath: () =>
				/* webpackMode: "lazy" */ import('date-fns/locale/vi').then(({ vi }) => vi)
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
				/* webpackMode: "lazy" */ import('date-fns/locale/bs').then(({ bs }) => bs)
		}
	},
	sl: {
		name: 'Slovenščina',
		value: 'sl',
		tinymceLocale: 'sl_SI',
		dateFnsLocale: {
			localeImportPath: () =>
				/* webpackMode: "lazy" */ import('date-fns/locale/sl').then(({ sl }) => sl)
		}
	}
} as const;

export type LocaleDescriptorWithLabels = LocaleDescriptor & {
	label: string;
};
export const localeList = (t: TFunction): Array<LocaleDescriptorWithLabels> => [
	{
		...SUPPORTED_LOCALES.zh_CN,
		label: t('locale.label_chinese', {
			value: SUPPORTED_LOCALES.zh_CN.name,
			defaultValue: 'Chinese (China) - {{value}}'
		})
	},
	{
		...SUPPORTED_LOCALES.nl,
		label: t('locale.label_dutch', {
			value: SUPPORTED_LOCALES.nl.name,
			defaultValue: 'Dutch - {{value}}'
		})
	},
	{
		...SUPPORTED_LOCALES.en,
		label: t('locale.label_english', {
			value: SUPPORTED_LOCALES.en.name,
			defaultValue: 'English - {{value}}'
		})
	},
	{
		...SUPPORTED_LOCALES.de,
		label: t('locale.label_german', {
			value: SUPPORTED_LOCALES.de.name,
			defaultValue: 'German - {{value}}'
		})
	},
	{
		...SUPPORTED_LOCALES.hi,
		label: t('locale.label_hindi', {
			value: SUPPORTED_LOCALES.hi.name,
			defaultValue: 'Hindi - {{value}}'
		})
	},
	{
		...SUPPORTED_LOCALES.hu,
		label: t('locale.label_hungarian', {
			value: SUPPORTED_LOCALES.hu.name,
			defaultValue: 'Hungarian - {{value}}'
		})
	},
	{
		...SUPPORTED_LOCALES.it,
		label: t('locale.label_italian', {
			value: SUPPORTED_LOCALES.it.name,
			defaultValue: 'Italian - {{value}}'
		})
	},
	{
		...SUPPORTED_LOCALES.ja,
		label: t('locale.label_japanese', {
			value: SUPPORTED_LOCALES.ja.name,
			defaultValue: 'Japanese - {{value}}'
		})
	},
	{
		...SUPPORTED_LOCALES.pt,
		label: t('locale.label_portuguese', {
			value: SUPPORTED_LOCALES.pt.name,
			defaultValue: 'Portuguese - {{value}}'
		})
	},
	{
		...SUPPORTED_LOCALES.pl,
		label: t('locale.label_polish', {
			value: SUPPORTED_LOCALES.pl.name,
			defaultValue: 'Polish - {{value}}'
		})
	},
	{
		...SUPPORTED_LOCALES.ro,
		label: t('locale.label_romanian', {
			value: SUPPORTED_LOCALES.ro.name,
			defaultValue: 'Romanian - {{value}}'
		})
	},
	{
		...SUPPORTED_LOCALES.ru,
		label: t('locale.label_russian', {
			value: SUPPORTED_LOCALES.ru.name,
			defaultValue: 'Russian - {{value}}'
		})
	},
	{
		...SUPPORTED_LOCALES.es,
		label: t('locale.label_spanish', {
			value: SUPPORTED_LOCALES.es.name,
			defaultValue: 'Spanish - {{value}}'
		})
	},
	{
		...SUPPORTED_LOCALES.th,
		label: t('locale.label_thai', {
			value: SUPPORTED_LOCALES.th.name,
			defaultValue: 'Thai - {{value}}'
		})
	},
	{
		...SUPPORTED_LOCALES.tr,
		label: t('locale.label_turkish', {
			value: SUPPORTED_LOCALES.tr.name,
			defaultValue: 'Turkish - {{value}}'
		})
	},
	{
		...SUPPORTED_LOCALES.fr,
		label: t('locale.label_french', {
			value: SUPPORTED_LOCALES.fr.name,
			defaultValue: 'French - {{value}}'
		})
	},
	{
		...SUPPORTED_LOCALES.vi,
		label: t('locale.label_vietnamese', {
			value: SUPPORTED_LOCALES.vi.name,
			defaultValue: 'Vietnamese - {{value}}'
		})
	},
	{
		...SUPPORTED_LOCALES.ky,
		label: t('locale.label_kyrgyz', {
			value: SUPPORTED_LOCALES.ky.name,
			defaultValue: 'Kyrgyz - {{value}}'
		})
	},
	{
		...SUPPORTED_LOCALES.bs,
		label: t('locale.label_bosnian', {
			value: SUPPORTED_LOCALES.bs.name,
			defaultValue: 'Bosnian - {{value}}'
		})
	},
	{
		...SUPPORTED_LOCALES.sl,
		label: t('locale.label_slovenian', {
			value: SUPPORTED_LOCALES.sl.name,
			defaultValue: 'Slovenian - {{value}}'
		})
	}
];
