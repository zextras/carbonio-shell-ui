/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { AccountRights, ZimletProp } from '../account';
import { Tag } from '../tags';
import { AccountACEInfo, Identity } from './entities';

export * from './soap';

export type ZimletPkgDescription = {
	zimlet: Array<{
		name: string;
		label: string;
		description: string;
		version: string;
		/* Property related to Zextras */ zapp?: 'true';
		/* Property related to Zextras */ 'zapp-main'?: string;
		/* Property related to Zextras */ 'zapp-version'?: string;
		/* Property related to Zextras */ 'zapp-handlers'?: string;
		/* Property related to Zextras */ 'zapp-style'?: string;
		/* Property related to Zextras */ 'zapp-theme'?: string;
		/* Property related to Zextras */ 'zapp-serviceworker-extension'?: string;
	}>;
	zimletContext: Array<{
		baseUrl: string;
		presence: 'enabled';
		priority: number;
	}>;
};

export type GetInfoResponse = {
	name: string;
	id: string;
	attrs: {
		_attrs: {
			displayName: string;
		};
	};
	prefs: {
		_attrs: Record<string, string>;
	};
	signatures: {
		signature: Array<any>;
	};
	identities: {
		identity: Array<any>;
	};
	zimlets: {
		zimlet: Array<ZimletPkgDescription>;
	};
	props: {
		prop: Array<ZimletProp>;
	};
	version: string;
	rights: AccountRights;
};

export type PropsMods = Record<string, { app: string; value: unknown }>;

export type PermissionsMods = {
	freeBusy: {
		current: AccountACEInfo[];
		new: AccountACEInfo;
	};
	inviteRight: {
		current: AccountACEInfo[];
		new: AccountACEInfo;
	};
};

export type CreateIdentityProps = {
	requestId: number;
	/** name of the identity */
	zimbraPrefIdentityName: string | undefined;
	/** personal part of email address put in from header */
	zimbraPrefFromDisplay: string | undefined;
	/** email address to put in from header.  Deprecated on data source as of bug 67068. */
	zimbraPrefFromAddress: string | undefined;
	/** Type of the email address from header. (sendAs or sendOnBehalfOf)  */
	zimbraPrefFromAddressType: 'sendAs' | 'sendOnBehalfOf';
	/** TRUE if we should set a reply-to header */
	// TODO: update to boolean?
	zimbraPrefReplyToEnabled: 'TRUE' | 'FALSE' | undefined;
	/** personal part of email address put in reply-to header */
	zimbraPrefReplyToDisplay: string | undefined;
	/** address to put in reply-to header */
	zimbraPrefReplyToAddress: string | undefined;
	/** default mail signature for account/identity/dataSource */
	zimbraPrefDefaultSignatureId: string | undefined;
	/** forward/reply signature id for account/identity/dataSource */
	zimbraPrefForwardReplySignatureId: string | undefined;
	/** TRUE if we should look at zimbraPrefWhenSentToAddresses (deprecatedSince 5.0 in account) */
	zimbraPrefWhenSentToEnabled: string | undefined;
	/** TRUE if we should look at zimbraPrefWhenInFolderIds (deprecatedSince 5.0 in account) */
	zimbraPrefWhenInFoldersEnabled: string | undefined;
};

export type CreateIdentityResponse = {
	identity: [Identity];
};
export type ModifyIdentityResponse = Record<string, never>;
export type DeleteIdentityResponse = Record<string, never>;
export type ModifyPropertiesResponse = Record<string, never>;
export type ModifyPrefsResponse = Record<string, never>;
export type RevokeRightsResponse = {
	ace?: AccountACEInfo[];
};
export type GrantRightsResponse = {
	ace?: AccountACEInfo[];
};

export type IdentityMods = {
	modifyList?: Record<string, { id: string; prefs: Record<string, string | boolean> }>;
	deleteList?: string[];
	createList?: { prefs: CreateIdentityProps }[];
};

export type PrefsMods = Record<string, string | number | boolean>;

export type Mods = {
	props?: PropsMods;
	prefs?: PrefsMods;
	permissions?: PermissionsMods;
	identity?: IdentityMods;
};

export type AddMod = (
	type: keyof Mods,
	key: keyof NonNullable<Mods[type]>,
	value: NonNullable<Mods[keyof Mods]>[typeof key]
) => void;

export type Locale = {
	id: string;
	localName: string;
	name: string;
};
export type AvailableLocalesResponse = {
	locale: Array<Locale>;
};

export type NetworkState = SoapContext & {
	noOpTimeout?: Timeout;
	pollingInterval: number;
	seq: number;
};

export type CreateTagRequest = {
	tag: Omit<Tag, id>;
	_jsns: string;
};

export type CreateTagResponse = {
	tag: [Tag];
};

export type TagActionRequest = {
	_jsns: string;
	action: {
		op: 'rename' | 'color' | 'delete' | 'update';
		id: string;
		name?: string;
		color?: number;
		rgb?: string;
	};
};
export type TagActionResponse = {
	action: { op: string; id: string };
	_jsns: string;
};
