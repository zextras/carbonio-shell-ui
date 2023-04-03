/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { filter } from 'lodash';
import { SHELL_APP_ID } from '../constants';
import { useAppStore } from '../store/app';
import { normalizeAccount } from '../store/account/normalization';
import { AccountSettings, GetInfoResponse, CarbonioModule } from '../../types';
import { getSoapFetch } from './fetch';
import { useAccountStore } from '../store/account';
import { useNetworkStore } from '../store/network';

const parsePollingInterval = (settings: AccountSettings): number => {
	const pollingPref = (settings.prefs?.zimbraPrefMailPollingInterval ?? '') as string;
	if (pollingPref === '500') {
		return 500;
	}
	const pollingValue = parseInt(pollingPref, 10);
	if (Number.isNaN(pollingValue)) {
		return 30000;
	}
	if (pollingPref.includes('m')) {
		return pollingValue * 60 * 1000;
	}
	return pollingValue * 1000;
};

export const getInfo = (): Promise<void> =>
	fetch('/static/iris/components.json')
		.then((r) => r.json())
		.then(({ components }: { components: Array<CarbonioModule> }) => {
			useAppStore
				.getState()
				.setters.addApps(filter(components, ({ type }) => type === 'shell' || type === 'carbonio'));
		})
		.then(() =>
			getSoapFetch(SHELL_APP_ID)<{ _jsns: string; rights: string }, GetInfoResponse>('GetInfo', {
				_jsns: 'urn:zimbraAccount',
				rights: 'sendAs,sendAsDistList,viewFreeBusy,sendOnBehalfOf,sendOnBehalfOfDistList'
			})
		)
		.then((res: GetInfoResponse): void => {
			if (res) {
				const { account, settings, version } = normalizeAccount(res);
				useNetworkStore.setState({
					pollingInterval: parsePollingInterval(settings)
				});
				useAccountStore.setState({
					authenticated: true,
					account,
					settings,
					zimbraVersion: version
				});
			}
		})
		.catch((err: Error) => {
			console.error(err);
		});
