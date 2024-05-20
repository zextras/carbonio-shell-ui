/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { LOGIN_V3_CONFIG_PATH } from '../constants';
import { getClientTitle, getFavicon } from '../store/login/getters';
import type { LoginConfigStore } from '../store/login/store';
import { useLoginConfigStore } from '../store/login/store';

export const loginConfig = (): Promise<void> =>
	fetch(LOGIN_V3_CONFIG_PATH)
		.then((response) => response.json())
		.then((data: Omit<LoginConfigStore, 'loaded' | 'isCarbonioCE'>) => {
			useLoginConfigStore.setState((state: LoginConfigStore) => ({
				...state,
				...data,
				isCarbonioCE: false
			}));
		})
		.catch(() => {
			useLoginConfigStore.setState((state: LoginConfigStore) => ({
				...state,
				isCarbonioCE: true
			}));
		})
		.finally(() => {
			useLoginConfigStore.setState({ loaded: true });
			const favicon = document.getElementById('favicon');
			if (favicon && favicon instanceof HTMLLinkElement) {
				favicon.href = getFavicon();
			}
			document.title = getClientTitle();
		});
