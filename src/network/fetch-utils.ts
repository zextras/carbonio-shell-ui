/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { userAgent } from './user-agent';
import { JSNS } from '../constants';
import { useAccountStore } from '../store/account';
import { useNetworkStore } from '../store/network';
import type { Account } from '../types/account';
import type { RawSoapResponse } from '../types/network';

const getAccount = (
	acc?: Account,
	otherAccount?: string
): { by: string; _content: string } | undefined => {
	if (otherAccount) {
		return {
			by: 'name',
			_content: otherAccount
		};
	}
	if (acc) {
		if (acc.name) {
			return {
				by: 'name',
				_content: acc.name
			};
		}
		if (acc.id) {
			return {
				by: 'id',
				_content: acc.id
			};
		}
	}
	return undefined;
};

export const soapFetch = async <Request, Response extends Record<string, unknown>>(
	api: string,
	body: Request,
	otherAccount?: string,
	signal?: AbortSignal
): Promise<RawSoapResponse<Response>> => {
	const { zimbraVersion, account } = useAccountStore.getState();
	const { notify, session } = useNetworkStore.getState();
	const res = await fetch(`/service/soap/${api}Request`, {
		signal,
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			Body: {
				[`${api}Request`]: body
			},
			Header: {
				context: {
					_jsns: JSNS.all,
					notify: notify?.[0]?.seq
						? {
								seq: notify?.[0]?.seq
							}
						: undefined,
					session: session ?? {},
					account: getAccount(account, otherAccount),
					userAgent: {
						name: userAgent,
						version: zimbraVersion
					}
				}
			}
		})
	});
	return res.json();
};
