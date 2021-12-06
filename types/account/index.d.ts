/*
 * SPDX-FileCopyrightText: 2021 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { SoapFetch, ZimletProp, AccountRights } from '../network';

export type AccountState = {
	noOpTimeout: unknown;
	account?: Account;
	settings: AccountSettings;
	zimbraVersion: string;
	context: AccountContext;
	init: () => Promise<void>;
	setContext: (context: unknown) => void;
	xmlSoapFetch: (app: string) => SoapFetch;
	soapFetch: (app: string) => SoapFetch;
	tags: Array<Tag>;
	usedQuota: number;
};

export type AccountContext = {
	refresh?: NotifyObject;
	notify?: [NotifyObject];
	change?: { token: number };
	session?: { id: number; _content: number };
};

export type NotifyObject = {
	seq?: number;
	version?: string;
	mbx?: [{ s: number }];
	folder?: Array<unknown>;
};

export type ZextrasModule = {
	commit: string;
	display: string;
	description: string;
	// eslint-disable-next-line camelcase
	js_entrypoint: string;
	name: string;
	priority: number;
	version: string;
	route: string;
};

export type Account = {
	// apps: Array<AppPkgDescription>;
	id: string;
	name: string;
	displayName: string;
	//	settings: AccountSettings;
	signatures: { signature: Array<unknown> };
	identities: { identity: Array<unknown> };
	rights: AccountRights;
};

export type Tag = {
	color?: string;
	id: string;
	name: string;
	rgb?: string;
};

export type AccountSettings = {
	attrs: Record<string, string | number>;
	prefs: Record<string, string | number>;
	props: Array<ZimletProp>;
};

export type AccountRightTarget = {
	d: string;
	id: string;
	name: string;
	type: string;
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
