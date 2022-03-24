/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import moment from 'moment';
import { TFunction } from 'i18next';
import { AccountSettings } from '../../../types';

// const [t] = useTranslation();

export const ItemsSendAutoReplies = (t: TFunction): any => [
	{
		label: t('settings.out_of_office.send_auto_replies', 'Send auto-replies'),
		value: 'TRUE'
	},
	{
		label: t('settings.out_of_office.do_not_send_auto_replies', 'Do not send auto-replies'),
		value: 'FALSE'
	}
];

export const ItemsExternalSenders = (t: TFunction): any => [
	{
		label: t(
			'settings.out_of_office.external_senders.send_standard_auto_reply',
			'Send standard auto-reply message'
		),
		value: 'SEND_AUTO_REPLY'
	},
	{
		label: t(
			'settings.out_of_office.external_senders.send_custom_in_organisation',
			'Send custom message to those who are not in my organization'
		),
		value: 'SHOW_EXTERNAL_INPUT'
	},
	{
		label: t(
			'settings.out_of_office.external_senders.send_custom_not_in_organisation',
			'Send custom message to those who are not in my organization or address book'
		),
		value: 'SEND_NOT_IN_ORG'
	},
	{
		label: t(
			'settings.out_of_office.external_senders.do_not_send_to_external',
			'Don’t send an auto-reply message to external sender'
		),
		value: 'SUPPRESS_EXTERNAL'
	}
];

export const ItemsOutOfOfficeStatus = (t: TFunction): any => [
	{
		label: t('label.out_of_office', 'Out of Office'),
		value: 'OUTOFOFFICE'
	},
	{
		label: t('settings.out_of_office.status.busy', 'Busy'),
		value: 'BUSY'
	}
];

export const getExternalSendersPrefsData = (
	settings: AccountSettings,
	ret: string,
	t: TFunction
): string => {
	let item;
	const itemsExternalSenders = ItemsExternalSenders(t);
	if (
		settings.prefs.zimbraPrefOutOfOfficeSuppressExternalReply === 'FALSE' &&
		settings.prefs.zimbraPrefOutOfOfficeExternalReplyEnabled === 'FALSE'
	) {
		item = { ...itemsExternalSenders[0] };
	} else if (
		settings.prefs.zimbraPrefExternalSendersType === 'ALL' &&
		settings.prefs.zimbraPrefOutOfOfficeExternalReplyEnabled === 'TRUE'
	) {
		item = { ...itemsExternalSenders[1] };
	} else if (
		settings.prefs.zimbraPrefExternalSendersType === 'ALLNOTINAB' &&
		settings.prefs.zimbraPrefOutOfOfficeExternalReplyEnabled === 'TRUE'
	) {
		item = { ...itemsExternalSenders[2] };
	} else {
		item = { ...itemsExternalSenders[3] };
	}
	return String(item[ret]);
};

export const getOutOfOfficeStatusPrefsData = (
	settings: AccountSettings,
	ret: string,
	t: TFunction
): string => {
	let item;
	const itemsOutOfOfficeStatus = ItemsOutOfOfficeStatus(t);
	if (settings.prefs.zimbraPrefOutOfOfficeFreeBusyStatus === 'BUSY') {
		item = { ...itemsOutOfOfficeStatus[1] };
	} else {
		item = { ...itemsOutOfOfficeStatus[0] };
	}

	return String(item[ret]);
};

export const changeDateEvent = (date: string | Date): string =>
	moment(moment(date, 'YYYYMMDDHHmmss[Z]').utc()).format('YYYYMMDDHHmmss[Z]');

export const getDateEvent = (date: string): Date =>
	new Date(moment.utc(date, 'YYYYMMDDHHmmss[Z]').local().valueOf());

export const startOfDate = (date: string): string =>
	moment.utc(date, 'YYYYMMDDHHmmss[Z]').local().startOf('day').utc().format('YYYYMMDDHHmmss[Z]');

export const endOfDate = (date: string): string =>
	moment.utc(date, 'YYYYMMDDHHmmss[Z]').local().endOf('day').utc().format('YYYYMMDDHHmmss[Z]');

export const localeList = (
	t: TFunction
): Array<{ id: string; name: string; localName: string; value: string; label: string }> => [
	{
		id: 'zh_CN',
		name: '中文 (中国)',
		localName: t('locale.chinese_china', 'Chinese (China)'),
		label: t('locale.label_chinese', {
			value: '中文 (中国)',
			defaultValue: 'Chinese (China) - {{value}}'
		}),
		value: 'zh_CN'
	},
	{
		id: 'nl',
		name: 'Nederlands',
		localName: t('locale.dutch', 'Dutch'),
		label: t('locale.label_dutch', { value: 'Nederlands', defaultValue: 'Dutch - {{value}}' }),
		value: 'nl'
	},
	{
		id: 'en',
		name: 'English',
		localName: t('locale.English', 'English'),
		label: t('locale.label_english', { value: 'English', defaultValue: 'English - {{value}}' }),
		value: 'en'
	},
	{
		id: 'de',
		name: 'Deutsch',
		localName: t('locale.german', 'German'),
		label: t('locale.label_german', { value: 'Deutsch', defaultValue: 'German - {{value}}' }),
		value: 'de'
	},
	{
		id: 'hi',
		name: 'हिंदी',
		localName: t('locale.hindi', 'Hindi'),
		label: t('locale.label_hindi', { value: 'हिंदी', defaultValue: 'Hindi - {{value}}' }),
		value: 'hi'
	},
	{
		id: 'it',
		name: 'italiano',
		localName: t('locale.italian', 'Italian'),
		label: t('locale.label_italian', { value: 'italiano', defaultValue: 'Italian - {{value}}' }),
		value: 'it'
	},
	{
		id: 'ja',
		name: '日本語',
		localName: t('locale.japanese', 'Japanese'),
		label: t('locale.label_japanese', { value: '日本語', defaultValue: 'Japanese - {{value}}' }),
		value: 'ja'
	},

	{
		id: 'pt',
		name: 'português',
		localName: t('locale.portuguese', 'Portuguese'),
		label: t('locale.label_portuguese', {
			value: 'português',
			defaultValue: 'Portuguese - {{value}}'
		}),
		value: 'pt'
	},
	{
		id: 'pt_BR',
		name: 'português (Brasil)',
		localName: t('locale.portuguese_brazil', 'Portuguese (Brazil)'),
		label: t('locale.label_portuguese_brazil', {
			value: 'português (Brasil)',
			defaultValue: 'Portuguese - {{value}}'
		}),
		value: 'pt_BR'
	},

	{
		id: 'ro',
		name: 'română',
		localName: t('locale.romanian', 'Romanian'),
		label: t('locale.label_romanian', { value: 'română', defaultValue: 'Romanian - {{value}}' }),
		value: 'ro'
	},
	{
		id: 'ru',
		name: 'русский',
		localName: t('locale.russian', 'Russian'),
		label: t('locale.label_russian', { value: 'русский', defaultValue: 'Russian - {{value}}' }),
		value: 'ru'
	},

	{
		id: 'es',
		name: 'español',
		localName: t('locale.spanish', 'Spanish'),
		label: t('locale.label_spanish', { value: 'español', defaultValue: 'Spanish - {{value}}' }),
		value: 'es'
	},

	{
		id: 'th',
		name: 'ไทย',
		localName: t('locale.thai', 'Thai'),
		label: t('locale.label_thai', { value: 'ไทย', defaultValue: 'Thai - {{value}}' }),
		value: 'th'
	},
	{
		id: 'tr',
		name: 'Türkçe',
		localName: t('locale.turkish', 'Turkish'),
		label: t('locale.label_turkish', { value: 'Türkçe', defaultValue: 'Turkish - {{value}}' }),
		value: 'tr'
	},
	{
		id: 'fr',
		name: 'français',
		localName: t('locale.french', 'French'),
		label: t('locale.label_french', { value: 'français', defaultValue: 'French - {{value}}' }),
		value: 'fr'
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
// 		id: 'pl',
// 		name: 'polski',
// 		localName: t('locale.polish', 'Polish'),
// 		label: 'Polish - polski',
// 		value: 'pl'
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
// 	{
// 		id: 'vi',
// 		name: 'Tiếng Việt',
// 		localName: t('locale.vietnamese', 'Vietnamese'),
// 		label: 'Vietnamese - Tiếng Việt',
// 		value: 'vi'
// 	}
// ];

export const timeZoneList = (
	t: TFunction
): Array<{ value?: string; label: string; offSet?: string }> => [
	{
		value: 'Etc/GMT+12',
		label: t('timezone.dateline', { value: 'GMT -12:00 ', defaultValue: '{{value}} Dateline' })
	},
	{
		value: 'Pacific/Midway',
		label: t('timezone.samoa', { value: 'GMT -11:00', defaultValue: '{{value}} Samoa' })
	},
	{
		value: 'Etc/GMT+11',
		label: t('timezone.gmt_11', { value: 'GMT -11:00', defaultValue: '{{value}} GMT-11' })
	},
	{
		value: 'Pacific/Honolulu',
		label: t('timezone.hawaii', { value: 'GMT -10:00', defaultValue: '{{value}} Hawaii' })
	},
	{
		value: 'America/Anchorage',
		label: t('timezone.alaska', { value: 'GMT -09:00', defaultValue: '{{value}} Alaska' })
	},
	{
		value: 'America/Los_Angeles',
		label: t('timezone.us_canada_pacific', {
			value: 'GMT -08:00',
			defaultValue: '{{value}} US/Canada Pacific'
		})
	},
	{
		value: 'America/Tijuana',
		label: t('timezone.baja_california', {
			value: 'GMT -08:00',
			defaultValue: '{{value}} Baja California'
		})
	},
	{
		value: 'America/Denver',
		label: t('timezone.us_canada_mountain', {
			value: 'GMT -07:00',
			defaultValue: '{{value}} US/Canada Mountain'
		})
	},
	{
		value: 'America/Chihuahua',
		label: t('timezone.chihuahua_la_paz_mazatlan', {
			value: 'GMT -07:00',
			defaultValue: '{{value}} Chihuahua, La Paz, Mazatlan'
		})
	},
	{
		value: 'America/Phoenix',
		label: t('timezone.arizona', { value: 'GMT -07:00', defaultValue: '{{value}} Arizona' })
	},
	{
		value: 'America/Chicago',
		label: t('timezone.us_canada_central', {
			value: 'GMT -06:00',
			defaultValue: '{{value}} US/Canada Central'
		})
	},
	{
		value: 'America/Regina',
		label: t('timezone.saskatchewan', {
			value: 'GMT -06:00',
			defaultValue: '{{value}} Saskatchewan'
		})
	},
	{
		value: 'America/Mexico_City',
		label: t('timezone.guadalajara_mexico_city_monterrey ', {
			value: 'GMT -06:00 ',
			defaultValue: '{{value}} Guadalajara, Mexico City, Monterrey '
		})
	},
	{
		value: 'America/Guatemala',
		label: t('timezone.central_america', {
			value: 'GMT -06:00',
			defaultValue: '{{value}} Central America'
		})
	},
	{
		value: 'America/New_York',
		label: t('timezone.us_canada_eastern', {
			value: 'GMT -05:00',
			defaultValue: '{{value}} US/Canada Eastern'
		})
	},
	{
		value: 'America/Indiana/Indianapolis',
		label: t('timezone.indiana_east', {
			value: 'GMT -05:00',
			defaultValue: '{{value}} Indiana (East)'
		})
	},
	{
		value: 'America/Bogota',
		label: t('timezone.colombia', { value: 'GMT -05:00', defaultValue: '{{value}} Colombia' })
	},
	{
		value: 'America/Caracas',
		label: t('timezone.caracas', { value: 'GMT -04:30', defaultValue: '{{value}} Caracas' })
	},
	{
		value: 'America/Santiago',
		label: t('timezone.pacific_south_america', {
			value: 'GMT -04:00',
			defaultValue: '{{value}} Pacific South America'
		})
	},
	{
		value: 'America/Manaus',
		label: t('timezone.manaus', { value: 'GMT -04:00', defaultValue: '{{value}} Manaus' })
	},
	{
		value: 'America/La_Paz',
		label: t('timezone.la_paz', { value: 'GMT -04:00', defaultValue: '{{value}} La Paz' })
	},
	{
		value: 'America/Guyana',
		label: t('timezone.georgetown_la_paz_manaus_san_juan', {
			value: 'GMT -04:00',
			defaultValue: '{{value}} Georgetown, La Paz, Manaus, San Juan'
		})
	},
	{
		value: 'America/Cuiaba',
		label: t('timezone.cuiaba', { value: 'GMT -04:00', defaultValue: '{{value}} Cuiaba' })
	},
	{
		value: 'America/Halifax',
		label: t('timezone.atlantic_time_canada', {
			value: 'GMT -04:00',
			defaultValue: '{{value}} Atlantic Time (Canada)'
		})
	},
	{
		value: 'America/Asuncion',
		label: t('timezone.asuncion', { value: 'GMT -04:00 ', defaultValue: '{{value}} Asuncion' })
	},
	{
		value: 'America/St_Johns',
		label: t('timezone.newfoundland', {
			value: 'GMT -03:30',
			defaultValue: '{{value}} Newfoundland'
		})
	},
	{
		value: 'America/Montevideo',
		label: t('timezone.montevideo', { value: 'GMT -03:00', defaultValue: '{{value}} Montevideo' })
	},
	{
		value: 'America/Godthab',
		label: t('timezone.greenland', { value: 'GMT -03:00', defaultValue: '{{value}} Greenland' })
	},
	{
		value: 'America/Cayenne',
		label: t('timezone.cayenne_fortaleza', {
			value: 'GMT -03:00',
			defaultValue: '{{value}} Cayenne, Fortaleza'
		})
	},
	{
		value: 'America/Sao_Paulo',
		label: t('timezone.brasilia', { value: 'GMT -03:00', defaultValue: '{{value}} Brasilia' })
	},
	{
		value: 'America/Argentina/Buenos_Aires',
		label: t('timezone.argentina', { value: 'GMT -03:00', defaultValue: '{{value}} Argentina' })
	},
	{
		value: 'Atlantic/South_Georgia',
		label: t('timezone.mid_atlantic', {
			value: 'GMT -02:00',
			defaultValue: '{{value}} Mid-Atlantic'
		})
	},
	{
		value: 'Etc/GMT+2',
		label: t('timezone.gmt_02', { value: 'GMT -02:00', defaultValue: '{{value}} GMT-02' })
	},
	{
		value: 'Atlantic/Cape_Verde',
		label: t('timezone.cape_verde_is', {
			value: 'GMT -01:00',
			defaultValue: '{{value}} Cape Verde Is.'
		})
	},
	{
		value: 'Atlantic/Azores',
		label: t('timezone.azores', { value: 'GMT -01:00', defaultValue: '{{value}} Azores' })
	},
	{
		value: 'UTC',
		label: t('timezone.coordinated_universal_time', {
			value: 'GMT/UTC',
			defaultValue: '{{value}} Coordinated Universal Time'
		})
	},
	{
		value: 'Europe/London',
		label: t('timezone.britain_ireland_portugal', {
			value: 'GMT +00:00',
			defaultValue: '{{value}} Britain, Ireland, Portugal'
		})
	},
	{
		value: 'Africa/Casablanca',
		label: t('timezone.casablanca', { value: 'GMT +00:00', defaultValue: '{{value}} Casablanca' })
	},
	{
		value: 'Africa/Monrovia',
		label: t('timezone.monrovia', { value: 'GMT +00:00', defaultValue: '{{value}} Monrovia' })
	},
	{
		value: 'Europe/Berlin',
		label: t('timezone.amsterdam_berlin_bern_rome_stockholm_vienna', {
			value: 'GMT +01:00',
			defaultValue: '{{value}} Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna'
		})
	},
	{
		value: 'Europe/Belgrade',
		label: t('timezone.belgrade_bratislava_budapest_ljubljana_prague', {
			value: 'GMT +01:00',
			defaultValue: '{{value}} Belgrade, Bratislava, Budapest, Ljubljana, Prague'
		})
	},
	{
		value: 'Europe/Brussels',
		label: t('timezone.brussels_copenhagen_madrid_paris ', {
			value: 'GMT +01:00 ',
			defaultValue: '{{value}} Brussels, Copenhagen, Madrid, Paris '
		})
	},
	{
		value: 'Africa/Windhoek',
		label: t('timezone.namibia', { value: 'GMT +01:00', defaultValue: '{{value}} Namibia' })
	},
	{
		value: 'Europe/Warsaw',
		label: t('timezone.sarajevo_skopje_warsaw_zagreb', {
			value: 'GMT +01:00',
			defaultValue: '{{value}} Sarajevo, Skopje, Warsaw, Zagreb'
		})
	},
	{
		value: 'Africa/Algiers',
		label: t('timezone.west_central_africa', {
			value: 'GMT +01:00',
			defaultValue: '{{value}} West Central Africa'
		})
	},
	{
		value: 'Europe/Athens',
		label: t('timezone.athens_beirut_bucharest_istanbul', {
			value: 'GMT +02:00',
			defaultValue: '{{value}} Athens, Beirut, Bucharest, Istanbul'
		})
	},
	{
		value: 'Asia/Beirut',
		label: t('timezone.beirut', { value: 'GMT +02:00', defaultValue: '{{value}} Beirut' })
	},
	{
		value: 'Asia/Damascus',
		label: t('timezone.damascus', { value: 'GMT +02:00', defaultValue: '{{value}} Damascus' })
	},
	{
		value: 'Africa/Cairo',
		label: t('timezone.egypt', { value: 'GMT +02:00', defaultValue: '{{value}} Egypt' })
	},
	{
		value: 'Africa/Harare',
		label: t('timezone.harare_pretoria', {
			value: 'GMT +02:00',
			defaultValue: '{{value}} Harare, Pretoria'
		})
	},
	{
		value: 'Europe/Helsinki',
		label: t('timezone.helsinki_kyiv_riga_sofia_tallinn_vilnius', {
			value: 'GMT +02:00',
			defaultValue: '{{value}} Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius'
		})
	},
	{
		value: 'Europe/Istanbul',
		label: t('timezone.istanbul', { value: 'GMT +02:00', defaultValue: '{{value}} Istanbul' })
	},
	{
		value: 'Asia/Jerusalem',
		label: t('timezone.jerusalem', { value: 'GMT +02:00', defaultValue: '{{value}} Jerusalem' })
	},
	{
		value: 'Asia/Amman',
		label: t('timezone.jordan', { value: 'GMT +02:00', defaultValue: '{{value}} Jordan' })
	},
	{
		value: 'Europe/Kaliningrad',
		label: t('timezone.kaliningrad_rtz_1', {
			value: 'GMT +02:00',
			defaultValue: '{{value}} Kaliningrad (RTZ 1)'
		})
	},
	{
		value: 'Asia/Baghdad',
		label: t('timezone.iraq', { value: 'GMT +03:00', defaultValue: '{{value}} Iraq' })
	},
	{
		value: 'Asia/Kuwait',
		label: t('timezone.kuwait_riyadh', {
			value: 'GMT +03:00',
			defaultValue: '{{value}} Kuwait, Riyadh'
		})
	},
	{
		value: 'Europe/Minsk',
		label: t('timezone.minsk', { value: 'GMT +03:00', defaultValue: '{{value}} Minsk' })
	},
	{
		value: 'Europe/Moscow',
		label: t('timezone.moscow_st_petersburg_volgograd_rtz_2', {
			value: 'GMT +03:00',
			defaultValue: '{{value}} Moscow, St. Petersburg, Volgograd (RTZ 2)'
		})
	},
	{
		value: 'Africa/Nairobi',
		label: t('timezone.nairobi', { value: 'GMT +03:00', defaultValue: '{{value}} Nairobi' })
	},
	{
		value: 'Asia/Tehran',
		label: t('timezone.tehran', { value: 'GMT +03:30', defaultValue: '{{value}} Tehran' })
	},
	{
		value: 'Asia/Muscat',
		label: t('timezone.abu_dhabi_muscat', {
			value: 'GMT +04:00',
			defaultValue: '{{value}} Abu Dhabi, Muscat'
		})
	},
	{
		value: 'Asia/Baku',
		label: t('timezone.baku', { value: 'GMT +04:00', defaultValue: '{{value}} Baku' })
	},
	{
		value: 'Indian/Mauritius',
		label: t('timezone.port_louis', { value: 'GMT +04:00', defaultValue: '{{value}} Port Louis' })
	},
	{
		value: 'Asia/Tbilisi',
		label: t('timezone.tbilisi', { value: 'GMT +04:00', defaultValue: '{{value}} Tbilisi' })
	},
	{
		value: 'Asia/Yerevan',
		label: t('timezone.yerevan', { value: 'GMT +04:00', defaultValue: '{{value}} Yerevan' })
	},
	{
		value: 'Asia/Kabul',
		label: t('timezone.kabul', { value: 'GMT +04:30', defaultValue: '{{value}} Kabul' })
	},
	{
		value: 'Asia/Yekaterinburg',
		label: t('timezone.ekaterinburg_rtz_4', {
			value: 'GMT +05:00',
			defaultValue: '{{value}} Ekaterinburg (RTZ 4)'
		})
	},
	{
		value: 'Asia/Colombo',
		label: t('timezone.sri_jayawardenepura_kotte', {
			value: 'GMT +05:30',
			defaultValue: '{{value}} Sri Jayawardenepura Kotte'
		})
	},
	{
		value: 'Asia/Kolkata',
		label: t('timezone.chennai_kolkata_mumbai_new_delhi', {
			value: 'GMT +05:30',
			defaultValue: '{{value}} Chennai, Kolkata, Mumbai, New Delhi'
		})
	},
	{
		value: 'Asia/Kathmandu',
		label: t('timezone.kathmandu', { value: 'GMT +05:45', defaultValue: '{{value}} Kathmandu' })
	},
	{
		value: 'Asia/Dhaka',
		label: t('timezone.dhaka', { value: 'GMT +06:00', defaultValue: '{{value}} Dhaka' })
	},
	{
		value: 'Asia/Yangon',
		label: t('timezone.yangon', { value: 'GMT +06:30 ', defaultValue: '{{value}} Yangon' })
	},
	{
		value: 'Asia/Bangkok',
		label: t('timezone.bangkok_hanoi_jakarta', {
			value: 'GMT +07:00',
			defaultValue: '{{value}} Bangkok, Hanoi, Jakarta'
		})
	},
	{
		value: 'Asia/Krasnoyarsk',
		label: t('timezone.krasnoyarsk_rtz_6', {
			value: 'GMT +07:00',
			defaultValue: '{{value}} Krasnoyarsk (RTZ 6)'
		})
	},
	{
		value: 'Asia/Hong_Kong',
		label: t('timezone.beijing_chongqing_hong_kong_urumqi', {
			value: 'GMT +08:00',
			defaultValue: '{{value}} Beijing, Chongqing, Hong Kong, Urumqi'
		})
	},
	{
		value: 'Asia/Irkutsk',
		label: t('timezone.irkutsk_rtz_7', {
			value: 'GMT +08:00',
			defaultValue: '{{value}} Irkutsk (RTZ 7)'
		})
	},
	{
		value: 'Australia/Eucla',
		label: t('timezone.eucla', { value: 'GMT +08:45', defaultValue: '{{value}} Eucla' })
	},
	{
		value: 'Asia/Chita',
		label: t('timezone.chita', { value: 'GMT +09:00', defaultValue: '{{value}} Chita' })
	},
	{
		value: 'Asia/Pyongyang',
		label: t('timezone.pyongyang', { value: 'GMT +08:30 ', defaultValue: '{{value}} Pyongyang' })
	},
	{
		value: 'Asia/Seoul',
		label: t('timezone.korea', { value: 'GMT +09:00 ', defaultValue: '{{value}} Korea' })
	},
	{
		value: 'Australia/Darwin',
		label: t('timezone.darwin', { value: 'GMT +09:30', defaultValue: '{{value}} Darwin' })
	},
	{
		value: 'Asia/Vladivostok',
		label: t('timezone.vladivostok_magadan', {
			value: 'GMT +10:00',
			defaultValue: '{{value}} vladivostok_magadan_rtz_9'
		})
	},
	{
		value: 'Asia/Magadan',
		label: t('timezone.magadan', { value: 'GMT +11:00', defaultValue: '{{value}} Magadan' })
	},
	{
		value: 'Asia/Kamchatka',
		label: t('timezone.anadyr_petropavlovsk_kamchatsky_rtz11', {
			value: 'GMT +12:00',
			defaultValue: '{{value}} Anadyr, Petropavlovsk-Kamchatsky (RTZ 11)'
		})
	},
	{
		value: 'Pacific/Tongatapu',
		label: t('timezone.nuku_alofa', { value: 'GMT +13:00', defaultValue: '{{value}} Nuku’alofa' })
	},
	{
		value: 'Pacific/Kiritimati',
		label: t('timezone.christmas_island', {
			value: 'GMT +14:00',
			defaultValue: '{{value}} Christmas Island'
		})
	}
];
