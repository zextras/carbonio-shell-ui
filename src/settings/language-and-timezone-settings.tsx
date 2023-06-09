/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
	Container,
	FormSubSection,
	Modal,
	Padding,
	Select,
	SingleSelectionOnChange,
	Text
} from '@zextras/carbonio-design-system';
import React, { FC, useCallback, useMemo } from 'react';

import { find } from 'lodash';
import { AccountSettings, AddMod, PrefsMods } from '../../types';
import { getT } from '../store/i18n';
import { localeList, timeZoneList } from './components/utils';
import { timezoneAndLanguageSubSection } from './general-settings-sub-sections';

const LanguageAndTimeZone: FC<{
	settings: AccountSettings;
	open: boolean;
	setOpen: (arg: boolean) => void;
	addMod: AddMod;
}> = ({ settings, addMod, open, setOpen }) => {
	const t = getT();
	const locales = useMemo(() => localeList(t), [t]);
	const timezones = useMemo(() => timeZoneList(t), [t]);
	const sectionTitle = useMemo(() => timezoneAndLanguageSubSection(t), [t]);

	const updatePrefs = useCallback(
		(prefValue: PrefsMods[keyof PrefsMods], prefKey: keyof PrefsMods) => {
			addMod('prefs', prefKey, prefValue);
		},
		[addMod]
	);

	const defaultLocale = useMemo(
		() =>
			(settings.prefs.zimbraPrefLocale &&
				find(locales, { id: `${settings.prefs.zimbraPrefLocale}` })) ||
			find(locales, { id: 'en' }),
		[locales, settings.prefs.zimbraPrefLocale]
	);

	const onLocaleChange = useCallback<SingleSelectionOnChange>(
		(value) => {
			if (value && value !== settings.prefs.zimbraPrefLocale)
				updatePrefs(value, 'zimbraPrefLocale');
		},
		[settings.prefs.zimbraPrefLocale, updatePrefs]
	);

	const defaultTimeZone = useMemo(
		() =>
			(settings.prefs.zimbraPrefTimeZoneId &&
				find(timezones, { value: `${settings.prefs.zimbraPrefTimeZoneId}` })) ||
			find(timezones, { value: 'UTC' }),
		[timezones, settings.prefs.zimbraPrefTimeZoneId]
	);

	const onTimeZoneChange = useCallback<SingleSelectionOnChange>(
		(value) => {
			if (value && value !== settings.prefs.zimbraPrefTimeZoneId)
				updatePrefs(value, 'zimbraPrefTimeZoneId');
		},
		[settings.prefs.zimbraPrefTimeZoneId, updatePrefs]
	);

	return (
		<FormSubSection
			label={sectionTitle.label}
			minWidth="calc(min(100%, 32rem))"
			width="50%"
			id={sectionTitle.id}
		>
			<Container crossAlignment="baseline" padding={{ all: 'small' }}>
				{Object.keys(settings.prefs).length > 0 && (
					<Select
						items={locales}
						background={'gray5'}
						label={t('label.language', 'Language')}
						onChange={onLocaleChange}
						defaultSelection={defaultLocale}
						showCheckbox={false}
						dropdownMaxHeight="12.5rem"
						selectedBackgroundColor="highlight"
					/>
				)}
				<Padding top="small" width="100%">
					{Object.keys(settings.prefs).length > 0 && timezones && defaultTimeZone && (
						<Select
							items={timezones}
							background={'gray5'}
							label={t('label.time_zone', 'Time Zone')}
							onChange={onTimeZoneChange}
							selection={defaultTimeZone}
							showCheckbox={false}
							dropdownMaxHeight="12.5rem"
							selectedBackgroundColor="highlight"
						/>
					)}
				</Padding>
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

export default LanguageAndTimeZone;
