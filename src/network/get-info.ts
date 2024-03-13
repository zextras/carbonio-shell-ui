/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { getSoapFetch } from './fetch';
import { JSNS, SHELL_APP_ID } from '../constants';
import { useAccountStore } from '../store/account';
import { normalizeAccount } from '../store/account/normalization';
import { useNetworkStore } from '../store/network';
import { parsePollingInterval } from '../store/network/utils';
import type { GetInfoResponse, SoapBody } from '../types/network';

export const getInfo = (): Promise<void> =>
	getSoapFetch(SHELL_APP_ID)<SoapBody<{ rights: string }>, GetInfoResponse>('GetInfo', {
		_jsns: JSNS.account,
		rights: 'sendAs,sendAsDistList,viewFreeBusy,sendOnBehalfOf,sendOnBehalfOfDistList'
	}).then((res: GetInfoResponse): void => {
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
	});
