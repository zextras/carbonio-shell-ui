/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { filter, findIndex, map, reduce } from 'lodash';

import type { EditSettingsBatchResponse } from '../../network/edit-settings';
import type {
	AccountSettingsAttrs,
	AccountSettingsPrefs,
	AccountState,
	Identity,
	ZimletProp
} from '../../types/account';
import type { Mods } from '../../types/network';

export function mergePrefs(mods: Partial<Mods>, state: AccountState): AccountSettingsPrefs {
	return reduce(
		mods.prefs,
		(acc, pref, key) => ({
			...acc,
			[key]: pref
		}),
		state.settings.prefs
	);
}

export function mergeProps(mods: Partial<Mods>, state: AccountState): Array<ZimletProp> {
	return reduce(
		mods.props,
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

export function mergeAttrs(mods: Partial<Mods>, state: AccountState): AccountSettingsAttrs {
	return reduce(
		mods.attrs,
		(acc, attr, key) => ({
			...acc,
			[key]: attr as string
		}),
		state.settings.attrs
	);
}

export function updateIdentities(
	state: AccountState,
	accountMods: Partial<Mods>,
	response: EditSettingsBatchResponse
): Identity[] | undefined {
	return typeof state.account !== 'undefined'
		? reduce(
				accountMods?.identity?.modifyList,
				(acc, { id, prefs }) => {
					const propIndex = findIndex(acc, (itemMods, indexAccount) => acc[indexAccount].id === id);
					if (propIndex > -1) {
						// eslint-disable-next-line no-param-reassign
						acc[propIndex]._attrs = {
							...acc[propIndex]._attrs,
							...prefs
						};
						if (prefs.zimbraPrefIdentityName && acc[propIndex].name !== 'DEFAULT') {
							// eslint-disable-next-line no-param-reassign
							acc[propIndex].name = prefs.zimbraPrefIdentityName;
						}
					}
					return acc;
				},
				[
					...filter(
						state.account.identities.identity,
						(item) => !accountMods?.identity?.deleteList?.includes(item.id)
					).filter((i) => i.name !== 'DEFAULT'),
					...map(response?.CreateIdentityResponse, (item) => item.identity[0]),
					...filter(
						state.account.identities.identity,
						(item) => !accountMods?.identity?.deleteList?.includes(item.id)
					).filter((i) => i.name === 'DEFAULT')
				]
			)
		: undefined;
}
