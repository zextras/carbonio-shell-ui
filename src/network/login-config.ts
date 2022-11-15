/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { LoginConfigStore } from '../../types/loginConfig';
import { useLoginConfigStore } from '../store/login';

export const loginConfig = (): Promise<void> => {
	return fetch('/zx/login/v3/config').then((response) => {
		return response.json();
	}).then((data: LoginConfigStore) => {
		useLoginConfigStore.setState(data);
	}).catch((reason) => {
		console.warn(reason);
	});
};
