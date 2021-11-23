/*
 * SPDX-FileCopyrightText: 2021 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { GetState, SetState } from 'zustand';
import { SHELL_APP_ID } from '../constants';
import { useAppStore } from '../store/app/store';
import { normalizeAccount } from '../store/account/normalization';
import { AccountSettings, AccountState, GetInfoResponse, Tag, ZextrasModule } from '../../types';
import { goToLogin } from './go-to-login';

const parsePollingInterval = (settings: AccountSettings): number => {
	const pollingPref = (settings.prefs?.zimbraPrefMailPollingInterval ?? '') as string;
	const pollingValue = parseInt(pollingPref, 10);
	if (Number.isNaN(pollingValue)) {
		return 30000;
	}
	if (pollingPref.includes('m')) {
		return pollingValue * 60 * 1000;
	}
	return pollingValue * 1000;
};
export const getInfo = (set: SetState<AccountState>, get: GetState<AccountState>): Promise<void> =>
	get()
		.soapFetch(SHELL_APP_ID)<{ _jsns: string }, GetInfoResponse>('GetInfo', {
			_jsns: 'urn:zimbraAccount'
		})
		.then((res: any): void => {
			if (res) {
				const { account, settings, version } = normalizeAccount(res);
				set({
					account,
					settings,
					// pollingInterval: parsePollingInterval(settings),
					zimbraVersion: version
				});
			}
		})
		.then(() => fetch('/static/iris/components.json'))
		.then((r: any) => r.json())
		.then(({ components }: { components: Array<ZextrasModule> }) => {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			useAppStore.getState().setters.addApps(components);
		})
		.catch((err: unknown) => {
			console.log('there was an error checking user data');
			console.error(err);
			goToLogin();
		});
