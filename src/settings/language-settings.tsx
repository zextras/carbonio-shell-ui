/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useCallback, useMemo, useState } from 'react';

import type { SelectItem, SingleSelectionOnChange } from '@zextras/carbonio-design-system';
import { Container, FormSubSection, Modal, Select, Text } from '@zextras/carbonio-design-system';

import type { SettingsSectionProps } from './components/utils';
import { localeList, upsertPrefOnUnsavedChanges } from './components/utils';
import { languageSubSection } from './general-settings-sub-sections';
import { useReset } from './hooks/use-reset';
import { getT } from '../store/i18n/hooks';
import type { AccountSettings } from '../types/account';
import type { AddMod } from '../types/network';

interface LanguageSettingsProps extends SettingsSectionProps {
	settings: AccountSettings;
	addMod: AddMod;
	open: boolean;
	setOpen: (arg: boolean) => void;
}

export const LanguageSettings = ({
	settings,
	addMod,
	open,
	setOpen,
	resetRef
}: LanguageSettingsProps): React.JSX.Element => {
	const t = getT();
	const locales = useMemo(() => localeList(t), [t]);
	const sectionTitle = useMemo(() => languageSubSection(t), [t]);

	const updatePref = useMemo(() => upsertPrefOnUnsavedChanges(addMod), [addMod]);

	const [prefLocale, setPrefLocale] = useState<string>(settings.prefs.zimbraPrefLocale ?? '');

	// TODO update with SHELL-181
	const prefLocaleSelectedValue = useMemo<SelectItem>(
		() => locales.find((item) => item.value === prefLocale) as SelectItem,
		[locales, prefLocale]
	);

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

	return (
		<FormSubSection
			label={sectionTitle.label}
			minWidth="calc(min(100%, 32rem))"
			width="50%"
			id={sectionTitle.id}
		>
			<Container crossAlignment="baseline" padding={{ all: 'small' }} gap={'0.5rem'}>
				<Select
					items={locales}
					background={'gray5'}
					label={t('label.language', 'Language')}
					onChange={onLocaleChange}
					selection={prefLocaleSelectedValue}
					showCheckbox={false}
					dropdownMaxHeight="12.5rem"
					selectedBackgroundColor="highlight"
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
			</Container>
		</FormSubSection>
	);
};
