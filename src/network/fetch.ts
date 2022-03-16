/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { find } from 'lodash';
import { goToLogin } from './go-to-login';
import { Account, ErrorSoapResponse, SoapResponse, SuccessSoapResponse } from '../../types';
import { userAgent } from './user-agent';
import { report } from '../reporting';
import { useAccountStore } from '../store/account';
import { SHELL_APP_ID } from '../constants';
import { useNetworkStore } from '../store/network';
import { handleTagSync } from '../store/tags';

export const noOp = (): void => {
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

const getXmlSession = (context?: any): string => {
	if (context?.session?.id) {
		return `<session id="${context?.session?.id}"/>`;
	}
	return '';
};

const handleResponse = <R>(api: string, res: SoapResponse<R>): R => {
	const { pollingInterval, context } = useNetworkStore.getState();
	const { usedQuota } = useAccountStore.getState();
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	clearTimeout(get().noOpTimeout);
	if (res?.Body?.Fault) {
		if (
			find(
				['service.AUTH_REQUIRED', 'service.AUTH_EXPIRED'],
				(code) => code === (<ErrorSoapResponse>res).Body.Fault.Detail?.Error?.Code
			)
		) {
			goToLogin();
		}
		throw new Error(
			`${(<ErrorSoapResponse>res)?.Body.Fault.Detail?.Error?.Detail}: ${
				(<ErrorSoapResponse>res).Body.Fault.Reason?.Text
			}`
		);
	}
	if (res?.Header?.context) {
		const responseUsedQuota =
			res.Header.context?.refresh?.mbx?.[0]?.s ?? res.Header.context?.notify?.[0]?.mbx?.[0]?.s;
		handleTagSync(res.Header.context);
		useAccountStore.setState({
			usedQuota: responseUsedQuota ?? usedQuota
		});
		useNetworkStore.setState({
			noOpTimeout: setTimeout(() => noOp(), pollingInterval),
			context: {
				...context,
				...res?.Header?.context
			}
		});
	}
	return (<SuccessSoapResponse<R>>res).Body[`${api}Response`] as R;
};
export const getSoapFetch =
	(app: string) =>
	<Request, Response>(api: string, body: Request, otherAccount?: string): Promise<Response> => {
		const { zimbraVersion, account } = useAccountStore.getState();
		const { context } = useNetworkStore.getState();
		return fetch(`/service/soap/${api}Request`, {
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
						notify: context?.notify?.[0]?.seq
							? {
									seq: context?.notify?.[0]?.seq
							  }
							: undefined,
						session: context?.session ?? {},
						account: getAccount(account as Account, otherAccount),
						userAgent: {
							name: userAgent,
							version: zimbraVersion
						}
					}
				}
			})
		}) // TODO proper error handling
			.then((res) => res?.json())
			.then((res: SoapResponse<Response>) => handleResponse(api, res))
			.catch((e) => {
				report(app)(e);
				throw e;
			}) as Promise<Response>;
	};

export const getXmlSoapFetch =
	(app: string) =>
	<Request, Response>(api: string, body: Request, otherAccount?: string): Promise<Response> => {
		const { zimbraVersion, account } = useAccountStore.getState();
		const { context } = useNetworkStore.getState();
		return fetch(`/service/soap/${api}Request`, {
			method: 'POST',
			headers: {
				'content-type': 'application/soap+xml'
			},
			body: `<?xml version="1.0" encoding="utf-8"?>
		<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope">
			<soap:Header><context xmlns="urn:zimbra"><userAgent name="${userAgent}" version="${zimbraVersion}"/>${getXmlSession(
				context
			)}${getXmlAccount(account, otherAccount)}<format type="js"/></context></soap:Header>
			<soap:Body>${body}</soap:Body>
		</soap:Envelope>`
		}) // TODO proper error handling
			.then((res) => res?.json())
			.then((res: SoapResponse<Response>) => handleResponse(api, res))
			.catch((e) => {
				report(app)(e);
				throw e;
			}) as Promise<Response>;
	};
