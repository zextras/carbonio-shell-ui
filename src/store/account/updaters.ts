/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { find } from 'lodash';

import { useAccountStore } from './store';
import { mergeAttrs, mergePrefs, mergeProps, updateIdentities } from './utils';
import type { AccountSettingsAttrs, AccountSettingsPrefs, Identity } from '../../types/account';
import type { IdentityMods } from '../../types/network';

type UpdateSettingsParams = {
	attrs?: AccountSettingsAttrs;
	prefs?: AccountSettingsPrefs;
	props?: Record<string, { app: string; value: unknown }>;
};

export type UpdateSettings = (settingsMods: UpdateSettingsParams) => void;
export type UpdateAccount = (accountMods: IdentityMods, identities: Identity[]) => void;

export const updateSettings: UpdateSettings = (settingsMods) =>
	useAccountStore.setState((state) => ({
		...state,
		settings: {
			attrs: mergeAttrs(settingsMods.attrs, state),
			prefs: mergePrefs(settingsMods.prefs, state),
			props: mergeProps(settingsMods.props, state)
		}
	}));

export const updateAccount: UpdateAccount = (identityMods, newIdentities) =>
	useAccountStore.setState((state) =>
		state.account
			? {
					...state,
					account: {
						...state.account,
						displayName:
							find(identityMods?.modifyList, (item) => item.id === state?.account?.id)?.prefs
								.zimbraPrefIdentityName ?? state.account?.displayName,
						identities: {
							identity: updateIdentities(state, identityMods, newIdentities) ?? []
						}
					}
				}
			: state
	);
