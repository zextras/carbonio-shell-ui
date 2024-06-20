/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { findIndex, reduce } from 'lodash';

import { useAccountStore } from './store';
import type {
	AccountSettingsAttrs,
	AccountSettingsPrefs,
	AccountState,
	UpdateSettings,
	ZimletProp
} from '../../types/account';
import type { Mods } from '../../types/network';

function mergePrefs(mods: Partial<Mods>, state: AccountState): AccountSettingsPrefs {
	return reduce(
		mods.prefs,
		(acc, pref, key) => ({
			...acc,
			[key]: pref as string
		}),
		state.settings.prefs
	);
}

function mergeProps(mods: Partial<Mods>, state: AccountState): Array<ZimletProp> {
	return reduce(
		mods.props,
		(acc, { app, value }, key) => {
			const propIndex = findIndex(acc, (p) => p.name === key && p.zimlet === app);
			if (propIndex >= 0) {
				// eslint-disable-next-line no-param-reassign
				acc[propIndex] = {
					name: key,
					zimlet: app,
					_content: value as string
				};
			} else {
				acc.push({
					name: key,
					zimlet: app,
					_content: value as string
				});
			}
			return acc;
		},
		state.settings.props
	);
}

function mergeAttrs(mods: Partial<Mods>, state: AccountState): AccountSettingsAttrs {
	return reduce(
		mods.attrs,
		(acc, attr, key) => ({
			...acc,
			[key]: attr as string
		}),
		state.settings.attrs
	);
}

export const updateSettings: UpdateSettings = (settingsMods) =>
	useAccountStore.setState((state) => ({
		...state,
		settings: {
			attrs: mergeAttrs(settingsMods, state),
			prefs: mergePrefs(settingsMods, state),
			props: mergeProps(settingsMods, state)
		}
	}));
