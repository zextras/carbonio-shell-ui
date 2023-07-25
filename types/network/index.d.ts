/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { AccountACEInfo } from './entities';
import {
	AccountRights,
	AccountSettings,
	AccountSettingsPrefs,
	IdentityAttrs,
	ZimletProp
} from '../account';
import { Tag } from '../tags';

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
		_attrs: AccountSettingsPrefs;
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
// TODO remove
/**
 * @deprecated
 */
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
	modifyList?: Record<string, { id: string; prefs: Partial<IdentityAttrs> }>;
	deleteList?: string[];
	createList?: { prefs: Partial<IdentityAttrs> }[];
};

export type PrefsMods = Record<string, unknown> & AccountSettingsPrefs;

export interface Mods extends Record<string, Record<string, unknown>>, Partial<AccountSettings> {
	props?: PropsMods;
	prefs?: PrefsMods;
	permissions?: PermissionsMods;
	identity?: IdentityMods;
}

export type AddMod = <
	ModsType extends keyof Mods = keyof Mods,
	TypeKey extends keyof NonNullable<Mods[ModsType]> = keyof NonNullable<Mods[ModsType]>
>(
	type: ModsType,
	key: TypeKey,
	value: NonNullable<Mods[ModsType]>[TypeKey]
) => void;

export type RemoveMod = (type: keyof Mods, key: keyof NonNullable<Mods[typeof type]>) => void;

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

export type ModifyPrefsRequest = {
	_jsns: NameSpace;
	_attrs: AccountSettingsPrefs;
};

export type CreateIdentityRequest = {
	_jsns: NameSpace;
	identity: {
		name?: string;
		_attrs: IdentityAttrs;
	};
};

export type ModifyIdentityRequest = {
	_jsns: NameSpace;
	identity: {
		_attrs?: Partial<IdentityAttrs>;
	} & RequireAtLeastOne<Pick<Identity, 'id' | 'name'>>;
};

export type DeleteIdentityRequest = {
	identity: { name?: string; id?: string };
	_jsns: NameSpace;
	requestId?: string;
};

export type ModifyPropertiesRequest = {
	_jsns: NameSpace;
	prop: Array<{ name: string; zimlet: string; _content: unknown }>;
};

export type BatchRequest = {
	ModifyIdentityRequest?: Array<ModifyIdentityRequest>;
	CreateIdentityRequest?: Array<CreateIdentityRequest>;
	DeleteIdentityRequest?: Array<DeleteIdentityRequest>;
	ModifyPrefsRequest?: ModifyPrefsRequest;
	ModifyPropertiesRequest?: ModifyPropertiesRequest;
	_jsns: NameSpace;
};

export type GetRightsRequest = {
	ace?: Array<{ right: Right }>;
	_jsns: NameSpace;
};

export type Right =
	// Following rights are partial, they are the result of
	// description: automatically add meeting invites from grantee to the target's calendar
	// right type: preset
	// target type(s): account
	// grant target type: (default)
	// right class: USER
	| 'invite'
	// description: login as another user.  Currently this is only honored for imap/pop3 login.
	// right type: preset
	// target type(s): account
	// grant target type: (default)
	// right class: USER
	| 'loginAs'
	// description: reply to messages in a shared folder as the owner of the folder
	// right type: preset
	// target type(s): account
	// grant target type: account
	// right class: USER
	| 'sendAs'
	// description: send messages on behalf of the grantor
	// right type: preset
	// target type(s): account
	// grant target type: account
	// right class: USER
	| 'sendOnBehalfOf'
	// description: view free/busy
	// right type: preset
	// target type(s): account
	// grant target type: (default)
	// right class: USER
	| 'viewFreeBusy';

export type NameSpace = 'urn:zimbraMail' | 'urn:zimbraAccount' | 'urn:zimbra';

// The type of grantee:
export type GranteeType =
	// usr - Zimbra user
	| 'usr'
	// grp - Zimbra group(distribution list)
	| 'grp'
	// an external AD group
	| 'egp'
	// all - all authenticated users
	| 'all'
	// Zimbra Domain
	| 'dom'
	// non-Zimbra domain (used with sendToDistList right)
	| 'edom'
	// gst - non-Zimbra email address and password (not yet supported)
	| 'gst'
	// key - external user with an accesskey
	| 'key'
	// pub - public authenticated and unauthenticated access
	| 'pub'
	// Pseudo grantee type.  Granting code will map to usr/grp/egp or gst
	| 'email';

export interface Identity {
	/** Identity name */
	name?: string;
	/** Identity ID */
	id: string;
	/** Attributes */
	_attrs?: Partial<IdentityAttrs>;
}
