/*
 * SPDX-FileCopyrightText: 2021 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { GetState, SetState } from 'zustand';
import { find } from 'lodash';
import { SHELL_APP_ID } from '../constants';
import { getApp, getShell } from '../store/app/hooks';
import { goToLogin } from './go-to-login';
import { report } from './report';
import {
	Account,
	AccountState,
	ErrorSoapResponse,
	SoapResponse,
	SuccessSoapResponse,
	Tag
} from '../../types';
import { userAgent } from './user-agent';
import { noOp } from './noOp';

const getAccount = (acc?: Account): { by: string; _content: string } | undefined => {
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

const getXmlAccount = (acc?: Account): string => {
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

const handleResponse = <R>(
	api: string,
	res: SoapResponse<R>,
	set: SetState<AccountState>,
	get: GetState<AccountState>
): R => {
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
		const usedQuota =
			res.Header.context?.refresh?.mbx?.[0]?.s ?? res.Header.context?.notify?.[0]?.mbx?.[0]?.s;
		const tags = res.Header.context?.refresh?.tags?.tag as Array<Tag>;
		set({
			noOpTimeout: setTimeout(() => noOp(get), 10000),
			tags: tags ?? get().tags,
			usedQuota: usedQuota ?? get().usedQuota,
			context: {
				...get().context,
				...res?.Header?.context
			}
		});
	}
	return (<SuccessSoapResponse<R>>res).Body[`${api}Response`] as R;
};
export const getSoapFetch =
	(app: string, set: SetState<AccountState>, get: GetState<AccountState>) =>
	<Request, Response>(api: string, body: Request): Promise<Response> =>
		fetch(`/service/soap/${api}Request`, {
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
						notify: get().context?.notify?.[0]?.seq
							? {
									seq: get().context?.notify?.[0]?.seq
							  }
							: undefined,
						session: get().context?.session ?? {},
						account: getAccount(get().account as Account),
						userAgent: {
							name: userAgent,
							version: get().zimbraVersion
						}
					}
				}
			})
		}) // TODO proper error handling
			.then((res) => res?.json())
			.then((res: SoapResponse<Response>) => handleResponse(api, res, set, get))
			.catch((e) =>
				report(app === SHELL_APP_ID ? getShell()! : getApp(app)()?.core)(e)
			) as Promise<Response>;

export const getXmlSoapFetch =
	(app: string, set: SetState<AccountState>, get: GetState<AccountState>) =>
	<Request, Response>(api: string, body: Request): Promise<Response> =>
		fetch(`/service/soap/${api}Request`, {
			method: 'POST',
			headers: {
				'content-type': 'application/soap+xml'
			},
			body: `<?xml version="1.0" encoding="utf-8"?>
		<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope">
			<soap:Header><context xmlns="urn:zimbra"><userAgent name="${userAgent}" version="${
				get().zimbraVersion
			}"/>${getXmlSession(get().context)}${getXmlAccount(
				get().account
			)}<format type="js"/></context></soap:Header>
			<soap:Body>${body}</soap:Body>
		</soap:Envelope>`
		}) // TODO proper error handling
			.then((res) => res?.json())
			.then((res: SoapResponse<Response>) => handleResponse(api, res, set, get))
			.catch((e) => {
				report(app === SHELL_APP_ID ? getShell()! : getApp(app)()?.core)(e);
				throw e;
			}) as Promise<Response>;
