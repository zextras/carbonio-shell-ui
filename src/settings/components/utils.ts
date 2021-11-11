import moment from 'moment';
import { TFunction } from 'i18next';
import { AccountSettings } from '../../../types';

// const [t] = useTranslation();

export const ItemsSendAutoReplies = (t: TFunction): any => [
	{
		label: t('settings.out_of_office.send_auto_replies', 'Send auto replies'),
		value: 'TRUE'
	},
	{
		label: t('settings.out_of_office.do_not_send_auto_replies', 'Do not send auto replies'),
		value: 'FALSE'
	}
];

export const ItemsExternalSenders = (t: TFunction): any => [
	{
		label: t(
			'settings.out_of_office.external_senders.send_standard_auto_reply',
			'Send standard auto-reply message'
		),
		value: 'SEND_AUTO_REPLY'
	},
	{
		label: t(
			'settings.out_of_office.external_senders.send_custom_in_organisation',
			'Send custom message to those not in my organisation'
		),
		value: 'SHOW_EXTERNAL_INPUT'
	},
	{
		label: t(
			'settings.out_of_office.external_senders.send_custom_not_in_organisation',
			'Send custom message to those not in my organisation and address book'
		),
		value: 'SEND_NOT_IN_ORG'
	},
	{
		label: t(
			'settings.out_of_office.external_senders.do_not_send_to_external',
			'Don’t send an auto-reply message to external sender'
		),
		value: 'SUPPRESS_EXTERNAL'
	}
];

export const ItemsOutOfOfficeStatus = (t: TFunction): any => [
	{
		label: t('settings.out_of_office.status.out_of_office', 'Out of Office'),
		value: 'OUTOFOFFICE'
	},
	{
		label: t('settings.out_of_office.status.busy', 'Busy'),
		value: 'BUSY'
	}
];

export const getExternalSendersPrefsData = (
	settings: AccountSettings,
	ret: string,
	t: TFunction
): string => {
	let item;
	const itemsExternalSenders = ItemsExternalSenders(t);
	if (
		settings.prefs.zimbraPrefOutOfOfficeSuppressExternalReply === 'FALSE' &&
		settings.prefs.zimbraPrefOutOfOfficeExternalReplyEnabled === 'FALSE'
	) {
		item = { ...itemsExternalSenders[0] };
	} else if (
		settings.prefs.zimbraPrefExternalSendersType === 'ALL' &&
		settings.prefs.zimbraPrefOutOfOfficeExternalReplyEnabled === 'TRUE'
	) {
		item = { ...itemsExternalSenders[1] };
	} else if (
		settings.prefs.zimbraPrefExternalSendersType === 'ALLNOTINAB' &&
		settings.prefs.zimbraPrefOutOfOfficeExternalReplyEnabled === 'TRUE'
	) {
		item = { ...itemsExternalSenders[2] };
	} else {
		item = { ...itemsExternalSenders[3] };
	}
	return String(item[ret]);
};

export const getOutOfOfficeStatusPrefsData = (
	settings: AccountSettings,
	ret: string,
	t: TFunction
): string => {
	let item;
	const itemsOutOfOfficeStatus = ItemsOutOfOfficeStatus(t);
	if (settings.prefs.zimbraPrefOutOfOfficeFreeBusyStatus === 'BUSY') {
		item = { ...itemsOutOfOfficeStatus[1] };
	} else {
		item = { ...itemsOutOfOfficeStatus[0] };
	}

	return String(item[ret]);
};

export const changeDateEvent = (date: string | Date): string =>
	moment(moment(date, 'YYYYMMDDHHmmss[Z]').utc()).format('YYYYMMDDHHmmss[Z]');

export const getDateEvent = (date: string): Date =>
	new Date(moment.utc(date, 'YYYYMMDDHHmmss[Z]').local().valueOf());

export const startOfDate = (date: string): string =>
	moment.utc(date, 'YYYYMMDDHHmmss[Z]').local().startOf('day').utc().format('YYYYMMDDHHmmss[Z]');

export const endOfDate = (date: string): string =>
	moment.utc(date, 'YYYYMMDDHHmmss[Z]').local().endOf('day').utc().format('YYYYMMDDHHmmss[Z]');
