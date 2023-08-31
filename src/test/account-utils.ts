/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { produce } from 'immer';

import { LOGGED_USER } from './constants';
import { Account } from '../../types';
import { useAccountStore } from '../store/account';

export const mockedAccount: Account = {
	name: LOGGED_USER.name,
	rights: { targets: [] },
	signatures: { signature: [] },
	id: LOGGED_USER.id,
	displayName: LOGGED_USER.attrs.displayName,
	identities: LOGGED_USER.identities
};

export function setupAccountStore(account = mockedAccount): void {
	useAccountStore.setState(
		produce((state) => {
			state.account = account;
		})
	);
}
