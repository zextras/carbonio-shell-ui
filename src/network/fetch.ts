/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { find, map, maxBy } from 'lodash';

import { userAgent } from './user-agent';
import { goToLogin } from './utils';
import type {
	Account,
	ErrorSoapBodyResponse,
	ErrorSoapResponse,
	RawSoapContext,
	RawSoapNotify,
	RawSoapResponse,
	SoapContext,
	SoapNotify
} from '../../types';
import { IS_FOCUS_MODE, SHELL_APP_ID } from '../constants';
import { report } from '../reporting/functions';
import { useAccountStore } from '../store/account';
import { useNetworkStore } from '../store/network';
import { getPollingInterval, handleSync } from '../store/network/utils';

export const fetchNoOp = (): void => {
	// eslint-disable-next-line @typescript-eslint/no-use-before-define
	getSoapFetch(SHELL_APP_ID)(
		'NoOp',
		useNetworkStore.getState().pollingInterval === 500
			? { _jsns: 'urn:zimbraMail', limitToOneBlocked: 1, wait: 1 }
			: { _jsns: 'urn:zimbraMail' }
	);
};

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

const getXmlAccount = (acc?: Account, otherAccount?: string): string => {
	if (otherAccount) {
		return `<account by="name">${otherAccount}</account>`;
	}
	if (acc) {
		if (acc.name) {
			return `<account by="name">${acc.name}</account>`;
		}
		if (acc.id) {
			return `<account by="id">${acc.id}</account>`;
		}
	}
	return '';
};

const getXmlSession = (): string => {
	const sessionId = useNetworkStore.getState().session?.id;
	if (sessionId) {
		return `<session id="${sessionId}"/>`;
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

const handleResponse = <R extends Record<string, unknown>>(
	api: string,
	res: RawSoapResponse<R>
): R | ErrorSoapBodyResponse => {
	const { noOpTimeout } = useNetworkStore.getState();
	const { usedQuota } = useAccountStore.getState();
	clearTimeout(noOpTimeout);
	if (res.Body.Fault) {
		if (
			find(
				['service.AUTH_REQUIRED', 'service.AUTH_EXPIRED'],
				(code) => code === (<ErrorSoapResponse>res).Body.Fault.Detail?.Error?.Code
			)
		) {
			if (IS_FOCUS_MODE) {
				useAccountStore.setState({ authenticated: false });
			} else {
				goToLogin();
			}
		}
		console.error(
			new Error(
				`${(<ErrorSoapResponse>res).Body.Fault.Detail?.Error?.Detail}: ${
					(<ErrorSoapResponse>res).Body.Fault.Reason?.Text
				}`
			)
		);
	}
	if (res.Header?.context) {
		const responseUsedQuota =
			res.Header.context?.refresh?.mbx?.[0]?.s ??
			res.Header.context?.notify?.[0]?.modified?.mbx?.[0]?.s;
		const _context = normalizeContext(res.Header.context);
		const seq = maxBy(_context.notify, 'seq')?.seq ?? 0;
		handleSync(_context);
		useAccountStore.setState({
			usedQuota: responseUsedQuota ?? usedQuota
		});

		const nextPollingInterval = getPollingInterval(res);
		useNetworkStore.setState({
			noOpTimeout: setTimeout(() => fetchNoOp(), nextPollingInterval),
			pollingInterval: nextPollingInterval,
			seq,
			..._context
		});
	}

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	return res?.Body?.Fault ? (res.Body as ErrorSoapBodyResponse) : (res.Body[`${api}Response`] as R);
};
export const getSoapFetch =
	(app: string) =>
	<Request, Response extends Record<string, unknown>>(
		api: string,
		body: Request,
		otherAccount?: string,
		signal?: AbortSignal
	): Promise<Response> => {
		const { zimbraVersion, account } = useAccountStore.getState();
		const { notify, session } = useNetworkStore.getState();
		return fetch(`/service/soap/${api}Request`, {
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
						_jsns: 'urn:zimbra',
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
		}) // TODO proper error handling
			.then((res) => res?.json())
			.then((res: RawSoapResponse<Response>) => handleResponse(api, res))
			.catch((e) => {
				report(app)(e);
				throw e;
			}) as Promise<Response>;
	};

export const getXmlSoapFetch =
	(app: string) =>
	<Request, Response extends Record<string, unknown>>(
		api: string,
		body: Request,
		otherAccount?: string
	): Promise<Response> => {
		const { zimbraVersion, account } = useAccountStore.getState();
		return fetch(`/service/soap/${api}Request`, {
			method: 'POST',
			headers: {
				'content-type': 'application/soap+xml'
			},
			body: `<?xml version="1.0" encoding="utf-8"?>
		<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope">
			<soap:Header><context xmlns="urn:zimbra"><userAgent name="${userAgent}" version="${zimbraVersion}"/>${getXmlSession()}${getXmlAccount(
				account,
				otherAccount
			)}<format type="js"/></context></soap:Header>
			<soap:Body>${body}</soap:Body>
		</soap:Envelope>`
		}) // TODO proper error handling
			.then((res) => res?.json())
			.then((res: RawSoapResponse<Response>) => handleResponse(api, res))
			.catch((e) => {
				report(app)(e);
				throw e;
			}) as Promise<Response>;
	};

export const shellSoap = getSoapFetch(SHELL_APP_ID);
