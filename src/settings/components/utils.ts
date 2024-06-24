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

export type TimeZoneDescriptor = {
	value: string;
	label: string;
	offSet?: string;
};

export const timeZoneList = (t: TFunction): Array<TimeZoneDescriptor> => [
	{
		value: 'Etc/GMT+12',
		label: t('timezone.etc_gmt+12', { value: 'GMT -12:00', defaultValue: '{{value}} Dateline' })
	},
	{
		value: 'Pacific/Midway',
		label: t('timezone.pacific_midway', { value: 'GMT -11:00', defaultValue: '{{value}} Samoa' })
	},
	{
		value: 'America/Adak',
		label: t('timezone.america_adak', { value: 'GMT -10:00', defaultValue: '{{value}} Adak' })
	},
	{
		value: 'Pacific/Honolulu',
		label: t('timezone.pacific_honolulu', { value: 'GMT -10:00', defaultValue: '{{value}} Hawaii' })
	},
	{
		value: 'Pacific/Marquesas',
		label: t('timezone.pacific_marquesas', {
			value: 'GMT -09:30',
			defaultValue: '{{value}} Marquesas'
		})
	},
	{
		value: 'America/Anchorage',
		label: t('timezone.america_anchorage', {
			value: 'GMT -09:00',
			defaultValue: '{{value}} Alaska'
		})
	},
	{
		value: 'America/Los_Angeles',
		label: t('timezone.america_los_angeles', {
			value: 'GMT -08:00',
			defaultValue: '{{value}} US/Canada Pacific'
		})
	},
	{
		value: 'America/Tijuana',
		label: t('timezone.america_tijuana', {
			value: 'GMT -08:00',
			defaultValue: '{{value}} Baja California'
		})
	},
	{
		value: 'America/Chihuahua',
		label: t('timezone.america_chihuahua', {
			value: 'GMT -07:00',
			defaultValue: '{{value}} Chihuahua, La Paz, Mazatlan'
		})
	},
	{
		value: 'America/Denver',
		label: t('timezone.america_denver', {
			value: 'GMT -07:00',
			defaultValue: '{{value}} US/Canada Mountain'
		})
	},
	{
		value: 'America/Fort_Nelson',
		label: t('timezone.america_fort_nelson', {
			value: 'GMT -07:00',
			defaultValue: '{{value}} Fort Nelson'
		})
	},
	{
		value: 'America/Phoenix',
		label: t('timezone.america_phoenix', { value: 'GMT -07:00', defaultValue: '{{value}} Arizona' })
	},
	{
		value: 'America/Whitehorse',
		label: t('timezone.america_whitehorse', {
			value: 'GMT -07:00',
			defaultValue: '{{value}} Yukon'
		})
	},
	{
		value: 'America/Chicago',
		label: t('timezone.america_chicago', {
			value: 'GMT -06:00',
			defaultValue: '{{value}} US/Canada Central'
		})
	},
	{
		value: 'America/Guatemala',
		label: t('timezone.america_guatemala', {
			value: 'GMT -06:00',
			defaultValue: '{{value}} Central America'
		})
	},
	{
		value: 'America/Mexico_City',
		label: t('timezone.america_mexico_city', {
			value: 'GMT -06:00',
			defaultValue: '{{value}} Guadalajara, Mexico City, Monterrey'
		})
	},
	{
		value: 'America/Regina',
		label: t('timezone.america_regina', {
			value: 'GMT -06:00',
			defaultValue: '{{value}} Saskatchewan'
		})
	},
	{
		value: 'Pacific/Easter',
		label: t('timezone.pacific_easter', { value: 'GMT -06:00', defaultValue: '{{value}} Easter' })
	},
	{
		value: 'America/Bogota',
		label: t('timezone.america_bogota', { value: 'GMT -05:00', defaultValue: '{{value}} Colombia' })
	},
	{
		value: 'America/Cancun',
		label: t('timezone.america_cancun', {
			value: 'GMT -05:00',
			defaultValue: '{{value}} Cancun, Chetumal'
		})
	},
	{
		value: 'America/Grand_Turk',
		label: t('timezone.america_grand_turk', {
			value: 'GMT -05:00',
			defaultValue: '{{value}} Turks and Caicos Islands'
		})
	},
	{
		value: 'America/Havana',
		label: t('timezone.america_havana', { value: 'GMT -05:00', defaultValue: '{{value}} Havana' })
	},
	{
		value: 'America/Indiana/Indianapolis',
		label: t('timezone.america_indiana_indianapolis', {
			value: 'GMT -05:00',
			defaultValue: '{{value}} Indiana (East)'
		})
	},
	{
		value: 'America/New_York',
		label: t('timezone.america_new_york', {
			value: 'GMT -05:00',
			defaultValue: '{{value}} US/Canada Eastern'
		})
	},
	{
		value: 'America/Port-au-Prince',
		label: t('timezone.america_port-au-prince', {
			value: 'GMT -05:00',
			defaultValue: '{{value}} Port-au-Prince'
		})
	},
	{
		value: 'America/Asuncion',
		label: t('timezone.america_asuncion', {
			value: 'GMT -04:00',
			defaultValue: '{{value}} Asuncion'
		})
	},
	{
		value: 'America/Caracas',
		label: t('timezone.america_caracas', { value: 'GMT -04:00', defaultValue: '{{value}} Caracas' })
	},
	{
		value: 'America/Cuiaba',
		label: t('timezone.america_cuiaba', { value: 'GMT -04:00', defaultValue: '{{value}} Cuiaba' })
	},
	{
		value: 'America/Guyana',
		label: t('timezone.america_guyana', {
			value: 'GMT -04:00',
			defaultValue: '{{value}} Georgetown, La Paz, Manaus, San Juan'
		})
	},
	{
		value: 'America/Halifax',
		label: t('timezone.america_halifax', {
			value: 'GMT -04:00',
			defaultValue: '{{value}} Atlantic Time (Canada)'
		})
	},
	{
		value: 'America/Santiago',
		label: t('timezone.america_santiago', {
			value: 'GMT -04:00',
			defaultValue: '{{value}} Pacific South America'
		})
	},
	{
		value: 'America/St_Johns',
		label: t('timezone.america_st_johns', {
			value: 'GMT -03:30',
			defaultValue: '{{value}} Newfoundland'
		})
	},
	{
		value: 'America/Araguaina',
		label: t('timezone.america_araguaina', {
			value: 'GMT -03:00',
			defaultValue: '{{value}} Araguaina'
		})
	},
	{
		value: 'America/Argentina/Buenos_Aires',
		label: t('timezone.america_argentina_buenos_aires', {
			value: 'GMT -03:00',
			defaultValue: '{{value}} Argentina'
		})
	},
	{
		value: 'America/Bahia',
		label: t('timezone.america_bahia', { value: 'GMT -03:00', defaultValue: '{{value}} Salvador' })
	},
	{
		value: 'America/Cayenne',
		label: t('timezone.america_cayenne', {
			value: 'GMT -03:00',
			defaultValue: '{{value}} Cayenne, Fortaleza'
		})
	},
	{
		value: 'America/Miquelon',
		label: t('timezone.america_miquelon', {
			value: 'GMT -03:00',
			defaultValue: '{{value}} Miquelon'
		})
	},
	{
		value: 'America/Montevideo',
		label: t('timezone.america_montevideo', {
			value: 'GMT -03:00',
			defaultValue: '{{value}} Montevideo'
		})
	},
	{
		value: 'America/Punta_Arenas',
		label: t('timezone.america_punta_arenas', {
			value: 'GMT -03:00',
			defaultValue: '{{value}} Punta_Arenas'
		})
	},
	{
		value: 'America/Sao_Paulo',
		label: t('timezone.america_sao_paulo', {
			value: 'GMT -03:00',
			defaultValue: '{{value}} Brasilia'
		})
	},
	{
		value: 'Atlantic/South_Georgia',
		label: t('timezone.atlantic_south_georgia', {
			value: 'GMT -02:00',
			defaultValue: '{{value}} Mid-Atlantic'
		})
	},
	{
		value: 'Atlantic/Azores',
		label: t('timezone.atlantic_azores', { value: 'GMT -01:00', defaultValue: '{{value}} Azores' })
	},
	{
		value: 'Atlantic/Cape_Verde',
		label: t('timezone.atlantic_cape_verde', {
			value: 'GMT -01:00',
			defaultValue: '{{value}} Cape Verde Is.'
		})
	},
	{
		value: 'Africa/Monrovia',
		label: t('timezone.africa_monrovia', {
			value: 'GMT +00:00',
			defaultValue: '{{value}} Monrovia'
		})
	},
	{
		value: 'Africa/Sao_Tome',
		label: t('timezone.africa_sao_tome', {
			value: 'GMT +00:00',
			defaultValue: '{{value}} Sao Tome'
		})
	},
	{
		value: 'Europe/London',
		label: t('timezone.europe_london', {
			value: 'GMT +00:00',
			defaultValue: '{{value}} Britain, Ireland, Portugal'
		})
	},
	{
		value: 'UTC',
		label: t('timezone.utc', {
			value: 'GMT/UTC',
			defaultValue: '{{value}} Coordinated Universal Time'
		})
	},
	{
		value: 'Africa/Algiers',
		label: t('timezone.africa_algiers', {
			value: 'GMT +01:00',
			defaultValue: '{{value}} West Central Africa'
		})
	},
	{
		value: 'Africa/Casablanca',
		label: t('timezone.africa_casablanca', {
			value: 'GMT +01:00',
			defaultValue: '{{value}} Casablanca'
		})
	},
	{
		value: 'Europe/Belgrade',
		label: t('timezone.europe_belgrade', {
			value: 'GMT +01:00',
			defaultValue: '{{value}} Belgrade, Bratislava, Budapest, Ljubljana, Prague'
		})
	},
	{
		value: 'Europe/Berlin',
		label: t('timezone.europe_berlin', {
			value: 'GMT +01:00',
			defaultValue: '{{value}} Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna'
		})
	},
	{
		value: 'Europe/Brussels',
		label: t('timezone.europe_brussels', {
			value: 'GMT +01:00',
			defaultValue: '{{value}} Brussels, Copenhagen, Madrid, Paris'
		})
	},
	{
		value: 'Europe/Warsaw',
		label: t('timezone.europe_warsaw', {
			value: 'GMT +01:00',
			defaultValue: '{{value}} Sarajevo, Skopje, Warsaw, Zagreb'
		})
	},
	{
		value: 'Africa/Cairo',
		label: t('timezone.africa_cairo', { value: 'GMT +02:00', defaultValue: '{{value}} Egypt' })
	},
	{
		value: 'Africa/Harare',
		label: t('timezone.africa_harare', {
			value: 'GMT +02:00',
			defaultValue: '{{value}} Harare, Pretoria'
		})
	},
	{
		value: 'Africa/Juba',
		label: t('timezone.africa_juba', { value: 'GMT +02:00', defaultValue: '{{value}} Juba' })
	},
	{
		value: 'Africa/Khartoum',
		label: t('timezone.africa_khartoum', {
			value: 'GMT +02:00',
			defaultValue: '{{value}} Khartoum'
		})
	},
	{
		value: 'Africa/Tripoli',
		label: t('timezone.africa_tripoli', { value: 'GMT +02:00', defaultValue: '{{value}} Tripoli' })
	},
	{
		value: 'Africa/Windhoek',
		label: t('timezone.africa_windhoek', { value: 'GMT +02:00', defaultValue: '{{value}} Namibia' })
	},
	{
		value: 'Asia/Amman',
		label: t('timezone.asia_amman', { value: 'GMT +02:00', defaultValue: '{{value}} Jordan' })
	},
	{
		value: 'Asia/Beirut',
		label: t('timezone.asia_beirut', { value: 'GMT +02:00', defaultValue: '{{value}} Beirut' })
	},
	{
		value: 'Asia/Damascus',
		label: t('timezone.asia_damascus', { value: 'GMT +02:00', defaultValue: '{{value}} Damascus' })
	},
	{
		value: 'Asia/Gaza',
		label: t('timezone.asia_gaza', { value: 'GMT +02:00', defaultValue: '{{value}} Gaza' })
	},
	{
		value: 'Asia/Jerusalem',
		label: t('timezone.asia_jerusalem', {
			value: 'GMT +02:00',
			defaultValue: '{{value}} Jerusalem'
		})
	},
	{
		value: 'Europe/Athens',
		label: t('timezone.europe_athens', {
			value: 'GMT +02:00',
			defaultValue: '{{value}} Athens, Beirut, Bucharest, Istanbul'
		})
	},
	{
		value: 'Europe/Bucharest',
		label: t('timezone.europe_bucharest', {
			value: 'GMT +02:00',
			defaultValue: '{{value}} Bucharest'
		})
	},
	{
		value: 'Europe/Chisinau',
		label: t('timezone.europe_chisinau', {
			value: 'GMT +02:00',
			defaultValue: '{{value}} Chisinau'
		})
	},
	{
		value: 'Europe/Helsinki',
		label: t('timezone.europe_helsinki', {
			value: 'GMT +02:00',
			defaultValue: '{{value}} Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius'
		})
	},
	{
		value: 'Europe/Kaliningrad',
		label: t('timezone.europe_kaliningrad', {
			value: 'GMT +02:00',
			defaultValue: '{{value}} Kaliningrad (RTZ 1)'
		})
	},
	{
		value: 'Africa/Nairobi',
		label: t('timezone.africa_nairobi', { value: 'GMT +03:00', defaultValue: '{{value}} Nairobi' })
	},
	{
		value: 'Asia/Baghdad',
		label: t('timezone.asia_baghdad', { value: 'GMT +03:00', defaultValue: '{{value}} Iraq' })
	},
	{
		value: 'Asia/Kuwait',
		label: t('timezone.asia_kuwait', {
			value: 'GMT +03:00',
			defaultValue: '{{value}} Kuwait, Riyadh'
		})
	},
	{
		value: 'Europe/Istanbul',
		label: t('timezone.europe_istanbul', {
			value: 'GMT +03:00',
			defaultValue: '{{value}} Istanbul'
		})
	},
	{
		value: 'Europe/Minsk',
		label: t('timezone.europe_minsk', { value: 'GMT +03:00', defaultValue: '{{value}} Minsk' })
	},
	{
		value: 'Europe/Moscow',
		label: t('timezone.europe_moscow', {
			value: 'GMT +03:00',
			defaultValue: '{{value}} Moscow, St. Petersburg, Volgograd (RTZ 2)'
		})
	},
	{
		value: 'Europe/Volgograd',
		label: t('timezone.europe_volgograd', {
			value: 'GMT +03:00',
			defaultValue: '{{value}} Volgograd'
		})
	},
	{
		value: 'Asia/Tehran',
		label: t('timezone.asia_tehran', { value: 'GMT +03:30', defaultValue: '{{value}} Tehran' })
	},
	{
		value: 'Asia/Baku',
		label: t('timezone.asia_baku', { value: 'GMT +04:00', defaultValue: '{{value}} Baku' })
	},
	{
		value: 'Asia/Muscat',
		label: t('timezone.asia_muscat', {
			value: 'GMT +04:00',
			defaultValue: '{{value}} Abu Dhabi, Muscat'
		})
	},
	{
		value: 'Asia/Tbilisi',
		label: t('timezone.asia_tbilisi', { value: 'GMT +04:00', defaultValue: '{{value}} Tbilisi' })
	},
	{
		value: 'Asia/Yerevan',
		label: t('timezone.asia_yerevan', { value: 'GMT +04:00', defaultValue: '{{value}} Yerevan' })
	},
	{
		value: 'Europe/Astrakhan',
		label: t('timezone.europe_astrakhan', {
			value: 'GMT +04:00',
			defaultValue: '{{value}} Astrakhan'
		})
	},
	{
		value: 'Europe/Samara',
		label: t('timezone.europe_samara', {
			value: 'GMT +04:00',
			defaultValue: '{{value}} Izhevsk, Samara (RTZ 3)'
		})
	},
	{
		value: 'Europe/Saratov',
		label: t('timezone.europe_saratov', { value: 'GMT +04:00', defaultValue: '{{value}} Saratov' })
	},
	{
		value: 'Indian/Mauritius',
		label: t('timezone.indian_mauritius', {
			value: 'GMT +04:00',
			defaultValue: '{{value}} Port Louis'
		})
	},
	{
		value: 'Asia/Kabul',
		label: t('timezone.asia_kabul', { value: 'GMT +04:30', defaultValue: '{{value}} Kabul' })
	},
	{
		value: 'Asia/Karachi',
		label: t('timezone.asia_karachi', {
			value: 'GMT +05:00',
			defaultValue: '{{value}} Islamabad, Karachi'
		})
	},
	{
		value: 'Asia/Qyzylorda',
		label: t('timezone.asia_qyzylorda', {
			value: 'GMT +05:00',
			defaultValue: '{{value}} Qyzylorda'
		})
	},
	{
		value: 'Asia/Tashkent',
		label: t('timezone.asia_tashkent', { value: 'GMT +05:00', defaultValue: '{{value}} Tashkent' })
	},
	{
		value: 'Asia/Yekaterinburg',
		label: t('timezone.asia_yekaterinburg', {
			value: 'GMT +05:00',
			defaultValue: '{{value}} Ekaterinburg (RTZ 4)'
		})
	},
	{
		value: 'Asia/Colombo',
		label: t('timezone.asia_colombo', {
			value: 'GMT +05:30',
			defaultValue: '{{value}} Sri Jayawardenepura Kotte'
		})
	},
	{
		value: 'Asia/Kolkata',
		label: t('timezone.asia_kolkata', {
			value: 'GMT +05:30',
			defaultValue: '{{value}} Chennai, Kolkata, Mumbai, New Delhi'
		})
	},
	{
		value: 'Asia/Kathmandu',
		label: t('timezone.asia_kathmandu', {
			value: 'GMT +05:45',
			defaultValue: '{{value}} Kathmandu'
		})
	},
	{
		value: 'Asia/Almaty',
		label: t('timezone.asia_almaty', { value: 'GMT +06:00', defaultValue: '{{value}} Astana' })
	},
	{
		value: 'Asia/Dhaka',
		label: t('timezone.asia_dhaka', { value: 'GMT +06:00', defaultValue: '{{value}} Dhaka' })
	},
	{
		value: 'Asia/Omsk',
		label: t('timezone.asia_omsk', { value: 'GMT +06:00', defaultValue: '{{value}} Omsk' })
	},
	{
		value: 'Asia/Yangon',
		label: t('timezone.asia_yangon', { value: 'GMT +06:30', defaultValue: '{{value}} Yangon' })
	},
	{
		value: 'Asia/Bangkok',
		label: t('timezone.asia_bangkok', {
			value: 'GMT +07:00',
			defaultValue: '{{value}} Bangkok, Hanoi, Jakarta'
		})
	},
	{
		value: 'Asia/Barnaul',
		label: t('timezone.asia_barnaul', { value: 'GMT +07:00', defaultValue: '{{value}} Barnaul' })
	},
	{
		value: 'Asia/Hovd',
		label: t('timezone.asia_hovd', { value: 'GMT +07:00', defaultValue: '{{value}} Hovd' })
	},
	{
		value: 'Asia/Krasnoyarsk',
		label: t('timezone.asia_krasnoyarsk', {
			value: 'GMT +07:00',
			defaultValue: '{{value}} Krasnoyarsk (RTZ 6)'
		})
	},
	{
		value: 'Asia/Novosibirsk',
		label: t('timezone.asia_novosibirsk', {
			value: 'GMT +07:00',
			defaultValue: '{{value}} Novosibirsk (RTZ 5)'
		})
	},
	{
		value: 'Asia/Tomsk',
		label: t('timezone.asia_tomsk', { value: 'GMT +07:00', defaultValue: '{{value}} Tomsk' })
	},
	{
		value: 'Asia/Hong_Kong',
		label: t('timezone.asia_hong_kong', {
			value: 'GMT +08:00',
			defaultValue: '{{value}} Beijing, Chongqing, Hong Kong, Urumqi'
		})
	},
	{
		value: 'Asia/Irkutsk',
		label: t('timezone.asia_irkutsk', {
			value: 'GMT +08:00',
			defaultValue: '{{value}} Irkutsk (RTZ 7)'
		})
	},
	{
		value: 'Asia/Kuala_Lumpur',
		label: t('timezone.asia_kuala_lumpur', {
			value: 'GMT +08:00',
			defaultValue: '{{value}} Kuala Lumpur'
		})
	},
	{
		value: 'Asia/Singapore',
		label: t('timezone.asia_singapore', {
			value: 'GMT +08:00',
			defaultValue: '{{value}} Singapore'
		})
	},
	{
		value: 'Asia/Taipei',
		label: t('timezone.asia_taipei', { value: 'GMT +08:00', defaultValue: '{{value}} Taipei' })
	},
	{
		value: 'Asia/Ulaanbaatar',
		label: t('timezone.asia_ulaanbaatar', {
			value: 'GMT +08:00',
			defaultValue: '{{value}} Ulaanbaatar'
		})
	},
	{
		value: 'Australia/Perth',
		label: t('timezone.australia_perth', { value: 'GMT +08:00', defaultValue: '{{value}} Perth' })
	},
	{
		value: 'Australia/Eucla',
		label: t('timezone.australia_eucla', { value: 'GMT +08:45', defaultValue: '{{value}} Eucla' })
	},
	{
		value: 'Asia/Chita',
		label: t('timezone.asia_chita', { value: 'GMT +09:00', defaultValue: '{{value}} Chita' })
	},
	{
		value: 'Asia/Pyongyang',
		label: t('timezone.asia_pyongyang', {
			value: 'GMT +09:00',
			defaultValue: '{{value}} Pyongyang'
		})
	},
	{
		value: 'Asia/Seoul',
		label: t('timezone.asia_seoul', { value: 'GMT +09:00', defaultValue: '{{value}} Korea' })
	},
	{
		value: 'Asia/Tokyo',
		label: t('timezone.asia_tokyo', { value: 'GMT +09:00', defaultValue: '{{value}} Japan' })
	},
	{
		value: 'Asia/Yakutsk',
		label: t('timezone.asia_yakutsk', {
			value: 'GMT +09:00',
			defaultValue: '{{value}} Yakutsk (RTZ 8)'
		})
	},
	{
		value: 'Australia/Adelaide',
		label: t('timezone.australia_adelaide', {
			value: 'GMT +09:30',
			defaultValue: '{{value}} Adelaide'
		})
	},
	{
		value: 'Australia/Darwin',
		label: t('timezone.australia_darwin', { value: 'GMT +09:30', defaultValue: '{{value}} Darwin' })
	},
	{
		value: 'Asia/Vladivostok',
		label: t('timezone.asia_vladivostok', {
			value: 'GMT +10:00',
			defaultValue: '{{value}} Vladivostok, Magadan (RTZ 9)'
		})
	},
	{
		value: 'Australia/Brisbane',
		label: t('timezone.australia_brisbane', {
			value: 'GMT +10:00',
			defaultValue: '{{value}} Brisbane'
		})
	},
	{
		value: 'Australia/Hobart',
		label: t('timezone.australia_hobart', { value: 'GMT +10:00', defaultValue: '{{value}} Hobart' })
	},
	{
		value: 'Australia/Sydney',
		label: t('timezone.australia_sydney', {
			value: 'GMT +10:00',
			defaultValue: '{{value}} Canberra, Melbourne, Sydney'
		})
	},
	{
		value: 'Pacific/Guam',
		label: t('timezone.pacific_guam', {
			value: 'GMT +10:00',
			defaultValue: '{{value}} Guam, Port Moresby'
		})
	},
	{
		value: 'Australia/Lord_Howe',
		label: t('timezone.australia_lord_howe', {
			value: 'GMT +10:30',
			defaultValue: '{{value}} Lord_Howe'
		})
	},
	{
		value: 'Asia/Magadan',
		label: t('timezone.asia_magadan', { value: 'GMT +11:00', defaultValue: '{{value}} Magadan' })
	},
	{
		value: 'Asia/Sakhalin',
		label: t('timezone.asia_sakhalin', { value: 'GMT +11:00', defaultValue: '{{value}} Sakhalin' })
	},
	{
		value: 'Asia/Srednekolymsk',
		label: t('timezone.asia_srednekolymsk', {
			value: 'GMT +11:00',
			defaultValue: '{{value}} Chokurdakh (RTZ 10)'
		})
	},
	{
		value: 'Pacific/Bougainville',
		label: t('timezone.pacific_bougainville', {
			value: 'GMT +11:00',
			defaultValue: '{{value}} Bougainville Standard Time'
		})
	},
	{
		value: 'Pacific/Guadalcanal',
		label: t('timezone.pacific_guadalcanal', {
			value: 'GMT +11:00',
			defaultValue: '{{value}} Solomon Is. / New Caledonia'
		})
	},
	{
		value: 'Pacific/Norfolk',
		label: t('timezone.pacific_norfolk', { value: 'GMT +11:00', defaultValue: '{{value}} Norfolk' })
	},
	{
		value: 'Asia/Kamchatka',
		label: t('timezone.asia_kamchatka', {
			value: 'GMT +12:00',
			defaultValue: '{{value}} Anadyr, Petropavlovsk-Kamchatsky (RTZ 11)'
		})
	},
	{
		value: 'Pacific/Auckland',
		label: t('timezone.pacific_auckland', {
			value: 'GMT +12:00',
			defaultValue: '{{value}} New Zealand'
		})
	},
	{
		value: 'Pacific/Fiji',
		label: t('timezone.pacific_fiji', { value: 'GMT +12:00', defaultValue: '{{value}} Fiji' })
	},
	{
		value: 'Pacific/Chatham',
		label: t('timezone.pacific_chatham', { value: 'GMT +12:45', defaultValue: '{{value}} Chatham' })
	},
	{
		value: 'Pacific/Apia',
		label: t('timezone.pacific_apia', { value: 'GMT +13:00', defaultValue: '{{value}} Samoa' })
	},
	{
		value: 'Pacific/Tongatapu',
		label: t('timezone.pacific_tongatapu', {
			value: 'GMT +13:00',
			defaultValue: '{{value}} Nuku’alofa'
		})
	},
	{
		value: 'Pacific/Kiritimati',
		label: t('timezone.pacific_kiritimati', {
			value: 'GMT +14:00',
			defaultValue: '{{value}} Kiritimati Island'
		})
	}
];

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
