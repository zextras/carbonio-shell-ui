/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import type { AccountSettingsPrefs } from '@zextras/carbonio-ui-soap-lib';

import type { SoapBody, SoapFault } from './soap';
import type { JSNS } from '../../constants';
import type { Exactify, RequireAtLeastOne, ValueOf } from '../../utils/typeUtils';
import type { Identity, IdentityAttrs } from '../account';

export * from './soap';

export type PropsMods = Record<string, { app: string; value: unknown }>;

export type CreateIdentityResponse = {
	identity: [Identity];
};
export type ModifyIdentityResponse = Record<string, never>;
export type DeleteIdentityResponse = Record<string, never>;
export type ModifyPropertiesResponse = Record<string, never>;
export type ModifyPrefsResponse = Record<string, never>;

export type IdentityMods = {
	modifyList?: Record<string, { id: string; prefs: Partial<IdentityAttrs> }>;
	deleteList?: string[];
	createList?: { prefs: Partial<IdentityAttrs> }[];
};

export type PrefsMods = Record<string, unknown> & AccountSettingsPrefs;

export interface Mods extends Record<string, Record<string, unknown> | undefined> {
	props?: PropsMods;
	prefs?: PrefsMods;
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

export type ModifyPrefsRequest = SoapBody<{
	_attrs: AccountSettingsPrefs;
}>;

export type CreateIdentityRequest = SoapBody<{
	identity: {
		name?: string;
		_attrs: IdentityAttrs;
	};
	requestId?: string;
}>;

export type ModifyIdentityRequest = SoapBody<{
	identity: {
		_attrs?: IdentityAttrs;
	} & RequireAtLeastOne<Pick<Identity, 'id' | 'name'>>;
	requestId?: string;
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
> = SoapBody<T> & { Fault?: SoapFault[] };

export type NameSpace = ValueOf<typeof JSNS>;
