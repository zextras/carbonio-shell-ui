/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { find, map } from 'lodash';

import { soapFetch } from './fetch-utils';
import { userAgent } from './user-agent';
import { ApiManager } from '../ApiManager';
import {
	dispatchAuthErrorEvent,
	dispatchUserQuotaEvent
} from '../customEvent/custumEventDispatcher';
import type {
	ErrorSoapBodyResponse,
	ErrorSoapResponse,
	RawSoapContext,
	RawSoapNotify,
	RawSoapResponse,
	SoapContext,
	SoapNotify
} from '../types/network';

// TODO IMPLEMENT POLLING
// const fetchNoOp = (): void => {
// 	// eslint-disable-next-line @typescript-eslint/no-use-before-define
// 	getSoapFetch(SHELL_APP_ID)<NoOpRequest, NoOpResponse>(
// 		'NoOp',
// 		useNetworkStore.getState().pollingInterval === 500
// 			? { _jsns: JSNS.mail, limitToOneBlocked: 1, wait: 1 }
// 			: { _jsns: JSNS.mail }
// 	);
// };

const composeAccountTag = (otherAccount?: string): string => {
	if (otherAccount) {
		return `<account by="name">${otherAccount}</account>`;
	}

	const sessionInfo = ApiManager.getApiManager().getSessionInfo();
	if (sessionInfo.accountName) {
		return `<account by="name">${sessionInfo.accountName}</account>`;
	}
	if (sessionInfo.accountId) {
		return `<account by="id">${sessionInfo.accountId}</account>`;
	}
	return '';
};

const composeSessionTag = (): string => {
	const sessionInfo = ApiManager.getApiManager().getSessionInfo();
	if (sessionInfo.session) {
		return `<session id="${sessionInfo.session.id}"/>`;
	}
	return '';
};

const normalizeContext = ({ notify: rawNotify, ...context }: RawSoapContext): SoapContext => {
	const normalizedContext: SoapContext = { ...context, notify: [] };
	if (rawNotify) {
		normalizedContext.notify = map<RawSoapNotify, SoapNotify>(rawNotify, (notify) => ({
			...notify,
			deleted: notify.deleted?.id?.split(',') ?? []
		}));
	}
	return normalizedContext;
};

const handleResponseV2 = <R extends Record<string, unknown>>(res: RawSoapResponse<R>): void => {
	// TODO IMPLEMENT POLLING
	// const { noOpTimeout } = useNetworkStore.getState();
	// clearTimeout(noOpTimeout);
	if (res.Body.Fault) {
		if (
			find(
				['service.AUTH_REQUIRED', 'service.AUTH_EXPIRED'],
				(code) => code === (<ErrorSoapResponse>res).Body.Fault.Detail?.Error?.Code
			)
		) {
			dispatchAuthErrorEvent('NOT_AUTHENTICATED');
		}
		console.error(
			new Error(
				`${(<ErrorSoapResponse>res).Body.Fault.Detail?.Error?.Code}: ${
					(<ErrorSoapResponse>res).Body.Fault.Reason?.Text
				}`
			)
		);

		return;
	}

	// Handle response context section
	if (res.Header?.context) {
		// Extract and store the session identifier from the response
		ApiManager.getApiManager().setSessionInfo({ session: res.Header.context.session });

		// Extract used quota from response
		const responseUsedQuota =
			res.Header.context?.refresh?.mbx?.[0]?.s ??
			res.Header.context?.notify?.[0]?.modified?.mbx?.[0]?.s;
		if (responseUsedQuota) {
			dispatchUserQuotaEvent(responseUsedQuota);
		}

		const _context = normalizeContext(res.Header.context);
		// TODO IMPLEMENT NOTIFY MANAGEMENT
		// const seq = maxBy(_context.notify, 'seq')?.seq ?? 0;

		// TODO MOVE STORE QUOTA MANAGEMENT OUTSIDE
		// useAccountStore.setState({
		// 	usedQuota: responseUsedQuota ?? usedQuota
		// });

		// TODO IMPLEMENT POLLING AND NOTIFY
		// const nextPollingInterval = getPollingInterval(res);
		// useNetworkStore.setState({
		// 	noOpTimeout: setTimeout(() => fetchNoOp(), nextPollingInterval),
		// 	pollingInterval: nextPollingInterval,
		// 	seq,
		// 	..._context
		// });
	}
};

const handleResponse = <R extends Record<string, unknown>>(
	api: string,
	res: RawSoapResponse<R>
): R | ErrorSoapBodyResponse => {
	handleResponseV2(res);
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	return res?.Body?.Fault ? (res.Body as ErrorSoapBodyResponse) : (res.Body[`${api}Response`] as R);
};

/**
 * @deprecated Use soapFetchV2 instead
 */
export const legacySoapFetch = <Request, Response extends Record<string, unknown>>(
	api: string,
	body: Request,
	otherAccount?: string,
	signal?: AbortSignal
): Promise<Response> =>
	soapFetch<Request, Response>(api, body, otherAccount, signal)
		// TODO proper error handling
		.then((res: RawSoapResponse<Response>) => handleResponse(api, res))
		.catch((e) => {
			throw e;
		}) as Promise<Response>;

export const soapFetchV2 = async <Request, Response extends Record<string, unknown>>(
	api: string,
	body: Request,
	otherAccount?: string,
	signal?: AbortSignal
): Promise<RawSoapResponse<Response>> => {
	const rawSoapResponse = await soapFetch<Request, Response>(api, body, otherAccount, signal);
	// apply side effects
	handleResponseV2(rawSoapResponse);
	return rawSoapResponse;
};

/**
 * @deprecated Use soapFetchV2 instead
 */
export const legacyXmlSoapFetch = <Request, Response extends Record<string, unknown>>(
	api: string,
	body: Request,
	otherAccount?: string
): Promise<Response> => {
	const sessionInfo = ApiManager.getApiManager().getSessionInfo();
	const xmlSessionTag = composeSessionTag();
	const xmlAccountTag = composeAccountTag(otherAccount);

	return fetch(`/service/soap/${api}Request`, {
		method: 'POST',
		headers: {
			'content-type': 'application/soap+xml'
		},
		body: `<?xml version="1.0" encoding="utf-8"?>
		<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope">
			<soap:Header>
				<context xmlns="urn:zimbra">
					<userAgent name="${userAgent}" version="${sessionInfo.carbonioVersion}"/>
					${xmlSessionTag}
					${xmlAccountTag}
					<format type="js"/>
				</context>
			</soap:Header>
			<soap:Body>${body}</soap:Body>
		</soap:Envelope>`
	}) // TODO proper error handling
		.then((res) => res?.json())
		.then((res: RawSoapResponse<Response>) => handleResponse(api, res))
		.catch((e) => {
			throw e;
		}) as Promise<Response>;
};
