/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import type React from 'react';

import type { TFunction } from 'i18next';
import { cloneDeep, filter, findIndex, isArray, isBoolean, reduce, uniq } from 'lodash';

import { BASE_FONT_SIZE, SCALING_LIMIT, SCALING_OPTIONS } from '../../constants';
import type { LocaleDescriptor } from '../../constants/locales';
import { SUPPORTED_LOCALES } from '../../constants/locales';
import type {
	Account,
	AccountSettings,
	BooleanString,
	GeneralizedTime,
	Identity,
	IdentityAttrs
} from '../../types/account';
import type { AddMod, PrefsMods } from '../../types/network';

export function dateToGenTime(date: Date): GeneralizedTime {
	return `${
		date.getUTCFullYear() +
		(date.getUTCMonth() + 1).toString().padStart(2, '0') +
		date.getUTCDate().toString().padStart(2, '0') +
		date.getUTCHours().toString().padStart(2, '0') +
		date.getUTCMinutes().toString().padStart(2, '0') +
		date.getUTCSeconds().toString().padStart(2, '0')
	}Z` as GeneralizedTime;
}

export function genTimeToDate(genTime: GeneralizedTime): Date {
	const date = new Date();
	date.setUTCFullYear(Number(genTime.substring(0, 4)));
	date.setUTCMonth(Number(genTime.substring(4, 6)) - 1);
	date.setUTCDate(Number(genTime.substring(6, 8)));
	date.setUTCHours(Number(genTime.substring(8, 10)));
	date.setUTCMinutes(Number(genTime.substring(10, 12)));
	date.setUTCSeconds(Number(genTime.substring(12, 14)));
	date.setUTCMilliseconds(0);
	return date;
}

export const startOfDay = (date: Date): Date => {
	const newDate = new Date(date);
	newDate.setHours(0, 0, 0, 0);
	return newDate;
};

export const endOfDay = (date: Date): Date => {
	const newDate = new Date(date);
	newDate.setHours(23, 59, 59, 0);
	return newDate;
};

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
		id: 'pt_BR',
		...SUPPORTED_LOCALES.pt_BR,
		localName: t('locale.portuguese_brazil', 'Portuguese (Brazil)'),
		label: t('locale.label_portuguese_brazil', {
			value: SUPPORTED_LOCALES.pt_BR.name,
			defaultValue: 'Portuguese - {{value}}'
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
	}
];
// TODO: For future languages
// export const localeList = (t: TFunction): any => [
// 	{
// 		id: 'ar',
// 		name: 'العربية',
// 		localName: t('locale.arabic', 'Arabic'),
// 		label: t('locale.label_arabic', { value: 'لعربية', defaultValue: 'Arabic - {{value}}' }),
// 		value: 'ar'
// 	},
// 	{
// 		id: 'eu',
// 		name: 'Euskara',
// 		localName: t('locale.basque', 'Basque'),
// 		label: t('locale.label_basque', { value: 'Euskara', defaultValue: 'Basque - {{value}}' }),
// 		value: 'eu'
// 	},
// 	{
// 		id: 'bg',
// 		name: 'български',
// 		localName: t('locale.bulgarian', 'Bulgarian'),
// 		label: t('locale.label_bulgarian', {
// 			value: 'български',
// 			defaultValue: 'Bulgarian - {{value}}'
// 		}),
// 		value: 'bg'
// 	},
// 	{
// 		id: 'ca',
// 		name: 'català',
// 		localName: t('locale.catalan', 'Catalan'),
// 		label: 'Catalan - català',
// 		value: 'ca'
// 	},
// 	{
// 		id: 'zh',
// 		name: '中文',
// 		localName: t('locale.chinese', 'Chinese'),
// 		label: 'Chinese - 中文',
// 		value: 'zh'
// 	},
// 	{
// 		id: 'zh_CN',
// 		name: '中文 (中国)',
// 		localName: t('locale.chinese_china', 'Chinese (China)'),
// 		label: 'Chinese (China) - 中文 (中国)',
// 		value: 'zh_CN'
// 	},
// 	{
// 		id: 'zh_HK',
// 		name: '中文 (香港)',
// 		localName: t('locale.chinese_hong_kong', 'Chinese (Hong Kong SAR China)'),
// 		label: 'Chinese (Hong Kong SAR China) - 中文 (香港)',
// 		value: 'zh_HK'
// 	},
// 	{
// 		id: 'zh_TW',
// 		name: '中文 (台灣)',
// 		localName: t('locale.chinese_taiwan', 'Chinese (Taiwan)'),
// 		label: 'Chinese (Taiwan) - 中文 (台灣)',
// 		value: 'zh_TW'
// 	},
// 	{
// 		id: 'hr',
// 		name: 'hrvatski',
// 		localName: t('locale.croatian', 'Croatian'),
// 		label: 'Croatian - hrvatski',
// 		value: 'hr'
// 	},
// 	{
// 		id: 'da',
// 		name: 'Dansk',
// 		localName: t('locale.danish', 'Danish'),
// 		label: 'Danish - Dansk',
// 		value: 'da'
// 	},

// 	{
// 		id: 'en_AU',
// 		name: 'English (Australia)',
// 		localName: t('locale.english_australia', 'English (Australia)'),
// 		label: 'English (Australia) - English (Australia)',
// 		value: 'en_AU'
// 	},
// 	{
// 		id: 'en_GB',
// 		name: 'English (United Kingdom)',
// 		localName: t('locale.english_united_kingdom', 'English (United Kingdom)'),
// 		label: 'English (United Kingdom) - English (United Kingdom)',
// 		value: 'en_GB'
// 	},
// 	{
// 		id: 'en_US',
// 		name: 'English (United States)',
// 		localName: t('locale.english_united_states', 'English (United States)'),
// 		label: 'English (United States) - English (United States)',
// 		value: 'en_US'
// 	},
// 	{
// 		id: 'fr',
// 		name: 'français',
// 		localName: t('locale.french', 'French'),
// 		label: 'French - français',
// 		value: 'fr'
// 	},
// 	{
// 		id: 'fr_CA',
// 		name: 'français (Canada)',
// 		localName: t('locale.french_canada', 'French (Canada)'),
// 		label: 'French (Canada) - français (Canada)',
// 		value: 'fr_CA'
// 	},
// 	{
// 		id: 'fr_FR',
// 		name: 'français (France)',
// 		localName: t('locale.french_france', 'French (France)'),
// 		label: 'French (France) - français (France)',
// 		value: 'fr_FR'
// 	},

// 	{
// 		id: 'iw',
// 		name: 'עברית',
// 		localName: t('locale.hebrew', 'Hebrew'),
// 		label: 'Hebrew - עברית',
// 		value: 'iw'
// 	},

// 	{
// 		id: 'hu',
// 		name: 'magyar',
// 		localName: t('locale.hungarian', 'Hungarian'),
// 		label: 'Hungarian - magyar',
// 		value: 'hu'
// 	},
// 	{
// 		id: 'in',
// 		name: 'Bahasa Indonesia',
// 		localName: t('locale.indonesian', 'Indonesian'),
// 		label: 'Indonesian - Bahasa Indonesia',
// 		value: 'in'
// 	},

// 	{
// 		id: 'ko',
// 		name: '한국어',
// 		localName: t('locale.korean', 'Korean'),
// 		label: 'Korean - 한국어',
// 		value: 'ko'
// 	},
// 	{
// 		id: 'lo',
// eslint-disable-next-line no-irregular-whitespace
// 		name: 'ພາ​ສາ​ລາວ',
// 		localName: t('locale.lao', 'Lao'),
// eslint-disable-next-line no-irregular-whitespace
// 		label: 'Lao - ພາ​ສາ​ລາວ',
// 		value: 'lo'
// 	},
// 	{
// 		id: 'ms',
// 		name: 'Bahasa Melayu',
// 		localName: t('locale.malay', 'Malay'),
// 		label: 'Malay - Bahasa Melayu',
// 		value: 'ms'
// 	},
// 	{
// 		id: 'no',
// 		name: 'norsk',
// 		localName: t('locale.norwegian', 'Norwegian'),
// 		label: 'Norwegian - norsk',
// 		value: 'no'
// 	},

// 	{
// 		id: 'pt_PT',
// 		name: 'português (Portugal)',
// 		localName: t('locale.potuguese_portugal', 'Portuguese (Portugal)'),
// 		label: 'Portuguese (Portugal) - português (Portugal)',
// 		value: 'pt_PT'
// 	},

// 	{
// 		id: 'sl',
// 		name: 'Slovenščina',
// 		localName: t('locale.slovenian', 'Slovenian'),
// 		label: 'Slovenian - Slovenščina',
// 		value: 'sl'
// 	},

// 	{
// 		id: 'sv',
// 		name: 'svenska',
// 		localName: t('locale.swedish', 'Swedish'),
// 		label: 'Swedish - svenska',
// 		value: 'sv'
// 	},
// 	{
// 		id: 'ta',
// 		name: 'தமிழ்',
// 		localName: t('locale.tamil', 'Tamil'),
// 		label: 'Tamil - தமிழ்',
// 		value: 'ta'
// 	},

// 	{
// 		id: 'uk',
// 		name: 'українська',
// 		localName: t('locale.ukrainian', 'Ukrainian'),
// 		label: 'Ukrainian - українська',
// 		value: 'uk'
// 	},

// ];

export const getAutoScalingFontSize = (): number => {
	if (
		window.screen.width <= SCALING_LIMIT.width &&
		window.screen.height <= SCALING_LIMIT.height &&
		window.devicePixelRatio >= SCALING_LIMIT.dpr
	) {
		const baseFontIndex = SCALING_OPTIONS.findIndex((option) => option.value === BASE_FONT_SIZE);
		if (baseFontIndex > 0) {
			return SCALING_OPTIONS[baseFontIndex - 1].value;
		}
	}
	return BASE_FONT_SIZE;
};

export type ResetComponentImperativeHandler = { reset: () => void };

type UpsertPrefOnUnsavedChangesFn = <K extends keyof PrefsMods>(
	prefKey: K,
	prefValue: PrefsMods[K] extends BooleanString | undefined ? boolean | undefined : PrefsMods[K]
) => void;

export function upsertPrefOnUnsavedChanges(
	addModifiedValueCallback: AddMod
): UpsertPrefOnUnsavedChangesFn {
	return (prefKey, prefValue) => {
		if (prefValue === undefined) {
			addModifiedValueCallback('prefs', prefKey, '');
		} else if (isBoolean(prefValue)) {
			addModifiedValueCallback('prefs', prefKey, (prefValue && 'TRUE') || 'FALSE');
		} else {
			addModifiedValueCallback('prefs', prefKey, prefValue as PrefsMods[typeof prefKey]);
		}
	};
}

export type SettingsSectionProps = {
	resetRef?: React.Ref<ResetComponentImperativeHandler>;
};

export function isPrimary(identity: Identity): boolean {
	return identity.name === 'DEFAULT';
}

export function defaultAsFirstOrderIdentities(identities: Array<Identity>): Array<Identity> {
	const defaultIdx = identities.findIndex(isPrimary);
	const result = cloneDeep(identities);
	const defaultIdentity = result.splice(defaultIdx, 1);
	result.unshift(defaultIdentity[0]);
	return result;
}

/**
 * Compose a unique list of all identities' email addresses
 *
 * The list is composed of:
 * - the email address of the current account
 * - the email addresses of all the shared accounts (taken from the rights infos)
 * - all the aliases
 *
 * @param account
 * @param settings
 *
 * @returns a list of unique email addresses
 */
export const getAvailableEmailAddresses = (
	account: Account,
	settings: AccountSettings
): string[] => {
	const result: string[] = [];

	// Adds the email address of the primary account
	result.push(account.name);

	// Adds the email addresses of all the shared accounts
	if (account.rights?.targets) {
		account.rights?.targets.forEach((target) => {
			if (target.target && (target.right === 'sendAs' || target.right === 'sendOnBehalfOf')) {
				target.target.forEach((user) => {
					if (user.type === 'account' && user.email) {
						user.email.forEach((email) => {
							result.push(email.addr);
						});
					}
				});
			}
		});
	}

	// Adds all the aliases
	if (settings.attrs.zimbraMailAlias) {
		if (isArray(settings.attrs.zimbraMailAlias)) {
			result.push(...(settings.attrs.zimbraMailAlias as string[]));
		} else {
			result.push(String(settings.attrs.zimbraMailAlias));
		}
	}

	return uniq(result);
};

export function calculateNewIdentitiesState(
	currentIdentities: Array<Identity>,
	deletedIdentities: Array<string>,
	addedIdentities: Array<Identity>,
	modifiedIdentitiesAttrs: Record<string, Partial<IdentityAttrs>>
): Array<Identity> {
	const filteredIdentities = filter(
		currentIdentities,
		(item) => !deletedIdentities.includes(item.id)
	);

	const filteredAndModified = reduce(
		modifiedIdentitiesAttrs,
		(accumulator, attrs, id) => {
			const propIndex = findIndex(accumulator, (identity) => identity.id === id);
			if (propIndex > -1) {
				accumulator[propIndex]._attrs = {
					...accumulator[propIndex]._attrs,
					...attrs
				};
				if (attrs.zimbraPrefIdentityName && !isPrimary(accumulator[propIndex])) {
					accumulator[propIndex].name = attrs.zimbraPrefIdentityName;
				}
			}
			return accumulator;
		},
		filteredIdentities
	);

	filteredAndModified.splice(-1, 0, ...addedIdentities);
	return filteredAndModified;
}

/**
 * Format a size in byte as human-readable
 */
export const humanFileSize = (inputSize: number, t: TFunction | undefined): string => {
	const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
	if (inputSize === 0) {
		const unit = units[0];
		const translatedUnit = t ? t('size.unitMeasure', { context: unit, defaultValue: unit }) : unit;
		return `0 ${translatedUnit}`;
	}
	const i = Math.floor(Math.log(inputSize) / Math.log(1024));
	if (i >= units.length) {
		throw new Error('Unsupported inputSize');
	}
	const unit = units[i];
	const unitTranslated = t ? t('size.unitMeasure', { context: unit, defaultValue: unit }) : unit;
	const size = (inputSize / 1024 ** i).toFixed(2).toString();
	return `${size} ${unitTranslated}`;
};
