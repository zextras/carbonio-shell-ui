/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import type { AccountACEInfo } from './entities';
import type { SoapBody, SoapContext } from './soap';
import type { JSNS } from '../../constants';
import type { Exactify, RequireAtLeastOne, ValueOf } from '../../utils/typeUtils';
import type {
	AccountRights,
	AccountSettingsPrefs,
	Identity,
	IdentityAttrs,
	ZimletProp
} from '../account';

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
		signature: Array<unknown>;
	};
	identities: {
		identity: Array<Identity>;
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

export type AttrsMods = Record<string, unknown>;

export interface Mods extends Record<string, Record<string, unknown> | undefined> {
	props?: PropsMods;
	prefs?: PrefsMods;
	attrs?: AttrsMods;
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
	noOpTimeout?: NodeJS.Timeout;
	pollingInterval: number;
	seq: number;
};

export type ModifyPrefsRequest = SoapBody<{
	_attrs: AccountSettingsPrefs;
}>;

export type CreateIdentityRequest = SoapBody<{
	identity: {
		name?: string;
		_attrs: IdentityAttrs;
	};
}>;

export type ModifyIdentityRequest = SoapBody<{
	identity: {
		_attrs?: IdentityAttrs;
	} & RequireAtLeastOne<Pick<Identity, 'id' | 'name'>>;
}>;

export type DeleteIdentityRequest = SoapBody<{
	identity: { name?: string; id?: string };
	requestId?: string;
}>;

export type ModifyPropertiesRequest = SoapBody<{
	prop: Array<{ name: string; zimlet: string; _content: unknown }>;
}>;

export type BatchRequest<
	T extends Exactify<Record<`${string}Request`, unknown>, T> = Record<`${string}Request`, unknown>
> = SoapBody<T>;

export type BatchResponse<
	T extends Exactify<Record<`${string}Response`, unknown>, T> = Record<`${string}Response`, unknown>
> = SoapBody<T>;

export type NameSpace = ValueOf<typeof JSNS>;
