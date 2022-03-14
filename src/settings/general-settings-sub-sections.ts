/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { TFunction } from 'react-i18next';
import { SettingsSubSection } from '../../types';

export const themeSubSection = (t: TFunction): SettingsSubSection => ({
	label: t('settings.general.theme_options', 'Theme Options'),
	id: ''
});
export const timezoneAndLanguageSubSection = (t: TFunction): SettingsSubSection => ({
	label: t('settings.timezone_and_language', 'Time Zone and Language'),
	id: 'timezone_and_language'
});
export const outOfOfficeSubSection = (t: TFunction): SettingsSubSection => ({
	label: t('settings.out_of_office.headings.settings_label', 'Out of Office Settings'),
	id: 'out_of_office'
});
export const searchPrefsSubSection = (t: TFunction): SettingsSubSection => ({
	label: t('search.app', 'Search'),
	id: 'search_prefs'
});
export const versionsSubSection = (t: TFunction): SettingsSubSection => ({
	label: t('module.app.version', 'Application versions'),
	id: 'app_version'
});
export const quotaSubSection = (t: TFunction): SettingsSubSection => ({
	label: t('user_quota.title', "User's quota"),
	id: 'user_quota'
});
export const accountSubSection = (t: TFunction): SettingsSubSection => ({
	label: t('settings.general.account', 'Account'),
	id: 'account'
});

export const settingsSubSections = (t: TFunction): Array<SettingsSubSection> => [
	timezoneAndLanguageSubSection(t),
	outOfOfficeSubSection(t),
	searchPrefsSubSection(t),
	versionsSubSection(t),
	quotaSubSection(t),
	accountSubSection(t)
];
