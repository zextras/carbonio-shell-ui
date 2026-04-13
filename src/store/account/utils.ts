/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import type { AccountSettingsPrefs } from '@zextras/carbonio-ui-soap-lib';

import type { AccountSettingsAttrs, AccountState, Identity, ZimletProp } from '../../types/account';
import type { IdentityMods, PropsMods } from '../../types/network';

export function mergePrefs(
	mods: AccountSettingsPrefs | undefined,
	state: AccountState
): AccountSettingsPrefs {
	return Object.entries(mods ?? {}).reduce<AccountSettingsPrefs>(
		(acc, [key, pref]) => ({
			...acc,
			[key]: pref
		}),
		state.settings.prefs
	);
}

export function mergeProps(mods: PropsMods | undefined, state: AccountState): Array<ZimletProp> {
	return Object.entries(mods ?? {}).reduce<Array<ZimletProp>>(
		(acc, [key, { app, value }]) => {
			const newPropValue = {
				name: key,
				zimlet: app,
				_content: value as string
			};
			const propIndex = acc.findIndex((p) => p.name === key && p.zimlet === app);
			if (propIndex >= 0) {
				return acc.map((prop, index) => (propIndex === index ? newPropValue : prop));
			}
			return [...acc, newPropValue];
		},
		state.settings.props
	);
}

export function mergeAttrs(
	mods: AccountSettingsAttrs | undefined,
	state: AccountState
): AccountSettingsAttrs {
	return Object.entries(mods ?? {}).reduce<AccountSettingsAttrs>(
		(acc, [key, attr]) => ({
			...acc,
			[key]: attr
		}),
		state.settings.attrs
	);
}

export function updateIdentities(
	state: AccountState,
	identityMods: IdentityMods,
	newIdentities: Identity[]
): Identity[] | undefined {
	if (!state.account) {
		return undefined;
	}

	const sortedAndFilteredIdentities = [
		...state.account.identities.identity
			.filter((item) => !identityMods?.deleteList?.includes(item.id))
			.filter((i) => i.name !== 'DEFAULT'),
		...newIdentities,
		...state.account.identities.identity
			.filter((item) => !identityMods?.deleteList?.includes(item.id))
			.filter((i) => i.name === 'DEFAULT')
	];

	if (!identityMods?.modifyList) {
		return sortedAndFilteredIdentities;
	}

	return sortedAndFilteredIdentities.map((identity) => {
		const identityMod = identityMods.modifyList
			? Object.values(identityMods.modifyList).find((mod) => mod.id === identity.id)
			: undefined;
		if (!identityMod) {
			return identity;
		}

		return {
			...identity,
			_attrs: {
				...identity._attrs,
				...identityMod.prefs
			},
			...(identityMod.prefs.zimbraPrefIdentityName && identity.name !== 'DEFAULT'
				? { name: identityMod.prefs.zimbraPrefIdentityName }
				: {})
		};
	});
}
