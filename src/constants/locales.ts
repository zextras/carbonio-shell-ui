/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import type { Locale } from 'date-fns';
import type { TFunction } from 'i18next';

import { DEFAULT_LOCALES } from './default-locales';

export const DATE_FNS_LOCALE: Record<
	string,
	{ key?: string; localeImportPath: () => Promise<Locale> } | undefined
> = {
	zh_CN: {
		key: 'zh-CN',
		localeImportPath: () =>
			/* webpackMode: "lazy", webpackChunkName: "zh-CN" */ import('date-fns/locale/zh-CN').then(
				({ zhCN }) => zhCN
			)
	},
	nl: {
		localeImportPath: () =>
			/* webpackMode: "lazy", webpackChunkName: "nl" */ import('date-fns/locale/nl').then(
				({ nl }) => nl
			)
	},
	en: {
		key: 'en-US',
		localeImportPath: () =>
			/* webpackMode: "lazy", webpackChunkName: "en-US" */ import('date-fns/locale/en-US').then(
				({ enUS }) => enUS
			)
	},
	de: {
		localeImportPath: () =>
			/* webpackMode: "lazy", webpackChunkName: "de" */ import('date-fns/locale/de').then(
				({ de }) => de
			)
	},
	hi: {
		localeImportPath: () =>
			/* webpackMode: "lazy", webpackChunkName: "hi" */ import('date-fns/locale/hi').then(
				({ hi }) => hi
			)
	},
	hu: {
		localeImportPath: () =>
			/* webpackMode: "lazy", webpackChunkName: "hu" */ import('date-fns/locale/hu').then(
				({ hu }) => hu
			)
	},
	it: {
		localeImportPath: () =>
			/* webpackMode: "lazy", webpackChunkName: "it" */ import('date-fns/locale/it').then(
				({ it }) => it
			)
	},
	ja: {
		localeImportPath: () =>
			/* webpackMode: "lazy", webpackChunkName: "ja" */ import('date-fns/locale/ja').then(
				({ ja }) => ja
			)
	},
	pt: {
		localeImportPath: () =>
			/* webpackMode: "lazy", webpackChunkName: "pt" */ import('date-fns/locale/pt').then(
				({ pt }) => pt
			)
	},
	pl: {
		localeImportPath: () =>
			/* webpackMode: "lazy", webpackChunkName: "pl" */ import('date-fns/locale/pl').then(
				({ pl }) => pl
			)
	},
	ro: {
		localeImportPath: () =>
			/* webpackMode: "lazy", webpackChunkName: "ro" */ import('date-fns/locale/ro').then(
				({ ro }) => ro
			)
	},
	ru: {
		localeImportPath: () =>
			/* webpackMode: "lazy", webpackChunkName: "ru" */ import('date-fns/locale/ru').then(
				({ ru }) => ru
			)
	},
	es: {
		localeImportPath: () =>
			/* webpackMode: "lazy", webpackChunkName: "es" */ import('date-fns/locale/es').then(
				({ es }) => es
			)
	},
	th: {
		localeImportPath: () =>
			/* webpackMode: "lazy", webpackChunkName: "th" */ import('date-fns/locale/th').then(
				({ th }) => th
			)
	},
	tr: {
		localeImportPath: () =>
			/* webpackMode: "lazy", webpackChunkName: "tr" */ import('date-fns/locale/tr').then(
				({ tr }) => tr
			)
	},
	fr: {
		localeImportPath: () =>
			/* webpackMode: "lazy", webpackChunkName: "fr" */ import('date-fns/locale/fr').then(
				({ fr }) => fr
			)
	},
	vi: {
		localeImportPath: () =>
			/* webpackMode: "lazy", webpackChunkName: "vi" */ import('date-fns/locale/vi').then(
				({ vi }) => vi
			)
	},
	ky: undefined,
	bs: {
		localeImportPath: () =>
			/* webpackMode: "lazy", webpackChunkName: "bs" */ import('date-fns/locale/bs').then(
				({ bs }) => bs
			)
	},
	sl: {
		localeImportPath: () =>
			/* webpackMode: "lazy", webpackChunkName: "sl" */ import('date-fns/locale/sl').then(
				({ sl }) => sl
			)
	}
} as const;

export type LocaleDescriptorWithLabels = {
	label: string;
	value: string;
};

// used in language settings
export const localeList = (t: TFunction): Array<LocaleDescriptorWithLabels> =>
	Object.values(DEFAULT_LOCALES).map((locale) => ({
		value: locale.value,
		label: t(locale.labelKey, { value: locale.name, defaultValue: locale.labelDefaultValue })
	}));
