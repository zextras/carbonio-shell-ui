/*
 * SPDX-FileCopyrightText: 2025 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { userAgent } from './user-agent';
// import { useAccountStore } from '../store/account';
// import { useNetworkStore } from '../store/network';
// import type { Account } from '../types/account';
import { ApiManager } from '../ApiManager';
import { JSNS } from '../constants';
import type { RawSoapResponse, SoapBody } from '../types/network';

export type NoOpRequest = SoapBody<{
	limitToOneBlocked?: 0 | 1;
	wait?: 0 | 1;
}>;

export type NoOpResponse = SoapBody<{
	waitDisallowed?: boolean;
}>;

/**
 * Polling interval to use if the long polling delay
 * is not allowed for the user
 */
const POLLING_NOWAIT_INTERVAL = 10_000;

/**
 * Polling interval to use if a previous request failed
 * with a 500 error
 */
const POLLING_RETRY_INTERVAL = 60_000;

const LONG_POLLING_MARKER_VALUE = 500;

// export const parsePollingInterval = (settings: AccountSettings): number => {
// 	const pollingPref = settings.prefs?.zimbraPrefMailPollingInterval ?? '';
// 	const [value, durationUnit] = pollingPref.split(/([a-z]+)/g);
// 	const pollingValue = parseInt(value, 10);
// 	if (Number.isNaN(pollingValue)) {
// 		return POLLING_INVALID_DURATION;
// 	}
//
// 	if (
// 		pollingValue === LONG_POLLING_MARKER_VALUE &&
// 		(durationUnit === undefined || durationUnit === 'ms' || durationUnit === 's')
// 	) {
// 		return LONG_POLLING_MARKER_VALUE;
// 	}
// 	switch (durationUnit) {
// 		case 'ms':
// 			return pollingValue;
// 		case undefined:
// 		case 's':
// 			return pollingValue * 1000;
// 		case 'm':
// 			return pollingValue * 60 * 1000;
// 		case 'h':
// 			return pollingValue * 60 * 60 * 1000;
// 		case 'd':
// 			return pollingValue * 24 * 60 * 60 * 1000;
// 		default:
// 			return POLLING_INVALID_DURATION;
// 	}
// };

const getFinalAccount = (account?: string): { by: string; _content: string } | undefined => {
	const sessionInfo = ApiManager.getApiManager().getSessionInfo();

	if (account) {
		return {
			by: 'name',
			_content: account
		};
	}
	if (sessionInfo.accountName) {
		return {
			by: 'name',
			_content: sessionInfo.accountName
		};
	}
	if (sessionInfo.accountId) {
		return {
			by: 'id',
			_content: sessionInfo.accountId
		};
	}
	return undefined;
};

export const soapFetch = async <Request, Response extends Record<string, unknown>>(
	api: string,
	body: Request,
	account?: string,
	signal?: AbortSignal
): Promise<RawSoapResponse<Response>> => {
	const { carbonioVersion, session } = ApiManager.getApiManager().getSessionInfo();

	const notify = [{ seq: 0 }]; // TODO TO BE IMPLEMENTED

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
					account: getFinalAccount(account),
					userAgent: {
						name: userAgent,
						version: carbonioVersion
					}
				}
			}
		})
	});
	return res.json();
};

// /**
//  * Return the polling interval for the next NoOp request.
//  * The interval length depends on the user settings, but it can be
//  * overridden by the server response/errors
//  */
// export const getPollingInterval = (
// 	res: RawSoapResponse<{
// 		NoOpResponse?: NoOpResponse;
// 	}>
// ): number => {
// 	const { settings } = useAccountStore.getState();
// 	const waitDisallowed =
// 		res.Body && !('Fault' in res.Body) && res.Body.NoOpResponse?.waitDisallowed;
// 	const fault = res.Body && 'Fault' in res.Body && res.Body.Fault;
// 	if (fault) {
// 		return POLLING_RETRY_INTERVAL;
// 	}
// 	if (waitDisallowed) {
// 		return POLLING_NOWAIT_INTERVAL;
// 	}
// 	return parsePollingInterval(settings);
// };
