/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import type { DELEGATED_SEND_SAVE_TARGET } from '../../constants';
import type { StringOfLength } from '../../utils/typeUtils';

export interface ZimletProp {
	name: string;
	zimlet: string;
	_content: string;
}

export type AccountState = {
	authenticated: boolean;
	account?: Account;
	settings: AccountSettings;
	zimbraVersion?: string;
	usedQuota: number;
};

export interface Identity {
	/** Identity name */
	name?: string;
	/** Identity ID */
	id: string;
	/** Attributes */
	_attrs: IdentityAttrs;
}

export type Account = {
	id: string;
	name: string;
	displayName: string;
	signatures: { signature: Array<unknown> };
	identities: { identity: Array<Identity> };
	rights: AccountRights;
};

export type BooleanString = 'TRUE' | 'FALSE';

type GeneralizedTimeObj = {
	year: `${number}` & StringOfLength<4>;
	month: `${number}` & StringOfLength<2>;
	date: `${number}` & StringOfLength<2>;
	hour: `${number}` & StringOfLength<2>;
	min: `${number}` & StringOfLength<2>;
	sec: `${number}` & StringOfLength<2>;
	ms: (`.${number}` & StringOfLength<4>) | '';
	timezone: 'Z' | '';
};

/**
 * A GeneralizedTime is a string representing a date in UTC with the format YYYYMMDDHHmmss[.SSS][Z]
 */
export type GeneralizedTime =
	`${GeneralizedTimeObj['year']}${GeneralizedTimeObj['month']}${GeneralizedTimeObj['date']}${GeneralizedTimeObj['hour']}${GeneralizedTimeObj['min']}${GeneralizedTimeObj['sec']}${GeneralizedTimeObj['ms']}${GeneralizedTimeObj['timezone']}`;

export type DurationUnit = 'd' | 'h' | 'm' | 's' | 'ms';

export type Duration = `${number}${DurationUnit | ''}`;

export interface AccountSettingsPrefs {
	zimbraPrefOutOfOfficeExternalReply?: string;
	zimbraPrefOutOfOfficeReply?: string;
	zimbraPrefOutOfOfficeReplyEnabled?: BooleanString;
	zimbraPrefOutOfOfficeExternalReplyEnabled?: BooleanString;
	zimbraPrefExternalSendersType?: 'ALL' | 'ALLNOTINAB' | 'INAB' | 'INSD';
	zimbraPrefOutOfOfficeSuppressExternalReply?: BooleanString;
	zimbraPrefOutOfOfficeFreeBusyStatus?: 'BUSY' | 'OUTOFOFFICE';
	zimbraPrefOutOfOfficeStatusAlertOnLogin?: BooleanString;
	zimbraPrefIncludeSharedItemsInSearch?: BooleanString;
	zimbraPrefIncludeSpamInSearch?: BooleanString;
	zimbraPrefIncludeTrashInSearch?: BooleanString;
	zimbraPrefOutOfOfficeFromDate?: GeneralizedTime;
	zimbraPrefOutOfOfficeUntilDate?: GeneralizedTime;
	zimbraPrefHtmlEditorDefaultFontColor?: string;
	zimbraPrefHtmlEditorDefaultFontFamily?: string;
	zimbraPrefHtmlEditorDefaultFontSize?: string;
	zimbraPrefLocale?: string;
	zimbraPrefMailPollingInterval?: Duration;
	zimbraPrefMailTrustedSenderList?: Array<string> | string;
	zimbraPrefDelegatedSendSaveTarget?: (typeof DELEGATED_SEND_SAVE_TARGET)[number];
	/**
	 * @deprecated the timezone preference is going to be removed, because now we rely on the system timezone.
	 */
	zimbraPrefTimeZoneId?: string;
	carbonioPrefSendAnalytics?: BooleanString;
	[key: string]: string | number | Array<string | number> | undefined;
}

export type AccountSettingsAttrs = {
	zimbraFeatureOptionsEnabled?: BooleanString;
	zimbraIdentityMaxNumEntries?: number;
	[key: string]: string | number | Array<string | number> | undefined;
};

export type AccountSettings = {
	attrs: AccountSettingsAttrs;
	prefs: AccountSettingsPrefs;
	props: Array<ZimletProp>;
};

export interface IdentityAttrs {
	/** default mail signature for account/identity/dataSource */
	zimbraPrefDefaultSignatureId?: string;
	zimbraPrefForwardReplyFormat?: `'text' | 'html' | 'same'`;
	/** forward/reply signature id for account/identity/dataSource */
	zimbraPrefForwardReplySignatureId?: string;
	/** email address to put in from header.  Deprecated on data source as of bug 67068. */
	zimbraPrefFromAddress?: string;
	/** Type of the email address from header. (sendAs or sendOnBehalfOf)  */
	zimbraPrefFromAddressType?: 'sendAs' | 'sendOnBehalfOf';
	/** personal part of email address put in from header */
	zimbraPrefFromDisplay?: string;
	zimbraPrefIdentityId?: string;
	/** name of the identity */
	zimbraPrefIdentityName?: string;
	zimbraPrefMailSignatureStyle?: 'outlook' | 'internet';
	/** address to put in reply-to header */
	zimbraPrefReplyToAddress?: string;
	/** personal part of email address put in reply-to header */
	zimbraPrefReplyToDisplay?: string;
	/** TRUE if we should set a reply-to header */
	zimbraPrefReplyToEnabled?: BooleanString;
	/** name of folder to save sent mail in (deprecatedSince 5.0 in identity) */
	zimbraPrefSentMailFolder?: string;
	zimbraPrefWhenInFolderIds?: Array<string | null>;
	/** TRUE if we should look at zimbraPrefWhenInFolderIds (deprecatedSince 5.0 in account) */
	zimbraPrefWhenInFoldersEnabled?: BooleanString;
	/** addresses that we will look at to see if we should use an identity (deprecatedSince 5.0 in account) */
	zimbraPrefWhenSentToAddresses?: Array<string | null>;
	/** TRUE if we should look at zimbraPrefWhenSentToAddresses (deprecatedSince 5.0 in account) */
	zimbraPrefWhenSentToEnabled?: BooleanString;
	/** whether or not to save outgoing mail (deprecatedSince 5.0 in identity) */
	zimbraPrefSaveToSent?: BooleanString;
}

export type AccountRightTargetEmail = {
	addr: string;
};

export type AccountRightTarget = {
	d: string;
	id: string;
	name: string;
	type: string;
	email: Array<AccountRightTargetEmail>;
};

export type AccountRightName =
	| 'sendAs'
	| 'sendAsDistList'
	| 'viewFreeBusy'
	| 'sendOnBehalfOf'
	| 'sendOnBehalfOfDistList';
export type AccountRights = {
	targets: Array<{
		right: AccountRightName;
		target: Array<AccountRightTarget>;
	}>;
};
