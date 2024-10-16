/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { useMemo } from 'react';

import type { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';

import { useIsCarbonioCE } from '../store/login/hooks';
import type { SettingsSubSection } from '../types/apps';

export const appearanceSubSection = (t: TFunction): SettingsSubSection => ({
	label: t('settings.general.appearance', 'Appearance'),
	id: 'appearance'
});
export const languageSubSection = (t: TFunction): SettingsSubSection => ({
	label: t('settings.timezone_and_language', 'Language'),
	id: 'language'
});
export const outOfOfficeSubSection = (t: TFunction): SettingsSubSection => ({
	label: t('settings.out_of_office.headings.settings_label', 'Out of Office Settings'),
	id: 'out_of_office'
});
export const searchPrefsSubSection = (t: TFunction): SettingsSubSection => ({
	label: t('search.app', 'Search'),
	id: 'search_prefs'
});
export const quotaSubSection = (t: TFunction): SettingsSubSection => ({
	label: t('user_quota.title', "User's quota"),
	id: 'user_quota'
});

export const privacySubSection = (t: TFunction): SettingsSubSection => ({
	label: t('settings.general.privacy', 'Privacy'),
	id: 'privacy-settings'
});

export const useSettingsSubSections = (): SettingsSubSection[] => {
	const [t] = useTranslation();
	const isCarbonioCE = useIsCarbonioCE();

	return useMemo(() => {
		const subSections = [
			appearanceSubSection(t),
			languageSubSection(t),
			outOfOfficeSubSection(t),
			searchPrefsSubSection(t),
			quotaSubSection(t)
		];

		if (isCarbonioCE) {
			subSections.push(privacySubSection(t));
		}

		return subSections;
	}, [isCarbonioCE, t]);
};
