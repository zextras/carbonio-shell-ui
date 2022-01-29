/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { SHELL_APP_ID } from '../constants';
import { useAccountStore } from '../store/account';
import { goToLogin } from './go-to-login';

export const logout = (): Promise<void> =>
	useAccountStore
		.getState()
		.soapFetch(SHELL_APP_ID)('EndSession', {
			_jsns: 'urn:zimbraAccount'
		})
		.then(() => {
			fetch('/?loginOp=logout')
				.then((res) => res)
				.then(goToLogin);
		});
