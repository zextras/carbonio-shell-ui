/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
	Checkbox,
	Container,
	FormSubSection,
	Padding,
	Select
} from '@zextras/carbonio-design-system';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
// eslint-disable-next-line import/no-extraneous-dependencies
import { find } from 'lodash';
import momentLocalizer from 'react-widgets-moment';
import { AccountSettings } from '../../../../types';
import Heading from '../settings-heading';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import DateTimeSelect from '../date-time-select-view';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { getT } from '../../../store/i18n';
import { outOfOfficeSubSection } from '../../general-settings-sub-sections';
import {
	getExternalSendersPrefsData,
	getOutOfOfficeStatusPrefsData,
	ItemsExternalSenders,
	ItemsOutOfOfficeStatus,
	ItemsSendAutoReplies
} from '../utils';

const TextArea = styled.textarea`
	box-sizing: border-box;
	padding: 10px;
	min-height: 150px;
	background: ${({ theme }): string => theme.palette.gray5.regular};
	flex-grow: 1;
	width: 100%;
	border: none;
	resize: vertical;
	& :focus,
	:active {
		box-shadow: none;
		border: none;
		outline: none;
	}
`;

momentLocalizer();

const OutOfOfficeView: FC<{
	settings: AccountSettings;
	addMod: (type: 'prefs' | 'props', key: string, value: { value: any; app: string }) => void;
}> = ({ settings, addMod }) => {
	const t = getT();
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

	const defaultSendAutoreply = useMemo(
		() => getExternalSendersPrefsData(settings, 'label', t),
		[settings, t]
	);
	const defaultOutOfOfficeStatus = useMemo(
		() => getOutOfOfficeStatusPrefsData(settings, t),
		[settings, t]
	);
	const selectedItemSendAutoReplies = useMemo(
		() =>
			find(ItemsSendAutoReplies(t), (item) => item && (item.value === 'TRUE') === sendAutoReply),
		[sendAutoReply, t]
	);

	return (
		<FormSubSection
			label={outOfOfficeSubSection(t).label}
			minWidth="calc(min(100%, 512px))"
			width="50%"
			id={outOfOfficeSubSection(t).id}
		>
			<Container crossAlignment="baseline" padding={{ all: 'small' }}>
				<Select
					items={ItemsSendAutoReplies(t)}
					background="gray5"
					label={t('label.out_of_office', 'Out of Office')}
					onChange={(value: any): void => {
						if (value && (value === 'TRUE') !== sendAutoReply) {
							updatePrefs(value, 'zimbraPrefOutOfOfficeReplyEnabled');
							setSendAutoReply(value === 'TRUE');
						}
					}}
					selection={selectedItemSendAutoReplies}
				/>
				<Padding top="small" width="100%">
					<TextArea
						value={inputZimbraPrefOutOfOfficeReply || ''}
						disabled={!sendAutoReply}
						placeholder={t(
							'settings.out_of_office.labels.auto_reply_message',
							'Auto-Reply Message:'
						)}
						onChange={(ev): void => {
							setInputZimbraPrefOutOfOfficeReply(ev.target.value);
							updatePrefs(ev.target.value, 'zimbraPrefOutOfOfficeReply');
						}}
					/>
				</Padding>
				<Padding top="small" width="100%">
					<Select
						disabled={!sendAutoReply}
						items={ItemsExternalSenders(t)}
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
						<TextArea
							value={inputZimbraPrefOutOfOfficeExternalReply || ''}
							disabled={!sendAutoReply}
							placeholder={t(
								'settings.out_of_office.labels.auto_reply_message_external',
								'Auto-Reply Message for External senders:'
							)}
							onChange={(ev): void => {
								setInputZimbraPrefOutOfOfficeExternalReply(ev.target.value);
								updatePrefs(ev.target.value, 'zimbraPrefOutOfOfficeExternalReply');
							}}
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
							items={ItemsOutOfOfficeStatus(t)}
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
