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

// eslint-disable-next-line import/no-extraneous-dependencies
import { find } from 'lodash';
import momentLocalizer from 'react-widgets-moment';
import { AccountSettings } from '../../types';
import { getT } from '../store/i18n';
import { localeList, timeZoneList } from './components/utils';
import { timezoneAndLanguageSubSection } from './general-settings-sub-sections';

momentLocalizer();

const LanguageAndTimeZone: FC<{
	settings: AccountSettings;
	open: boolean;
	setOpen: (arg: boolean) => any;
	addMod: (type: 'prefs' | 'props', key: string, value: { value: any; app: string }) => void;
}> = ({ settings, addMod, open, setOpen }) => {
	const t = getT();
	const locales = localeList(t);
	const timezones = timeZoneList(t);

	const updatePrefs = useCallback(
		(v, p) => {
			addMod('prefs', p, v);
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

	const sectionTitle = timezoneAndLanguageSubSection(t);
	return (
		<FormSubSection
			label={sectionTitle.label}
			minWidth="calc(min(100%, 512px))"
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
						dropdownMaxHeight="200px"
						selectedBackgroundColor="highlight"
					/>
				)}
				<Padding top="small" width="100%">
					{Object.keys(settings.prefs).length > 0 && timezones && (
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
							dropdownMaxHeight="200px"
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
