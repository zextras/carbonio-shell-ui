/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useCallback, useMemo, useState } from 'react';

import type { SelectItem, SingleSelectionOnChange } from '@zextras/carbonio-design-system';
import { Container, FormSubSection, Modal, Select, Text } from '@zextras/carbonio-design-system';
import { find } from 'lodash';

import type { SettingsSectionProps } from './components/utils';
import { localeList, timeZoneList, upsertPrefOnUnsavedChanges } from './components/utils';
import { timezoneAndLanguageSubSection } from './general-settings-sub-sections';
import { useReset } from './hooks/use-reset';
import { getT } from '../store/i18n';
import type { AccountSettings } from '../types/account';
import type { AddMod } from '../types/network';

interface LanguageAndTimeZoneSettingsProps extends SettingsSectionProps {
	settings: AccountSettings;
	addMod: AddMod;
	open: boolean;
	setOpen: (arg: boolean) => void;
}

export const LanguageAndTimeZoneSettings = ({
	settings,
	addMod,
	open,
	setOpen,
	resetRef
}: LanguageAndTimeZoneSettingsProps): React.JSX.Element => {
	const t = getT();
	const locales = useMemo(() => localeList(t), [t]);
	const timezones = useMemo(() => timeZoneList(t), [t]);
	const sectionTitle = useMemo(() => timezoneAndLanguageSubSection(t), [t]);

	const updatePref = useMemo(() => upsertPrefOnUnsavedChanges(addMod), [addMod]);

	const [prefLocale, setPrefLocale] = useState<string>(settings.prefs.zimbraPrefLocale ?? '');

	// TODO update with SHELL-181
	const prefLocaleSelectedValue = useMemo<SelectItem>(
		() => find(locales, (item) => item.value === prefLocale) as SelectItem,
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

	const [prefTimeZoneId, setPrefTimeZoneId] = useState<string>(
		settings.prefs.zimbraPrefTimeZoneId ?? ''
	);

	// TODO update with SHELL-181
	const prefTimeZoneIdSelectedValue = useMemo<SelectItem>(
		() => find(timezones, (item) => item.value === prefTimeZoneId) as SelectItem,
		[timezones, prefTimeZoneId]
	);

	const onTimeZoneChange = useCallback<SingleSelectionOnChange>(
		(value) => {
			if (value) {
				updatePref('zimbraPrefTimeZoneId', value);
				setPrefTimeZoneId(value);
			}
		},
		[updatePref]
	);

	const init = useCallback(() => {
		setPrefLocale(settings.prefs.zimbraPrefLocale ?? '');
		setPrefTimeZoneId(settings.prefs.zimbraPrefTimeZoneId ?? '');
	}, [settings.prefs.zimbraPrefLocale, settings.prefs.zimbraPrefTimeZoneId]);

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
				<Select
					items={timezones}
					background={'gray5'}
					label={t('label.time_zone', 'Time Zone')}
					onChange={onTimeZoneChange}
					selection={prefTimeZoneIdSelectedValue}
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
