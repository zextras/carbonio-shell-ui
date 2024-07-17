/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { produce } from 'immer';

import { LOGGED_USER } from './constants';
import { useAccountStore } from '../store/account';
import type {
	Account,
	AccountSettingsAttrs,
	AccountSettingsPrefs,
	Identity,
	IdentityAttrs,
	ZimletProp
} from '../types/account';

export const mockedAccount: Account = {
	name: LOGGED_USER.name,
	rights: { targets: [] },
	signatures: { signature: [] },
	id: LOGGED_USER.id,
	displayName: LOGGED_USER.attrs.displayName,
	identities: LOGGED_USER.identities
};

type SetupAccountStoreSettings = {
	account?: Account;
	accountSettingsPrefs?: AccountSettingsPrefs;
	accountSettingsProps?: Array<ZimletProp>;
	accountSettingsAttrs?: AccountSettingsAttrs;
};

export function setupAccountStore({
	account = mockedAccount,
	accountSettingsPrefs = {},
	accountSettingsProps = [],
	accountSettingsAttrs = { zimbraIdentityMaxNumEntries: 20 }
}: SetupAccountStoreSettings = {}): void {
	useAccountStore.setState(
		produce((state) => {
			state.account = account;
			state.settings.attrs = accountSettingsAttrs;
			state.settings.prefs = accountSettingsPrefs;
			state.settings.props = accountSettingsProps;
		})
	);
}

export function createAccount(name: string, id: string, identities: Array<Identity>): Account {
	return {
		name,
		rights: { targets: [] },
		signatures: { signature: [] },
		id,
		displayName: '',
		identities: {
			identity: identities
		}
	};
}

export function createIdentityAttrs(
	zimbraPrefIdentityId: IdentityAttrs['zimbraPrefIdentityId'],
	zimbraPrefIdentityName: IdentityAttrs['zimbraPrefIdentityName'],
	zimbraPrefFromAddress: IdentityAttrs['zimbraPrefFromAddress'],
	zimbraPrefFromDisplay: IdentityAttrs['zimbraPrefFromDisplay'] = ''
): IdentityAttrs {
	const _attrs: IdentityAttrs = {
		zimbraPrefReplyToEnabled: 'FALSE',
		zimbraPrefFromDisplay,
		zimbraPrefFromAddressType: 'sendAs',
		zimbraPrefIdentityId,
		zimbraPrefIdentityName,
		zimbraPrefFromAddress
	};

	return _attrs;
}

export function createIdentity(
	prefs: {
		zimbraPrefIdentityId: NonNullable<IdentityAttrs['zimbraPrefIdentityId']>;
		zimbraPrefIdentityName: IdentityAttrs['zimbraPrefIdentityName'];
		zimbraPrefFromAddress: IdentityAttrs['zimbraPrefFromAddress'];
		zimbraPrefFromDisplay?: IdentityAttrs['zimbraPrefFromDisplay'];
	},
	isDefault: boolean
): Identity {
	return {
		id: prefs.zimbraPrefIdentityId,
		_attrs: createIdentityAttrs(
			prefs.zimbraPrefIdentityId,
			prefs.zimbraPrefIdentityName,
			prefs.zimbraPrefFromAddress,
			prefs.zimbraPrefFromDisplay
		),
		name: isDefault ? 'DEFAULT' : prefs.zimbraPrefIdentityName
	};
}
