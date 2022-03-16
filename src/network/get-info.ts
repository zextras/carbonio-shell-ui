/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { GetState, SetState } from 'zustand';
import { filter } from 'lodash';
import { SHELL_APP_ID, SHELL_MODES } from '../constants';
import { useAppStore } from '../store/app';
import { normalizeAccount } from '../store/account/normalization';
import { AccountSettings, AccountState, GetInfoResponse, CarbonioModule } from '../../types';
import { goToLogin } from './go-to-login';
import { isAdmin, isFullClient, isStandalone } from '../multimode';

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
		.soapFetch(SHELL_APP_ID)<{ _jsns: string; rights: string }, GetInfoResponse>('GetInfo', {
			_jsns: 'urn:zimbraAccount',
			rights: 'sendAs,sendAsDistList,viewFreeBusy,sendOnBehalfOf,sendOnBehalfOfDistList'
		})
		.then((res: any): void => {
			if (res) {
				const { account, settings, version } = normalizeAccount(res);
				set({
					account,
					settings,
					pollingInterval: parsePollingInterval(settings),
					zimbraVersion: version
				});
			}
		})
		.then(() => fetch('/static/iris/components.json'))
		.then((r: any) => r.json())
		.then(({ components }: { components: Array<CarbonioModule> }) => {
			useAppStore.getState().setters.addApps(
				filter(components, ({ type, name }) => {
					if (type === 'shell') return true;
					if (isAdmin()) return type === SHELL_MODES.ADMIN;
					if (isFullClient()) return type === SHELL_MODES.CARBONIO;
					if (isStandalone()) return name === window.location.pathname.split('/')[2];
					return false;
				})
			);
		})
		.catch((err: unknown) => {
			console.log('there was an error checking user data');
			console.error(err);
			goToLogin();
		});
