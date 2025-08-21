/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type {
	SelectItem,
	SingleSelectionOnChange,
	SwitchProps,
	TextAreaProps
} from '@zextras/carbonio-design-system';
import {
	Switch,
	Container,
	FormSubSection,
	FormSection,
	Checkbox,
	Select,
	TextArea
} from '@zextras/carbonio-design-system';
import { type TFunction } from 'i18next';
import { find } from 'lodash';

import { OutOfOfficeTimePeriodSection } from './out-of-office-time-period-section';
import { SETTINGS_OUT_OF_OFFICE_TEXT_AREA_MAX_CHAR_LIMIT } from '../../../constants/internal-constants';
import { getT } from '../../../store/i18n/hooks';
import type { AccountSettings } from '../../../types/account';
import type { AddMod, RemoveMod } from '../../../types/network';
import { outOfOfficeSubSection } from '../../general-settings-sub-sections';
import { useReset } from '../../hooks/use-reset';
import type { ResetComponentImperativeHandler, SettingsSectionProps } from '../utils';
import { dateToGenTime, upsertPrefOnUnsavedChanges } from '../utils';

type ExternalSenders =
	| 'SEND_AUTO_REPLY'
	| 'SHOW_EXTERNAL_INPUT'
	| 'SEND_NOT_IN_ORG'
	| 'SUPPRESS_EXTERNAL';

export const buildItemsExternalSenders = (
	t: TFunction
): Record<ExternalSenders, SelectItem<ExternalSenders>> => ({
	SEND_AUTO_REPLY: {
		label: t(
			'settings.out_of_office.external_senders.send_standard_auto_reply',
			'Send standard auto-reply message'
		),
		value: 'SEND_AUTO_REPLY'
	},
	SHOW_EXTERNAL_INPUT: {
		label: t(
			'settings.out_of_office.external_senders.send_custom_in_organisation',
			'Send custom message to those who are not in my organization'
		),
		value: 'SHOW_EXTERNAL_INPUT'
	},
	SEND_NOT_IN_ORG: {
		label: t(
			'settings.out_of_office.external_senders.send_custom_not_in_organisation',
			'Send custom message to those who are not in my organization or address book'
		),
		value: 'SEND_NOT_IN_ORG'
	},
	SUPPRESS_EXTERNAL: {
		label: t(
			'settings.out_of_office.external_senders.do_not_send_to_external',
			"Don't send an auto-reply message to external sender"
		),
		value: 'SUPPRESS_EXTERNAL'
	}
});

const getExternalSenderFromSettings = (settings: AccountSettings): ExternalSenders => {
	if (
		settings.prefs.zimbraPrefOutOfOfficeSuppressExternalReply === 'FALSE' &&
		settings.prefs.zimbraPrefOutOfOfficeExternalReplyEnabled === 'FALSE'
	) {
		return 'SEND_AUTO_REPLY';
	}
	if (
		settings.prefs.zimbraPrefExternalSendersType === 'ALL' &&
		settings.prefs.zimbraPrefOutOfOfficeExternalReplyEnabled === 'TRUE'
	) {
		return 'SHOW_EXTERNAL_INPUT';
	}
	if (
		settings.prefs.zimbraPrefExternalSendersType === 'ALLNOTINAB' &&
		settings.prefs.zimbraPrefOutOfOfficeExternalReplyEnabled === 'TRUE'
	) {
		return 'SEND_NOT_IN_ORG';
	}
	if (
		settings.prefs.zimbraPrefExternalSendersType === 'INAB' &&
		settings.prefs.zimbraPrefOutOfOfficeExternalReplyEnabled === 'FALSE'
	) {
		return 'SUPPRESS_EXTERNAL';
	}
	return 'SUPPRESS_EXTERNAL';
};

export const getExternalSendersPrefsData = (
	settings: AccountSettings,
	t: TFunction
): SelectItem<ExternalSenders> =>
	buildItemsExternalSenders(t)[getExternalSenderFromSettings(settings)];

const isTheSameSettingExternalSenderValue = (
	value: ExternalSenders,
	settings: AccountSettings
): boolean => value === getExternalSenderFromSettings(settings);

interface OutOfOfficeViewProps extends SettingsSectionProps {
	settings: AccountSettings;
	addMod: AddMod;
	removeMod: RemoveMod;
	setOutOfOfficeError: React.Dispatch<React.SetStateAction<boolean>>;
	outOfOfficeError: boolean;
}

export const OutOfOfficeSettings = ({
	settings,
	addMod,
	removeMod,
	resetRef,
	setOutOfOfficeError,
	outOfOfficeError
}: OutOfOfficeViewProps): React.JSX.Element => {
	const t = getT();
	const outOfOfficeSectionTitle = useMemo(() => outOfOfficeSubSection(t), [t]);
	const [prefOutOfOfficeReplyEnabled, setPrefOutOfOfficeReplyEnabled] = useState<boolean>(
		settings.prefs.zimbraPrefOutOfOfficeReplyEnabled === 'TRUE'
	);
	const [prefOutOfOfficeReply, setPrefOutOfOfficeReply] = useState<string>(
		settings.prefs.zimbraPrefOutOfOfficeReply ?? ''
	);
	const [prefOutOfOfficeExternalReplyEnabled, setPrefOutOfOfficeExternalReplyEnabled] =
		useState<boolean>(settings.prefs.zimbraPrefOutOfOfficeExternalReplyEnabled === 'TRUE');
	const [prefOutOfOfficeExternalReply, setPrefOutOfOfficeExternalReply] = useState<string>(
		settings.prefs.zimbraPrefOutOfOfficeExternalReply ?? ''
	);
	const [externalSendersSelectedItem, setExternalSendersSelectedItem] = useState<
		SelectItem<ExternalSenders>
	>(getExternalSendersPrefsData(settings, t));
	const [sendAutoReplyTimePeriodEnabled, setSendAutoReplyTimePeriodEnabled] = useState<boolean>(
		!!settings.prefs.zimbraPrefOutOfOfficeFromDate &&
			!!settings.prefs.zimbraPrefOutOfOfficeUntilDate
	);

	const outOfOfficeTimePeriodResetRef = useRef<ResetComponentImperativeHandler>(null);

	const initPrefs = useCallback(() => {
		setPrefOutOfOfficeReplyEnabled(settings.prefs.zimbraPrefOutOfOfficeReplyEnabled === 'TRUE');
		setPrefOutOfOfficeReply(settings.prefs.zimbraPrefOutOfOfficeReply ?? '');
		setPrefOutOfOfficeExternalReplyEnabled(
			settings.prefs.zimbraPrefOutOfOfficeExternalReplyEnabled === 'TRUE'
		);
		setPrefOutOfOfficeExternalReply(settings.prefs.zimbraPrefOutOfOfficeExternalReply ?? '');
		setExternalSendersSelectedItem(getExternalSendersPrefsData(settings, t));
		setSendAutoReplyTimePeriodEnabled(
			!!settings.prefs.zimbraPrefOutOfOfficeFromDate &&
				!!settings.prefs.zimbraPrefOutOfOfficeUntilDate
		);
		outOfOfficeTimePeriodResetRef.current?.reset();
	}, [settings, t]);

	useEffect(() => {
		initPrefs();
	}, [initPrefs]);

	useReset(resetRef, initPrefs);

	const updatePref = useMemo(() => upsertPrefOnUnsavedChanges(addMod), [addMod]);

	const prefOutOfOfficeReplyEnabledOnClick = useCallback<
		NonNullable<SwitchProps['onClick']>
	>((): void => {
		setPrefOutOfOfficeReplyEnabled((prev) => !prev);
	}, []);

	const prefOutOfOfficeReplyEnabledOnChange = useCallback<NonNullable<SwitchProps['onChange']>>(
		(value): void => {
			if (value === (settings.prefs.zimbraPrefOutOfOfficeReplyEnabled === 'TRUE')) {
				removeMod('prefs', 'zimbraPrefOutOfOfficeReplyEnabled');
			} else {
				updatePref('zimbraPrefOutOfOfficeReplyEnabled', value);
			}
		},
		[removeMod, settings.prefs.zimbraPrefOutOfOfficeReplyEnabled, updatePref]
	);

	const externalSendersSelectItems = useMemo(
		() => Object.values(buildItemsExternalSenders(t)),
		[t]
	);

	const externalSendersHandler = useCallback(
		(value: ExternalSenders) => {
			if (isTheSameSettingExternalSenderValue(value, settings)) {
				removeMod('prefs', 'zimbraPrefExternalSendersType');
				removeMod('prefs', 'zimbraPrefOutOfOfficeExternalReplyEnabled');
				removeMod('prefs', 'zimbraPrefOutOfOfficeSuppressExternalReply');
			} else if (value === 'SEND_AUTO_REPLY') {
				updatePref('zimbraPrefExternalSendersType', 'INSD');
				updatePref('zimbraPrefOutOfOfficeExternalReplyEnabled', false);
				updatePref('zimbraPrefOutOfOfficeSuppressExternalReply', false);
			} else if (value === 'SHOW_EXTERNAL_INPUT') {
				updatePref('zimbraPrefExternalSendersType', 'ALL');
				updatePref('zimbraPrefOutOfOfficeExternalReplyEnabled', true);
				updatePref('zimbraPrefOutOfOfficeSuppressExternalReply', false);
			} else if (value === 'SEND_NOT_IN_ORG') {
				updatePref('zimbraPrefExternalSendersType', 'ALLNOTINAB');
				updatePref('zimbraPrefOutOfOfficeExternalReplyEnabled', true);
				updatePref('zimbraPrefOutOfOfficeSuppressExternalReply', false);
			} else if (value === 'SUPPRESS_EXTERNAL') {
				updatePref('zimbraPrefExternalSendersType', 'INAB');
				updatePref('zimbraPrefOutOfOfficeExternalReplyEnabled', false);
				updatePref('zimbraPrefOutOfOfficeSuppressExternalReply', true);
			}
			setPrefOutOfOfficeExternalReplyEnabled(
				['SHOW_EXTERNAL_INPUT', 'SEND_NOT_IN_ORG'].includes(value)
			);
		},
		[removeMod, settings, updatePref]
	);

	const externalSendersOnChange = useCallback<SingleSelectionOnChange<ExternalSenders>>(
		(value) => {
			if (value !== null) {
				externalSendersHandler(value);
				const newSelectItem = find(externalSendersSelectItems, (item) => item.value === value);
				newSelectItem && setExternalSendersSelectedItem(newSelectItem);
			}
		},
		[externalSendersHandler, externalSendersSelectItems]
	);

	const prefOutOfOfficeReplyOnChange = useCallback<NonNullable<TextAreaProps['onChange']>>(
		(ev) => {
			setPrefOutOfOfficeReply(ev.target.value);
			if (ev.target.value === settings.prefs.zimbraPrefOutOfOfficeReply) {
				removeMod('prefs', 'zimbraPrefOutOfOfficeReply');
			} else {
				updatePref('zimbraPrefOutOfOfficeReply', ev.target.value);
			}
		},
		[removeMod, settings.prefs.zimbraPrefOutOfOfficeReply, updatePref]
	);

	const prefOutOfOfficeExternalReplyOnChange = useCallback<NonNullable<TextAreaProps['onChange']>>(
		(ev) => {
			setPrefOutOfOfficeExternalReply(ev.target.value);
			if (ev.target.value === settings.prefs.zimbraPrefOutOfOfficeExternalReply) {
				removeMod('prefs', 'zimbraPrefOutOfOfficeExternalReply');
			} else {
				updatePref('zimbraPrefOutOfOfficeExternalReply', ev.target.value);
			}
		},
		[removeMod, settings.prefs.zimbraPrefOutOfOfficeExternalReply, updatePref]
	);

	const toggleSendAutoReplyTimePeriod = useCallback(() => {
		setSendAutoReplyTimePeriodEnabled((prevState) => {
			const nextState = !prevState;
			if (!nextState) {
				if (
					!!settings.prefs.zimbraPrefOutOfOfficeFromDate &&
					!!settings.prefs.zimbraPrefOutOfOfficeUntilDate
				) {
					updatePref('zimbraPrefOutOfOfficeFromDate', undefined);
					updatePref('zimbraPrefOutOfOfficeUntilDate', undefined);
				} else {
					removeMod('prefs', 'zimbraPrefOutOfOfficeFromDate');
					removeMod('prefs', 'zimbraPrefOutOfOfficeUntilDate');
				}
			} else {
				if (
					!!settings.prefs.zimbraPrefOutOfOfficeFromDate &&
					!!settings.prefs.zimbraPrefOutOfOfficeUntilDate
				) {
					removeMod('prefs', 'zimbraPrefOutOfOfficeFromDate');
					removeMod('prefs', 'zimbraPrefOutOfOfficeUntilDate');
				}
				if (!settings.prefs.zimbraPrefOutOfOfficeFromDate) {
					updatePref(
						'zimbraPrefOutOfOfficeFromDate',
						dateToGenTime(new Date(new Date().setSeconds(0, 0)))
					);
				}
				if (!settings.prefs.zimbraPrefOutOfOfficeUntilDate) {
					updatePref(
						'zimbraPrefOutOfOfficeUntilDate',
						dateToGenTime(new Date(new Date().setSeconds(0, 0)))
					);
				}
			}
			return nextState;
		});
	}, [
		removeMod,
		settings.prefs.zimbraPrefOutOfOfficeFromDate,
		settings.prefs.zimbraPrefOutOfOfficeUntilDate,
		updatePref
	]);

	const prefOutOfOfficeReplyHasError = useMemo(
		() => prefOutOfOfficeReply.length > SETTINGS_OUT_OF_OFFICE_TEXT_AREA_MAX_CHAR_LIMIT,
		[prefOutOfOfficeReply.length]
	);
	const prefOutOfOfficeExternalReplyHasError = useMemo(
		() => prefOutOfOfficeExternalReply.length > SETTINGS_OUT_OF_OFFICE_TEXT_AREA_MAX_CHAR_LIMIT,
		[prefOutOfOfficeExternalReply.length]
	);
	const errorDescription = useMemo(
		() =>
			t(
				'label.settings.textArea.errorDescription',
				"You've exceeded the character limit. Please shorten your text."
			),
		[t]
	);

	useEffect(() => {
		if (prefOutOfOfficeExternalReplyHasError || prefOutOfOfficeReplyHasError) {
			!outOfOfficeError && setOutOfOfficeError(true);
		} else {
			outOfOfficeError && setOutOfOfficeError(false);
		}
	}, [
		prefOutOfOfficeExternalReplyHasError,
		prefOutOfOfficeReplyHasError,
		setOutOfOfficeError,
		outOfOfficeError
	]);

	return (
		<FormSection
			label={outOfOfficeSectionTitle.label}
			id={outOfOfficeSectionTitle.id}
			data-testid={'out_of_office'}
		>
			<FormSubSection>
				<Container gap={'0.5rem'} crossAlignment={'flex-start'}>
					<Switch
						value={prefOutOfOfficeReplyEnabled}
						label={t('label.send_auto_reply', 'Send auto-reply')}
						onClick={prefOutOfOfficeReplyEnabledOnClick}
						onChange={prefOutOfOfficeReplyEnabledOnChange}
					/>
					<TextArea
						value={prefOutOfOfficeReply}
						disabled={!prefOutOfOfficeReplyEnabled}
						label={t('settings.out_of_office.labels.auto_reply_message', 'Auto-Reply Message:')}
						onChange={prefOutOfOfficeReplyOnChange}
						description={
							prefOutOfOfficeReplyHasError
								? `${prefOutOfOfficeReply.length}/${SETTINGS_OUT_OF_OFFICE_TEXT_AREA_MAX_CHAR_LIMIT} ${errorDescription}`
								: `${prefOutOfOfficeReply.length}/${SETTINGS_OUT_OF_OFFICE_TEXT_AREA_MAX_CHAR_LIMIT}`
						}
						hasError={prefOutOfOfficeReplyHasError}
					/>
					<Select
						disabled={!prefOutOfOfficeReplyEnabled}
						items={externalSendersSelectItems}
						label={t('settings.out_of_office.labels.external_senders', 'External Senders')}
						onChange={externalSendersOnChange}
						selection={externalSendersSelectedItem}
						dropdownWidth={'auto'}
						dropdownMaxWidth={'unset'}
						placement={'bottom-start'}
					/>
					{prefOutOfOfficeExternalReplyEnabled && (
						<TextArea
							value={prefOutOfOfficeExternalReply}
							disabled={!prefOutOfOfficeReplyEnabled}
							label={t(
								'settings.out_of_office.labels.auto_reply_message_external',
								'Auto-Reply Message for External senders:'
							)}
							onChange={prefOutOfOfficeExternalReplyOnChange}
							description={
								prefOutOfOfficeExternalReplyHasError
									? `${prefOutOfOfficeExternalReply.length}/${SETTINGS_OUT_OF_OFFICE_TEXT_AREA_MAX_CHAR_LIMIT} ${errorDescription}`
									: `${prefOutOfOfficeExternalReply.length}/${SETTINGS_OUT_OF_OFFICE_TEXT_AREA_MAX_CHAR_LIMIT}`
							}
							hasError={prefOutOfOfficeExternalReplyHasError}
						/>
					)}
				</Container>
			</FormSubSection>
			<FormSubSection
				label={t('settings.out_of_office.headings.time_period', 'Time Period')}
				disabled={!prefOutOfOfficeReplyEnabled}
			>
				<Container gap={'0.5rem'} mainAlignment={'flex-start'} crossAlignment={'flex-start'}>
					<Checkbox
						label={t(
							'settings.out_of_office.labels.send_auto_reply_period',
							'Send auto-replies during the following period:'
						)}
						value={sendAutoReplyTimePeriodEnabled}
						onClick={toggleSendAutoReplyTimePeriod}
						disabled={!prefOutOfOfficeReplyEnabled}
					/>
					<OutOfOfficeTimePeriodSection
						addMod={addMod}
						removeMod={removeMod}
						disabled={!prefOutOfOfficeReplyEnabled || !sendAutoReplyTimePeriodEnabled}
						prefOutOfOfficeFromDate={settings.prefs.zimbraPrefOutOfOfficeFromDate}
						prefOutOfOfficeUntilDate={settings.prefs.zimbraPrefOutOfOfficeUntilDate}
						resetRef={outOfOfficeTimePeriodResetRef}
					/>
				</Container>
			</FormSubSection>
		</FormSection>
	);
};
