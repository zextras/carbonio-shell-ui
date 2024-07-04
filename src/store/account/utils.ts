/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { filter, find, findIndex, reduce } from 'lodash';

import type {
	AccountSettingsAttrs,
	AccountSettingsPrefs,
	AccountState,
	Identity,
	ZimletProp
} from '../../types/account';
import type { IdentityMods, PropsMods } from '../../types/network';

export function mergePrefs(
	mods: AccountSettingsPrefs | undefined,
	state: AccountState
): AccountSettingsPrefs {
	return reduce(
		mods,
		(acc, pref, key) => ({
			...acc,
			[key]: pref
		}),
		state.settings.prefs
	);
}

export function mergeProps(mods: PropsMods | undefined, state: AccountState): Array<ZimletProp> {
	return reduce(
		mods,
		(acc, { app, value }, key) => {
			const newPropValue = {
				name: key,
				zimlet: app,
				_content: value as string
			};
			const propIndex = findIndex(acc, (p) => p.name === key && p.zimlet === app);
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
	return reduce(
		mods,
		(acc, attr, key) => ({
			...acc,
			[key]: attr
		}),
		state.settings.attrs
	);
}

export function updateIdentities(
	state: AccountState,
	identityMods: IdentityMods,
	identities: Identity[]
): Identity[] | undefined {
	if (!state.account) {
		return undefined;
	}

	const sortedAndFilteredIdentities = [
		...filter(
			state.account.identities.identity,
			(item) => !identityMods?.deleteList?.includes(item.id)
		).filter((i) => i.name !== 'DEFAULT'),
		...identities,
		...filter(
			state.account.identities.identity,
			(item) => !identityMods?.deleteList?.includes(item.id)
		).filter((i) => i.name === 'DEFAULT')
	];

	if (!identityMods?.modifyList) {
		return sortedAndFilteredIdentities;
	}

	return sortedAndFilteredIdentities.map((identity) => {
		const identityMod = find(identityMods.modifyList, (mod) => mod.id === identity.id);
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
