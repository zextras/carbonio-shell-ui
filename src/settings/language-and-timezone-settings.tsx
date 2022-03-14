/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useCallback, FC, useMemo } from 'react';
import {
	Container,
	FormSubSection,
	Modal,
	Select,
	Text,
	Padding
} from '@zextras/carbonio-design-system';

// eslint-disable-next-line import/no-extraneous-dependencies
import momentLocalizer from 'react-widgets-moment';
import { useTranslation } from 'react-i18next';
import { find } from 'lodash';
import { AccountSettings } from '../../types';
import { localeList, timeZoneList } from './components/utils';
import { timezoneAndLanguageSubSection } from './general-settings-sub-sections';

momentLocalizer();

const LanguageAndTimeZone: FC<{
	settings: AccountSettings;
	open: boolean;
	setOpen: (arg: boolean) => any;
	addMod: (type: 'prefs' | 'props', key: string, value: { value: any; app: string }) => void;
}> = ({ settings, addMod, open, setOpen }) => {
	const { t } = useTranslation();
	const locales = useMemo(() => localeList(t), [t]);
	const timezones = useMemo(() => timeZoneList(t), [t]);
	const updatePrefs = useCallback(
		(v, p) => {
			addMod('prefs', p, v);
		},
		[addMod]
	);

	const defaultSelection = useMemo(
		() =>
			settings.prefs.zimbraPrefLocale && find(locales, { id: settings.prefs.zimbraPrefLocale })
				? find(locales, { id: settings.prefs.zimbraPrefLocale })
				: locales[5],
		[locales, settings.prefs.zimbraPrefLocale]
	);

	const defaultTimeZone = useMemo(
		() =>
			settings.prefs.zimbraPrefTimeZoneId &&
			find(timezones, { value: settings.prefs.zimbraPrefTimeZoneId })
				? find(timezones, { value: settings.prefs.zimbraPrefTimeZoneId })
				: timezones[39],
		[timezones, settings.prefs.zimbraPrefTimeZoneId]
	);
	const sectionTitle = useMemo(() => timezoneAndLanguageSubSection(t), [t]);
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
							updatePrefs(value, 'zimbraPrefLocale');
						}}
						defaultSelection={defaultSelection}
						showCheckbox={false}
						dropdownMaxHeight="200px"
						selectedBackgroundColor="highlight"
					/>
				)}
				<Padding top="small" width="100%">
					{Object.keys(settings.prefs).length > 0 && (
						<Select
							items={timezones}
							background="gray5"
							label={t('label.time_zone', 'Time Zone')}
							onChange={(value: any): void => {
								updatePrefs(value, 'zimbraPrefTimeZoneId');
							}}
							defaultSelection={defaultTimeZone}
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
