/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { LoginConfigStore } from '../../types/loginConfig';
import { LOGIN_V3_CONFIG_PATH } from '../constants';
import { getClientTitle, getFavicon } from '../store/login/getters';
import { useLoginConfigStore } from '../store/login/store';

export const loginConfig = (): Promise<void> =>
	fetch(LOGIN_V3_CONFIG_PATH)
		.then((response) => response.json())
		.then((data: LoginConfigStore) => {
			useLoginConfigStore.setState(data);
		})
		.finally(() => {
			useLoginConfigStore.setState({ loaded: true });
			const favicon = document.getElementById('favicon');
			if (favicon && favicon instanceof HTMLLinkElement) {
				favicon.href = getFavicon();
			}
			document.title = getClientTitle();
		});
