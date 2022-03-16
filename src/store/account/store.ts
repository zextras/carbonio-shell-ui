/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import create, { StoreApi, UseBoundStore } from 'zustand';
import { AccountState } from '../../../types';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const useAccountStore = create<AccountState>(() => ({
	account: undefined,
	version: '',
	settings: {
		prefs: {},
		attrs: {},
		props: []
	},
	usedQuota: 0,
	lastNotificationTime: Date.now()
})) as UseBoundStore<AccountState, StoreApi<AccountState>>;
