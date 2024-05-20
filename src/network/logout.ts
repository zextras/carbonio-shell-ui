/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { getSoapFetch } from './fetch';
import { goTo, goToLogin } from './utils';
import { JSNS, SHELL_APP_ID } from '../constants';
import { useLoginConfigStore } from '../store/login/store';

export function logout(): Promise<void> {
	return getSoapFetch(SHELL_APP_ID)('EndSession', {
		_jsns: JSNS.account,
		logoff: true
	})
		.then(() =>
			fetch(useLoginConfigStore.getState().isCarbonioCE === true ? '/logout' : '/zx/auth/logout', {
				redirect: 'manual'
			})
		)
		.then(() => {
			const customLogoutUrl = useLoginConfigStore.getState().carbonioWebUiLogoutURL;
			customLogoutUrl ? goTo(customLogoutUrl) : goToLogin();
		})
		.catch((error) => {
			console.error(error);
		});
}
