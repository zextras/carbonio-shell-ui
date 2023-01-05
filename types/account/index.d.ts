/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { DARK_READER_PROP_KEY, SHELL_APP_ID } from '../../src/constants';
import { DarkReaderPropValues } from '../misc';

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

export function isZappDarkreaderModeZimletProp(
	prop: ZimletProp
): ZimletProp is ZappDarkreaderModeZimletProp {
	return prop.name === DARK_READER_PROP_KEY && prop.zimlet === SHELL_APP_ID;
}

export type SoapFetch = <Request, Response>(
	api: string,
	body: Request,
	account?: string
) => Promise<Response>;

export type AccountState = {
	authenticated: boolean;
	account?: Account;
	settings: AccountSettings;
	zimbraVersion?: string;
	usedQuota: number;
};

export type Account = {
	// apps: Array<AppPkgDescription>;
	id: string;
	name: string;
	displayName: string;
	//	settings: AccountSettings;
	signatures: { signature: Array<unknown> };
	identities: any;
	rights: AccountRights;
};

export type DelegateProps = {
	email: string;
	right: string;
};

export type AccountSettings = {
	attrs: Record<string, string | number>;
	prefs: Record<string, string | number>;
	props: Array<ZimletProp>;
};

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
