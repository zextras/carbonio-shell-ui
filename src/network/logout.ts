/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { soapFetch } from './fetch-utils';
import { goTo, goToLogin } from './utils';
import { JSNS } from '../constants';
import { useLoginConfigStore } from '../store/login/store';

export async function logout({
	isManualLogout = false
}: { isManualLogout?: boolean } = {}): Promise<void> {
	try {
		await soapFetch('EndSession', {
			_jsns: JSNS.account,
			logoff: true
		});
		await fetch('/logout', { redirect: 'manual' });
		const customLogoutUrl = useLoginConfigStore.getState().carbonioWebUiLogoutURL;
		if (isManualLogout && customLogoutUrl) {
			goTo(customLogoutUrl);
		} else {
			goToLogin();
		}
	} catch (error) {
		console.error(error);
	}
}
