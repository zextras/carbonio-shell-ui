/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import create from 'zustand';
import { AccountState } from '../../../types';

export const useAccountStore = create<AccountState>(() => ({
	authenticated: false,
	account: undefined,
	version: '',
	settings: {
		prefs: {},
		attrs: {},
		props: []
	},
	usedQuota: 0,
	lastNotificationTime: Date.now()
}));
