/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiManager } from '../ApiManager';
import { JSNS } from '../constants';
import { legacySoapFetch } from '../fetch/fetch';
import { GetInfoResponse } from '../types/network';
import { SoapBody } from '../types/network/soap';

type GetInfoParams = {
	rights?: string;
	sections?: string;
};

export const getInfo = ({ rights, sections }: GetInfoParams = {}): Promise<GetInfoResponse> =>
	legacySoapFetch<SoapBody<GetInfoParams>, GetInfoResponse>('GetInfo', {
		_jsns: JSNS.account,
		rights,
		sections
	}).then((res: GetInfoResponse) => {
		if (res) {
			const { id, name, version } = res;
			ApiManager.getApiManager().setSessionInfo({
				accountId: id,
				accountName: name,
				carbonioVersion: version
			});
		}

		return res;
	});
