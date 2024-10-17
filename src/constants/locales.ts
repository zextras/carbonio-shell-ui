/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import type { Locale } from 'date-fns';

export type LocaleDescriptor = {
	name: string;
	value: string;
	// Import of the date-fns translation file
	dateFnsLocale?: { key?: string; localeImportPath: () => Promise<Locale> };
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
	pt_BR: {
		name: 'português (Brasil)',
		value: 'pt_BR',
		dateFnsLocale: {
			key: 'pt-BR',
			localeImportPath: () =>
				/* webpackMode: "lazy", webpackChunkName: "pt-BR" */ import('date-fns/locale/pt-BR').then(
					({ ptBR }) => ptBR
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
		value: 'ky'
	}
} as const;
