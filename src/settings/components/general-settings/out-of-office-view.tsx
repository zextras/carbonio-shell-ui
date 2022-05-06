/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useState, useCallback, FC, useEffect, useMemo } from 'react';
import {
	Container,
	FormSubSection,
	Input,
	Checkbox,
	Select,
	Padding
} from '@zextras/carbonio-design-system';

// eslint-disable-next-line import/no-extraneous-dependencies
import momentLocalizer from 'react-widgets-moment';
import { useTranslation } from 'react-i18next';
import { AccountSettings } from '../../../../types';
import Heading from '../settings-heading';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import DateTimeSelect from '../date-time-select-view';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {
	ItemsExternalSenders,
	getExternalSendersPrefsData,
	ItemsOutOfOfficeStatus,
	getOutOfOfficeStatusPrefsData,
	ItemsSendAutoReplies
} from '../utils';
import { outOfOfficeSubSection } from '../../general-settings-sub-sections';

momentLocalizer();

const OutOfOfficeView: FC<{
	settings: AccountSettings;
	addMod: (type: 'prefs' | 'props', key: string, value: { value: any; app: string }) => void;
}> = ({ settings, addMod }) => {
	const { t } = useTranslation();
	const [sendAutoReply, setSendAutoReply] = useState<boolean>(
		settings.prefs.zimbraPrefOutOfOfficeReplyEnabled === 'TRUE'
	);
	const [inputZimbraPrefOutOfOfficeReply, setInputZimbraPrefOutOfOfficeReply] = useState<string>(
		settings.prefs.zimbraPrefOutOfOfficeReply as string
	);

	const [inputZimbraPrefOutOfOfficeExternalReply, setInputZimbraPrefOutOfOfficeExternalReply] =
		useState<string>(settings.prefs.zimbraPrefOutOfOfficeExternalReply as string);

	const [createAppointmentDisabled, setCreateAppointmentDisabled] = useState<boolean>(false);
	const [externalReplyInput, setExternalReplyInput] = useState<boolean>(
		settings.prefs.zimbraPrefOutOfOfficeExternalReplyEnabled === 'TRUE'
	);

	const [createAppointment, setCreateAppointment] = useState<boolean>(true);

	const updatePrefs = useCallback(
		(v, p) => {
			addMod('prefs', p, v);
		},
		[addMod]
	);

	useEffect(() => {
		if (sendAutoReply) {
			setCreateAppointmentDisabled(false);
		} else {
			setCreateAppointmentDisabled(true);
		}
	}, [
		sendAutoReply,
		settings.prefs.zimbraPrefOutOfOfficeFromDate,
		updatePrefs,
		setCreateAppointment,
		setCreateAppointmentDisabled
	]);

	const externalSendersHandler = (v: any): void => {
		setExternalReplyInput(false);

		if (v === 'SEND_AUTO_REPLY') {
			updatePrefs('FALSE', 'zimbraPrefOutOfOfficeSuppressExternalReply');
			updatePrefs('FALSE', 'zimbraPrefOutOfOfficeExternalReplyEnabled');
			updatePrefs('INSD', 'zimbraPrefExternalSendersType');
		} else if (v === 'SEND_NOT_IN_ORG') {
			updatePrefs('ALLNOTINAB', 'zimbraPrefExternalSendersType');
			updatePrefs('TRUE', 'zimbraPrefOutOfOfficeExternalReplyEnabled');
			updatePrefs('FALSE', 'zimbraPrefOutOfOfficeSuppressExternalReply');
			setExternalReplyInput(true);
		} else if (v === 'SHOW_EXTERNAL_INPUT') {
			updatePrefs('ALL', 'zimbraPrefExternalSendersType');
			updatePrefs('FALSE', 'zimbraPrefOutOfOfficeExternalReplyEnabled');
			updatePrefs('INSD', 'zimbraPrefOutOfOfficeSuppressExternalReply');
			setExternalReplyInput(true);
		} else {
			updatePrefs('TRUE', 'zimbraPrefOutOfOfficeSuppressExternalReply');
			updatePrefs('INAB', 'zimbraPrefExternalSendersType');
			updatePrefs('FALSE', 'zimbraPrefOutOfOfficeExternalReplyEnabled');
		}
	};

	const createAppointmentAsHandler = (v: any): void => {
		updatePrefs(v, 'zimbraPrefOutOfOfficeFreeBusyStatus');
	};

	const itemsSendAutoReplies = useMemo(() => ItemsSendAutoReplies(t), [t]);
	const itemsExternalSenders = useMemo(() => ItemsExternalSenders(t), [t]);
	const itemsOutOfOfficeStatus = useMemo(() => ItemsOutOfOfficeStatus(t), [t]);
	const sectionTitle = useMemo(() => outOfOfficeSubSection(t), [t]);
	const defaultSendAutoreply = useMemo(
		() => getExternalSendersPrefsData(settings, 'label', t),
		[settings, t]
	);
	const defaultOutOfOfficeStatus = useMemo(
		() => getOutOfOfficeStatusPrefsData(settings, t),
		[settings, t]
	);
	return (
		<FormSubSection
			label={sectionTitle.label}
			minWidth="calc(min(100%, 512px))"
			width="50%"
			id={sectionTitle.id}
		>
			<Container crossAlignment="baseline" padding={{ all: 'small' }}>
				<Select
					items={itemsSendAutoReplies}
					background="gray5"
					label={t('label.out_of_office', 'Out of Office')}
					onChange={(value: any): void => {
						if (value && value !== settings.prefs.zimbraPrefOutOfOfficeReplyEnabled) {
							updatePrefs(value, 'zimbraPrefOutOfOfficeReplyEnabled');
							setSendAutoReply(!sendAutoReply);
						}
					}}
					selection={
						settings.prefs.zimbraPrefOutOfOfficeReplyEnabled === 'TRUE'
							? itemsSendAutoReplies[0]
							: itemsSendAutoReplies[1]
					}
				/>
				<Padding top="small" width="100%">
					<Input
						onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
							setInputZimbraPrefOutOfOfficeReply(e.target.value);
							updatePrefs(e.target.value, 'zimbraPrefOutOfOfficeReply');
						}}
						autoComplete="on"
						label={t('settings.out_of_office.labels.auto_reply_message', 'Auto-Reply Message:')}
						backgroundColor="gray5"
						value={inputZimbraPrefOutOfOfficeReply || ''}
						disabled={!sendAutoReply}
					/>
				</Padding>
				<Padding top="small" width="100%">
					<Select
						disabled={!sendAutoReply}
						items={itemsExternalSenders}
						background="gray5"
						label={t('settings.out_of_office.labels.external_senders', 'External Senders')}
						onChange={(value: unknown): void => {
							if (value && value !== defaultSendAutoreply?.value) externalSendersHandler(value);
						}}
						selection={defaultSendAutoreply}
					/>
				</Padding>
				{externalReplyInput && (
					<Padding top="small" width="100%">
						<Input
							onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
								setInputZimbraPrefOutOfOfficeExternalReply(e.target.value);
								updatePrefs(e.target.value, 'zimbraPrefOutOfOfficeExternalReply');
							}}
							autoComplete="on"
							label={t(
								'settings.out_of_office.labels.auto_reply_message_external',
								'Auto-Reply Message for External senders:'
							)}
							backgroundColor="gray5"
							value={inputZimbraPrefOutOfOfficeExternalReply || ''}
							disabled={!sendAutoReply}
						/>
					</Padding>
				)}
			</Container>
			<Container crossAlignment="baseline" padding={{ all: 'small' }}>
				<DateTimeSelect settings={settings} addMod={addMod} sendAutoReply={sendAutoReply} />
				<Container crossAlignment="flex-start">
					<Heading
						title={t('settings.out_of_office.headings.create_appointment', 'Calendar Appointment')}
					/>
					<Checkbox
						disabled={createAppointmentDisabled}
						label={t('settings.out_of_office.labels.create_appointment', 'Create Appointment:')}
						value={createAppointment}
						onClick={(value: any): void => {
							setCreateAppointment(!createAppointment);
						}}
					/>
				</Container>
				<Container crossAlignment="baseline" padding={{ all: 'small' }}>
					<Padding top="small" width="50%">
						<Select
							disabled={createAppointmentDisabled}
							items={itemsOutOfOfficeStatus}
							background="gray5"
							label={t(
								'settings.out_of_office.labels.out_of_office_status',
								'Out Of Office Status:'
							)}
							onChange={(value: unknown): void => {
								if (value && value !== defaultOutOfOfficeStatus?.value)
									createAppointmentAsHandler(value);
							}}
							selection={defaultOutOfOfficeStatus}
						/>
					</Padding>
				</Container>
			</Container>
		</FormSubSection>
	);
};

export default OutOfOfficeView;
