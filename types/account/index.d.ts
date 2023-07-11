/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import type { DarkReaderPropValues } from '../misc';
import { DARK_READER_PROP_KEY, DELEGATED_SEND_SAVE_TARGET } from '../../src/constants';
import type { SHELL_APP_ID } from '../exports';
import { StringOfLength } from '../../src/utils/typeUtils';

export interface ZimletProp {
	name: string;
	zimlet: string;
	_content: string;
}

export interface ZappDarkreaderModeZimletProp extends ZimletProp {
	name: typeof DARK_READER_PROP_KEY;
	zimlet: SHELL_APP_ID;
	_content: DarkReaderPropValues;
}

export type SoapFetch = <Request, Response>(
	api: string,
	body: Request,
	account?: string,
	signal?: AbortSignal
) => Promise<Response>;

export type AccountState = {
	authenticated: boolean;
	account?: Account;
	settings: AccountSettings;
	zimbraVersion?: string;
	usedQuota: number;
};

export type Account = {
	id: string;
	name: string;
	displayName: string;
	signatures: { signature: Array<unknown> };
	identities: { identity: Array<{ id: string; name?: string; _attrs?: Partial<IdentityAttrs> }> };
	rights: AccountRights;
};

export type DelegateProps = {
	email: string;
	right: string;
};

export type BooleanString = 'TRUE' | 'FALSE';

type GenTimeObj = {
	year: `${number}` & StringOfLength<4>;
	month: `${number}` & StringOfLength<2>;
	date: `${number}` & StringOfLength<2>;
	hour: `${number}` & StringOfLength<2>;
	min: `${number}` & StringOfLength<2>;
	sec: `${number}` & StringOfLength<2>;
	ms: (`.${number}` & StringOfLength<4>) | '';
	timezone: 'Z' | '';
};

export type GeneralizedTime =
	`${GenTimeObj['year']}${GenTimeObj['month']}${GenTimeObj['date']}${GenTimeObj['hour']}${GenTimeObj['min']}${GenTimeObj['sec']}${GenTimeObj['ms']}${GenTimeObj['timezone']}`;

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
	zimbraPrefDelegatedSendSaveTarget?: typeof DELEGATED_SEND_SAVE_TARGET[number];
	zimbraPrefTimeZoneId?: Array<string> | string;
	[key: string]: string | number | Array<string | number>;
}

export type AccountSettingsAttrs = {
	zimbraIdentityMaxNumEntries?: number;
	[key: string]: string | number | Array<string | number>;
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
	zimbraPrefFromAddressType: 'sendAs' | 'sendOnBehalfOf';
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
