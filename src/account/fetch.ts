import UAParser from 'ua-parser-js';
import { GetState, SetState } from 'zustand';
import { goToLogin } from './go-to-login';
import {
	Account,
	AccountState,
	ErrorSoapResponse,
	SoapResponse,
	SuccessSoapResponse
} from './types';

const { os, browser } = UAParser();

const userAgent = `CarbonioWebClient - ${browser.name} ${browser.version} (${os.name})`;
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

const handleResponse = <R>(api: string, res: SoapResponse<R>, set: SetState<AccountState>): R => {
	if (res?.Body?.Fault) {
		if ((<ErrorSoapResponse>res).Body.Fault.Detail?.Error?.Code === 'service.AUTH_REQUIRED') {
			goToLogin();
		}
		throw new Error(
			`${(<ErrorSoapResponse>res)?.Body.Fault.Detail?.Error?.Detail}: ${
				(<ErrorSoapResponse>res).Body.Fault.Reason?.Text
			}`
		);
	}
	if (res?.Header?.context) {
		set({
			context: res?.Header?.context
		});
	}
	return (<SuccessSoapResponse<R>>res).Body[`${api}Response`] as R;
};
export const baseJsonFetch = (get: GetState<AccountState>, set: SetState<AccountState>) => <
	Request,
	Response
>(
	api: string,
	body: Request
): Promise<Response | void> =>
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
					notify: {
						seq: get().context?.notify?.seq
					},
					session: get().context?.session,
					account: getAccount(get().account as Account),
					context: {
						userAgent: {
							name: userAgent
						}
					}
				}
			}
		})
	}) // TODO proper error handling
		.then((res) => res?.json())
		.then((res: SoapResponse<Response>) => handleResponse(api, res, set))
		.catch(console.error);

export const baseXmlFetch = (get: GetState<AccountState>, set: SetState<AccountState>) => <
	Response
>(
	api: string,
	body: string
): Promise<Response> =>
	fetch(`/service/soap/${api}Request`, {
		method: 'POST',
		headers: {
			'content-type': 'application/soap+xml'
		},
		body: `<?xml version="1.0" encoding="utf-8"?>
		<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope">
			<soap:Header>
				<context xmlns="urn:zimbra">
					<userAgent name="${userAgent}" version="8.8.15_GA_202108105"/>
					<session id="${get().context?.session?.id}"/>
					${getXmlAccount(get().account)}
					<format type="js"/>
				</context>
			</soap:Header>
			<soap:Body>
				${body}
			</soap:Body>
		</soap:Envelope>`
	}) // TODO proper error handling
		.then((res) => res?.json())
		.then((res: any): any => {
			if (res?.Body?.Fault) {
				if (res?.Body.Fault.Detail?.Error?.Code === 'service.AUTH_REQUIRED') {
					goToLogin();
				}
				throw new Error(`${res?.Body.Fault.Detail?.Error?.Detail}: ${res.Body.Fault.Reason?.Text}`);
			}
			if (res?.Header?.context) {
				set({
					context: res?.Header?.context
				});
			}
			return res.Body[`${api}Response`] as Response;
		})
		.catch(console.error);
