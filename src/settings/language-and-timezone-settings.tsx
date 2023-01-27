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
	Text
} from '@zextras/carbonio-design-system';
import React, { FC, useCallback, useMemo } from 'react';

import { find } from 'lodash';
import momentLocalizer from 'react-widgets-moment';
import { AccountSettings, AddMod, PrefsMods } from '../../types';
import { getT } from '../store/i18n';
import { localeList, timeZoneList } from './components/utils';
import { timezoneAndLanguageSubSection } from './general-settings-sub-sections';

momentLocalizer();

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

	const defaultLocale = useMemo(() => {
		const localeId = (settings.prefs.zimbraPrefLocale as string) ?? 'en';
		const locale = find(locales, { id: localeId });
		return locale ?? find(locales, { id: 'en' });
	}, [locales, settings.prefs.zimbraPrefLocale]);

	const defaultTimeZone = useMemo(() => {
		const timeZoneId = (settings.prefs.zimbraPrefTimeZoneId as string) ?? 'UTC';
		const timezone = find(timezones, { value: timeZoneId });
		return timezone ?? find(timezones, { value: 'UTC' });
	}, [timezones, settings.prefs.zimbraPrefTimeZoneId]);

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
						background="gray5"
						label={t('label.language', 'Language')}
						onChange={(value: any): void => {
							if (value && value !== settings.prefs.zimbraPrefLocale)
								updatePrefs(value, 'zimbraPrefLocale');
						}}
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
							background="gray5"
							label={t('label.time_zone', 'Time Zone')}
							onChange={(value: any): void => {
								if (value && value !== settings.prefs.zimbraPrefTimeZoneId)
									updatePrefs(value, 'zimbraPrefTimeZoneId');
							}}
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
