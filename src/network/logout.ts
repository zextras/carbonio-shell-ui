/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { SHELL_APP_ID } from '../constants';
import { getSoapFetch } from './fetch';
import { goTo, goToLogin } from './utils';
import { useLoginConfigStore } from '../store/login/store';

export function logout(): Promise<void> {
	return getSoapFetch(SHELL_APP_ID)('EndSession', {
		_jsns: 'urn:zimbraAccount',
		logoff: true
	})
		.then(() => fetch('/?loginOp=logout', { redirect: 'manual' }))
		.then(() => {
			const customLogoutUrl = useLoginConfigStore.getState().carbonioWebUiLogoutURL;
			customLogoutUrl ? goTo(customLogoutUrl) : goToLogin();
		});
}
