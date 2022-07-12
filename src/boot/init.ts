/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useAccountStore } from '../store/account';
import { useAppStore } from '../store/app';
import { loadApps } from './app/load-apps';
import { getInfo } from '../network/get-info';
import { setLocale } from '../store/i18n';

export const init = (): void => {
	getInfo().finally(() => {
		setLocale(
			(useAccountStore.getState().settings?.prefs?.zimbraPrefLocale as string) ??
				(useAccountStore.getState().settings?.attrs?.zimbraLocale as string) ??
				'en'
		);
		loadApps(Object.values(useAppStore.getState().apps));
	});
};
