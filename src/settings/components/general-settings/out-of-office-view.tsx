/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
	Checkbox,
	CheckboxProps,
	Container,
	FormSubSection,
	Select,
	SelectItem,
	SingleSelectionOnChange,
	TextArea,
	TextAreaProps
} from '@zextras/carbonio-design-system';
import React, { useCallback, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { find } from 'lodash';
import momentLocalizer from 'react-widgets-moment';
import { type TFunction } from 'i18next';
import {
	AccountSettings,
	AccountSettingsPrefs,
	AddMod,
	BooleanString,
	PrefsMods
} from '../../../../types';
import Heading from '../settings-heading';
import DateTimeSelect from '../date-time-select-view';
import { getT } from '../../../store/i18n';
import { outOfOfficeSubSection } from '../../general-settings-sub-sections';
import { ResetComponentImperativeHandler } from '../utils';

momentLocalizer();

export const buildItemsPrefOutOfOfficeReplyEnabled = (
	t: TFunction
): Array<SelectItem<NonNullable<AccountSettingsPrefs['zimbraPrefOutOfOfficeReplyEnabled']>>> => [
	{
		label: t('settings.out_of_office.send_auto_replies', 'Send auto-replies'),
		value: 'TRUE'
	},
	{
		label: t('settings.out_of_office.do_not_send_auto_replies', 'Do not send auto-replies'),
		value: 'FALSE'
	}
];

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

export const buildItemsPrefOutOfOfficeFreeBusyStatus = (
	t: TFunction
): Record<
	NonNullable<AccountSettingsPrefs['zimbraPrefOutOfOfficeFreeBusyStatus']>,
	SelectItem<NonNullable<AccountSettingsPrefs['zimbraPrefOutOfOfficeFreeBusyStatus']>>
> => ({
	OUTOFOFFICE: {
		label: t('label.out_of_office', 'Out of Office'),
		value: 'OUTOFOFFICE'
	},
	BUSY: {
		label: t('settings.out_of_office.status.busy', 'Busy'),
		value: 'BUSY'
	}
});

export const getExternalSendersPrefsData = (
	settings: AccountSettings,
	t: TFunction
): SelectItem<ExternalSenders> => {
	const itemsExternalSenders = buildItemsExternalSenders(t);
	if (
		settings.prefs.zimbraPrefOutOfOfficeSuppressExternalReply === 'FALSE' &&
		settings.prefs.zimbraPrefOutOfOfficeExternalReplyEnabled === 'FALSE'
	) {
		return itemsExternalSenders.SEND_AUTO_REPLY;
	}
	if (
		settings.prefs.zimbraPrefExternalSendersType === 'ALL' &&
		settings.prefs.zimbraPrefOutOfOfficeExternalReplyEnabled === 'TRUE'
	) {
		return itemsExternalSenders.SHOW_EXTERNAL_INPUT;
	}
	if (
		settings.prefs.zimbraPrefExternalSendersType === 'ALLNOTINAB' &&
		settings.prefs.zimbraPrefOutOfOfficeExternalReplyEnabled === 'TRUE'
	) {
		return itemsExternalSenders.SEND_NOT_IN_ORG;
	}
	return itemsExternalSenders.SUPPRESS_EXTERNAL;
};

export const getPrefOutOfOfficeFreeBusyStatus = (
	settings: AccountSettings,
	t: TFunction
): SelectItem<AccountSettingsPrefs['zimbraPrefOutOfOfficeFreeBusyStatus']> => {
	const itemsOutOfOfficeStatus = buildItemsPrefOutOfOfficeFreeBusyStatus(t);
	if (settings.prefs.zimbraPrefOutOfOfficeFreeBusyStatus !== undefined) {
		return itemsOutOfOfficeStatus[settings.prefs.zimbraPrefOutOfOfficeFreeBusyStatus];
	}
	return itemsOutOfOfficeStatus.OUTOFOFFICE;
};

interface OutOfOfficeViewProps {
	settings: AccountSettings;
	addMod: AddMod;
	resetRef?: React.Ref<ResetComponentImperativeHandler>;
}

export const OutOfOfficeView = ({
	settings,
	addMod,
	resetRef
}: OutOfOfficeViewProps): JSX.Element => {
	const t = getT();
	const outOfOfficeSectionTitle = useMemo(() => outOfOfficeSubSection(t), [t]);

	const [prefOutOfOfficeReplyEnabled, setPrefOutOfOfficeReplyEnabled] = useState<BooleanString>(
		settings.prefs.zimbraPrefOutOfOfficeReplyEnabled ?? 'FALSE'
	);
	const [prefOutOfOfficeReply, setPrefOutOfOfficeReply] = useState<string>(
		settings.prefs.zimbraPrefOutOfOfficeReply ?? ''
	);

	const [prefOutOfOfficeExternalReplyEnabled, setPrefOutOfOfficeExternalReplyEnabled] =
		useState<BooleanString>(settings.prefs.zimbraPrefOutOfOfficeExternalReplyEnabled ?? 'FALSE');

	const [prefOutOfOfficeExternalReply, setPrefOutOfOfficeExternalReply] = useState<string>(
		settings.prefs.zimbraPrefOutOfOfficeExternalReply ?? ''
	);

	const [externalSendersSelectedItem, setExternalSendersSelectedItem] = useState<
		SelectItem<ExternalSenders>
	>(getExternalSendersPrefsData(settings, t));

	const initPrefs = useCallback(() => {
		setPrefOutOfOfficeReplyEnabled(settings.prefs.zimbraPrefOutOfOfficeReplyEnabled ?? 'FALSE');
		setPrefOutOfOfficeReply(settings.prefs.zimbraPrefOutOfOfficeReply ?? '');
		setPrefOutOfOfficeExternalReplyEnabled(
			settings.prefs.zimbraPrefOutOfOfficeExternalReplyEnabled ?? 'FALSE'
		);
		setPrefOutOfOfficeExternalReply(settings.prefs.zimbraPrefOutOfOfficeExternalReply ?? '');
		setExternalSendersSelectedItem(getExternalSendersPrefsData(settings, t));
	}, [settings, t]);

	useEffect(() => {
		initPrefs();
	}, [initPrefs, settings]);

	useImperativeHandle(
		resetRef,
		() => ({
			reset: initPrefs
		}),
		[initPrefs]
	);

	const [createAppointmentIsChecked, setCreateAppointmentIsChecked] = useState<boolean>(true);

	const updatePrefs = useCallback(
		<K extends keyof PrefsMods>(prefKey: K, prefValue: PrefsMods[K]) => {
			addMod('prefs', prefKey, prefValue);
		},
		[addMod]
	);

	const prefOutOfOfficeReplyEnabledSelectItems = useMemo(
		() => buildItemsPrefOutOfOfficeReplyEnabled(t),
		[t]
	);

	const prefOutOfOfficeReplyEnabledSelectedValue = useMemo<SelectItem<BooleanString>>(
		() =>
			find(
				prefOutOfOfficeReplyEnabledSelectItems,
				(item) => item.value === prefOutOfOfficeReplyEnabled
			) as SelectItem<BooleanString>,
		[prefOutOfOfficeReplyEnabled, prefOutOfOfficeReplyEnabledSelectItems]
	);

	const prefOutOfOfficeReplyEnabledOnChange = useCallback<
		SingleSelectionOnChange<NonNullable<AccountSettingsPrefs['zimbraPrefOutOfOfficeReplyEnabled']>>
	>(
		(value): void => {
			if (value !== null) {
				updatePrefs('zimbraPrefOutOfOfficeReplyEnabled', value);
				setPrefOutOfOfficeReplyEnabled(value);
			}
		},
		[updatePrefs]
	);

	const externalSendersSelectItems = useMemo(
		() => Object.values(buildItemsExternalSenders(t)),
		[t]
	);

	const externalSendersHandler = useCallback(
		(value: ExternalSenders) => {
			if (value === 'SEND_AUTO_REPLY') {
				updatePrefs('zimbraPrefExternalSendersType', 'INSD');
				updatePrefs('zimbraPrefOutOfOfficeExternalReplyEnabled', 'FALSE');
				updatePrefs('zimbraPrefOutOfOfficeSuppressExternalReply', 'FALSE');
				setPrefOutOfOfficeExternalReplyEnabled('FALSE');
			} else if (value === 'SHOW_EXTERNAL_INPUT') {
				updatePrefs('zimbraPrefExternalSendersType', 'ALL');
				updatePrefs('zimbraPrefOutOfOfficeExternalReplyEnabled', 'TRUE');
				updatePrefs('zimbraPrefOutOfOfficeSuppressExternalReply', 'FALSE');
				setPrefOutOfOfficeExternalReplyEnabled('TRUE');
			} else if (value === 'SEND_NOT_IN_ORG') {
				updatePrefs('zimbraPrefExternalSendersType', 'ALLNOTINAB');
				updatePrefs('zimbraPrefOutOfOfficeExternalReplyEnabled', 'TRUE');
				updatePrefs('zimbraPrefOutOfOfficeSuppressExternalReply', 'FALSE');
				setPrefOutOfOfficeExternalReplyEnabled('TRUE');
			} else if (value === 'SUPPRESS_EXTERNAL') {
				updatePrefs('zimbraPrefExternalSendersType', 'INAB');
				updatePrefs('zimbraPrefOutOfOfficeExternalReplyEnabled', 'FALSE');
				updatePrefs('zimbraPrefOutOfOfficeSuppressExternalReply', 'TRUE');
				setPrefOutOfOfficeExternalReplyEnabled('FALSE');
			}
		},
		[updatePrefs]
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
			updatePrefs('zimbraPrefOutOfOfficeReply', ev.target.value);
		},
		[updatePrefs]
	);

	const prefOutOfOfficeExternalReplyOnChange = useCallback<NonNullable<TextAreaProps['onChange']>>(
		(ev) => {
			setPrefOutOfOfficeExternalReply(ev.target.value);
			updatePrefs('zimbraPrefOutOfOfficeExternalReply', ev.target.value);
		},
		[updatePrefs]
	);

	const canCreateAppointment = useMemo(
		() => prefOutOfOfficeReplyEnabled === 'TRUE',
		[prefOutOfOfficeReplyEnabled]
	);

	const createAppointmentOnChange = useCallback<NonNullable<CheckboxProps['onClick']>>(() => {
		setCreateAppointmentIsChecked((prevState) => !prevState);
	}, []);

	const prefOutOfOfficeFreeBusyStatusSelectItems = useMemo(
		() => Object.values(buildItemsPrefOutOfOfficeFreeBusyStatus(t)),
		[t]
	);

	const prefOutOfOfficeFreeBusyStatusSelectedItem = useMemo(
		() => getPrefOutOfOfficeFreeBusyStatus(settings, t),
		[settings, t]
	);

	const prefOutOfOfficeFreeBusyStatusOnChange = useCallback<
		SingleSelectionOnChange<
			NonNullable<AccountSettingsPrefs['zimbraPrefOutOfOfficeFreeBusyStatus']>
		>
	>(
		(value) => {
			if (value !== null) {
				updatePrefs('zimbraPrefOutOfOfficeFreeBusyStatus', value);
			}
		},
		[updatePrefs]
	);

	return (
		<FormSubSection
			label={outOfOfficeSectionTitle.label}
			minWidth="calc(min(100%, 32rem))"
			width="50%"
			id={outOfOfficeSectionTitle.id}
		>
			<Container crossAlignment="baseline" padding={{ all: 'small' }} gap={'0.5rem'}>
				<Select
					items={prefOutOfOfficeReplyEnabledSelectItems}
					label={t('label.out_of_office', 'Out of Office')}
					onChange={prefOutOfOfficeReplyEnabledOnChange}
					selection={prefOutOfOfficeReplyEnabledSelectedValue}
				/>
				<TextArea
					value={prefOutOfOfficeReply}
					disabled={prefOutOfOfficeReplyEnabled === 'FALSE'}
					label={t('settings.out_of_office.labels.auto_reply_message', 'Auto-Reply Message:')}
					onChange={prefOutOfOfficeReplyOnChange}
				/>
				<Select
					disabled={prefOutOfOfficeReplyEnabled === 'FALSE'}
					items={externalSendersSelectItems}
					label={t('settings.out_of_office.labels.external_senders', 'External Senders')}
					onChange={externalSendersOnChange}
					selection={externalSendersSelectedItem}
				/>
				{prefOutOfOfficeExternalReplyEnabled === 'TRUE' && (
					<TextArea
						value={prefOutOfOfficeExternalReply}
						disabled={prefOutOfOfficeReplyEnabled === 'FALSE'}
						label={t(
							'settings.out_of_office.labels.auto_reply_message_external',
							'Auto-Reply Message for External senders:'
						)}
						onChange={prefOutOfOfficeExternalReplyOnChange}
					/>
				)}
			</Container>
			<Container crossAlignment="baseline" padding={{ all: 'small' }}>
				<DateTimeSelect
					settings={settings}
					addMod={addMod}
					sendAutoReply={prefOutOfOfficeReplyEnabled === 'TRUE'}
				/>
				<Container crossAlignment="flex-start">
					<Heading
						title={t('settings.out_of_office.headings.create_appointment', 'Calendar Appointment')}
					/>
					<Checkbox
						disabled={!canCreateAppointment}
						label={t('settings.out_of_office.labels.create_appointment', 'Create Appointment:')}
						value={createAppointmentIsChecked}
						onClick={createAppointmentOnChange}
					/>
				</Container>
				<Container
					crossAlignment="baseline"
					padding={{ bottom: 'small', left: 'small', right: 'small', top: 'medium' }}
					width={'50%'}
				>
					<Select
						disabled={!canCreateAppointment || !createAppointmentIsChecked}
						items={prefOutOfOfficeFreeBusyStatusSelectItems}
						label={t('settings.out_of_office.labels.out_of_office_status', 'Out Of Office Status:')}
						onChange={prefOutOfOfficeFreeBusyStatusOnChange}
						selection={prefOutOfOfficeFreeBusyStatusSelectedItem}
					/>
				</Container>
			</Container>
		</FormSubSection>
	);
};
