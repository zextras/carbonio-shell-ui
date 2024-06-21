/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { find } from 'lodash';

import { useAccountStore } from './store';
import { mergeAttrs, mergePrefs, mergeProps, updateIdentities } from './utils';
import type { Account, UpdateAccount, UpdateSettings } from '../../types/account';

export const updateSettings: UpdateSettings = (settingsMods) =>
	useAccountStore.setState((state) => ({
		...state,
		settings: {
			attrs: mergeAttrs(settingsMods, state),
			prefs: mergePrefs(settingsMods, state),
			props: mergeProps(settingsMods, state)
		}
	}));

export const updateAccount: UpdateAccount = (accountMods, response) =>
	useAccountStore.setState((state) => ({
		...state,
		account: {
			...state.account,
			displayName:
				find(accountMods?.identity?.modifyList, (item) => item.id === state?.account?.id)?.prefs
					.zimbraPrefIdentityName || state.account?.displayName,
			identities: {
				identity: updateIdentities(state, accountMods, response)
			}
		} as Account
	}));
