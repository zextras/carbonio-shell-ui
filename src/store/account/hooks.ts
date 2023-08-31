/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useMemo } from 'react';

import { find, get, join } from 'lodash';

import { useAccountStore } from './store';
import {
	Account,
	AccountRightName,
	AccountRights,
	AccountRightTarget,
	AccountSettings
} from '../../../types';

export const useUserAccount = (): Account => useAccountStore((s) => s.account as Account);
export const useUserAccounts = (): Array<Account> => {
	const acct = useAccountStore((s) => s.account);
	return useMemo(() => (acct ? [acct as Account] : []), [acct]);
};

export const useUserRights = (): AccountRights =>
	useAccountStore((s) => s.account?.rights ?? { targets: [] });

export const useUserRight = (right: AccountRightName): Array<AccountRightTarget> => {
	const { targets } = useUserRights();
	return useMemo(
		() => find(targets, ['right', right])?.target ?? ([] as Array<AccountRightTarget>),
		[right, targets]
	);
};
export const useUserSettings = (): AccountSettings => useAccountStore((s) => s.settings);
export const useUserSetting = <T = void>(...path: Array<string>): string | T =>
	useAccountStore((s) => get(s.settings, join(path, '.')));

export const getUserAccount = (): Account => useAccountStore.getState().account as Account;
export const getUserAccounts = (): Array<Account> => [
	useAccountStore.getState().account as Account
];
export const getUserSettings = (): AccountSettings => useAccountStore.getState().settings;
export const getUserSetting = <T = void>(...path: Array<string>): string | T =>
	get(useAccountStore.getState().settings, join(path, '.'));

export const getUserRights = (): AccountRights =>
	useAccountStore.getState().account?.rights ?? { targets: [] };

export const getUserRight = (right: AccountRightName): Array<AccountRightTarget> =>
	find(getUserRights().targets, ['right', right])?.target ?? ([] as Array<AccountRightTarget>);
