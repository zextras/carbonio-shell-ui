/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useCallback, useMemo, useState } from 'react';

import type { SelectItem, SingleSelectionOnChange } from '@zextras/carbonio-design-system';
import { FormSubSection, FormSection, Modal, Text } from '@zextras/carbonio-design-system';
import { useTranslation } from 'react-i18next';

import { SelectWithError } from './components/select-with-error';
import type { SettingsSectionProps } from './components/utils';
import { upsertPrefOnUnsavedChanges } from './components/utils';
import { languageSubSection } from './general-settings-sub-sections';
import { useReset } from './hooks/use-reset';
import { localeList } from '../constants/locales';
import type { AccountSettings } from '../types/account';
import type { AddMod } from '../types/network';

interface LanguageSettingsProps extends SettingsSectionProps {
	settings: AccountSettings;
	addMod: AddMod;
	open: boolean;
	setOpen: (arg: boolean) => void;
	invalidOption: SelectItem;
}

export const LanguageSettings = ({
	settings,
	addMod,
	open,
	setOpen,
	invalidOption,
	resetRef
}: LanguageSettingsProps): React.JSX.Element => {
	const [t] = useTranslation();
	const locales = useMemo(() => localeList(t), [t]);
	const sectionTitle = useMemo(() => languageSubSection(t), [t]);

	const updatePref = useMemo(() => upsertPrefOnUnsavedChanges(addMod), [addMod]);

	const [prefLocale, setPrefLocale] = useState<string>(settings.prefs.zimbraPrefLocale ?? '');

	const prefLocaleSelectedValue = useMemo<SelectItem>(() => {
		const foundLocale = locales.find((item) => item.value === prefLocale);

		if (!foundLocale) {
			return invalidOption;
		}

		return foundLocale;
	}, [invalidOption, locales, prefLocale]);

	const onLocaleChange = useCallback<SingleSelectionOnChange>(
		(value) => {
			if (value) {
				updatePref('zimbraPrefLocale', value);
				setPrefLocale(value);
			}
		},
		[updatePref]
	);

	const init = useCallback(() => {
		setPrefLocale(settings.prefs.zimbraPrefLocale ?? '');
	}, [settings.prefs.zimbraPrefLocale]);

	useReset(resetRef, init);

	const isInvalidLocale = useMemo(
		() => !locales.some((item) => item.value === prefLocale),
		[locales, prefLocale]
	);

	return (
		<FormSection label={sectionTitle.label} id={sectionTitle.id}>
			<FormSubSection>
				<SelectWithError
					items={locales}
					selectLabel={t('label.language', 'Language')}
					onChange={onLocaleChange}
					selection={prefLocaleSelectedValue}
					hasError={isInvalidLocale}
					errorMessage={t(
						'settings.general.language_error',
						'The current value is not recognized. The interface has defaulted to English. Please select a valid option.'
					)}
				/>
				<Modal
					title={t('label.reload', 'Reload')}
					open={open}
					dismissLabel={t('label.no', 'No')}
					onConfirm={(): void => window.location.reload()}
					confirmLabel={t('label.reload', 'Reload')}
					onClose={(): void => setOpen(false)}
				>
					<Text overflow="break-word">
						{t(
							'message.reload',
							`	Would you like to reload the application now to show the new language?
							(Otherwise, the new language will appear the next time you sign in.)`
						)}
					</Text>
				</Modal>
			</FormSubSection>
		</FormSection>
	);
};
