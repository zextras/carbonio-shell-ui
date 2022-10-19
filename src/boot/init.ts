/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { getInfo } from '../network/get-info';
import { useAppStore } from '../store/app';
import { loadApps } from './app/load-apps';

export const init = (): void => {
	getInfo().finally(() => {
		loadApps(Object.values(useAppStore.getState().apps));
	});
};
