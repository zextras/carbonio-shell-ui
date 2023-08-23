/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

export type LocaleDescriptor = {
	name: string;
	value: string;
	/*
	 * Name of the date-fns translation file if different from the value field
	 */
	dateFnsLocale?: string;
	/*
	 * Name of the tinymce translation file if different from the value field.
	 * See https://www.tiny.cloud/docs/tinymce/6/ui-localization/
	 * and https://www.tiny.cloud/get-tiny/language-packages/
	 */
	tinymceLocale?: string;
};
export const SUPPORTED_LOCALES = {
	zh_CN: {
		name: '中文 (中国)',
		value: 'zh_CN',
		dateFnsLocale: 'zh-CN',
		tinymceLocale: 'zh-Hans'
	},
	nl: {
		name: 'Nederlands',
		value: 'nl'
	},
	en: {
		name: 'English',
		value: 'en',
		dateFnsLocale: 'en-US'
	},
	de: {
		name: 'Deutsch',
		value: 'de'
	},
	hi: {
		name: 'हिंदी',
		value: 'hi'
	},
	it: {
		name: 'italiano',
		value: 'it'
	},
	ja: {
		name: '日本語',
		value: 'ja'
	},

	pt: {
		name: 'português',
		value: 'pt',
		tinymceLocale: 'pt_BR'
	},
	pl: {
		name: 'polski',
		value: 'pl'
	},
	pt_BR: {
		name: 'português (Brasil)',
		value: 'pt_BR',
		dateFnsLocale: 'pt-BR'
	},

	ro: {
		name: 'română',
		value: 'ro'
	},
	ru: {
		name: 'русский',
		value: 'ru'
	},

	es: {
		name: 'español',
		value: 'es'
	},

	th: {
		name: 'ไทย',
		value: 'th',
		tinymceLocale: 'th_TH'
	},
	tr: {
		name: 'Türkçe',
		value: 'tr'
	},
	fr: {
		name: 'français',
		value: 'fr',
		tinymceLocale: 'fr_FR'
	},
	vi: {
		name: 'Tiếng Việt',
		value: 'vi'
	}
} satisfies Record<string, LocaleDescriptor>;
