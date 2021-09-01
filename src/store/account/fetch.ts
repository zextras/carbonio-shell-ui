import UAParser from 'ua-parser-js';
import { goToLogin } from './go-to-login';
import { Account, ErrorSoapResponse, SoapResponse, SuccessSoapResponse } from './types';
import { getApp } from '../app/getters';
import { useAccountStore } from './account-store';
import { getIntegratedFunction } from '../integrations/getters';

const { os, browser } = UAParser();

export const userAgent = `CarbonioWebClient - ${browser.name} ${browser.version} (${os.name})`;

export const report = (appId: string) => (error: Error, hint?: unknown): void => {
	const app = getApp(appId)();
	const account = useAccountStore.getState().account as Account;
	const [reportError, available] = getIntegratedFunction('report-error');
	if (available) {
		reportError(error, app?.core ?? { id: 'com_zextras_zapp_shell' }, account.id, hint);
	}
};

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

const handleResponse = <R>(api: string, res: SoapResponse<R>): R => {
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
		useAccountStore.setState({
			context: res?.Header?.context
		});
	}
	return (<SuccessSoapResponse<R>>res).Body[`${api}Response`] as R;
};
export const baseJsonFetch = <Request, Response>(
	app: string,
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
						seq: useAccountStore.getState().context?.notify?.seq
					},
					session: useAccountStore.getState().context?.session,
					account: getAccount(useAccountStore.getState().account as Account),
					context: {
						userAgent: {
							name: userAgent,
							version: useAccountStore.getState().zimbraVersion
						}
					}
				}
			}
		})
	}) // TODO proper error handling
		.then((res) => res?.json())
		.then((res: SoapResponse<Response>) => handleResponse(api, res))
		.catch((e) => report(app)(e));

export const baseXmlFetch = <Response>(app: string, api: string, body: string): Promise<Response> =>
	fetch(`/service/soap/${api}Request`, {
		method: 'POST',
		headers: {
			'content-type': 'application/soap+xml'
		},
		body: `<?xml version="1.0" encoding="utf-8"?>
		<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope">
			<soap:Header><context xmlns="urn:zimbra"><userAgent name="${userAgent}" version="${
			useAccountStore.getState().zimbraVersion
		}"/>${getXmlSession(useAccountStore.getState().context)}${getXmlAccount(
			useAccountStore.getState().account
		)}<format type="js"/></context></soap:Header>
			<soap:Body>${body}</soap:Body>
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
				useAccountStore.setState({
					context: res?.Header?.context
				});
			}
			return res.Body[`${api}Response`] as Response;
		})
		.catch((e) => report(app)(e));
