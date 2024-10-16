/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { soapFetch } from './fetch-utils';
import { goTo, goToLogin } from './utils';
import { JSNS } from '../constants';
import { useLoginConfigStore } from '../store/login/store';

export async function logout(): Promise<void> {
	try {
		await soapFetch('EndSession', {
			_jsns: JSNS.account,
			logoff: true
		});
		await fetch('/logout', { redirect: 'manual' });
	} catch (error) {
		console.error(error);
	} finally {
		const customLogoutUrl = useLoginConfigStore.getState().carbonioWebUiLogoutURL;
		customLogoutUrl ? goTo(customLogoutUrl) : goToLogin();
	}
}
