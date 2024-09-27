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
import type { ErrorSoapBodyResponse, GetInfoResponse, SoapBody } from '../types/network';

export async function getInfo(): Promise<{ lifetime: number }> {
	const response = await getSoapFetch(SHELL_APP_ID)<
		SoapBody<{ rights: string }>,
		GetInfoResponse | ErrorSoapBodyResponse
	>('GetInfo', {
		_jsns: JSNS.account,
		rights: 'sendAs,sendAsDistList,viewFreeBusy,sendOnBehalfOf,sendOnBehalfOfDistList'
	});

	if ('Fault' in response) {
		throw new Error(response.Fault.Detail.Error.Code);
	}
	const { account, settings, version } = normalizeAccount(response);
	useNetworkStore.setState({
		pollingInterval: parsePollingInterval(settings)
	});
	useAccountStore.setState({
		authenticated: true,
		account,
		settings,
		zimbraVersion: version
	});

	return { lifetime: response.lifetime };
}
