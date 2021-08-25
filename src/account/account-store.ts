import create, { GetState, SetState } from 'zustand';
import UAParser from 'ua-parser-js';
import { any } from 'prop-types';
import { goToLogin } from './go-to-login';
import { normalizeAccount } from './normalization';
import { Account, AccountState, GetInfoResponse } from './types';
import { useAppStore } from '../app-store';

const { os, browser } = UAParser();

const userAgent = `CarbonioWebClient - ${browser.name} ${browser.version} (${os.name})`;
const getAccount = (acc: Account): { by: string; _content: string } | undefined => {
	if (acc) {
		if (acc.name) {
			return {
				by: 'name',
				_content: acc.name
			};
		}
		return {
			by: 'id',
			_content: acc.name
		};
	}
	return undefined;
};

const baseJsonFetch = (get: GetState<AccountState>, set: SetState<AccountState>) => <
	Request,
	Response
>(
	api: string,
	body: Request
): Promise<Response> =>
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
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const useAccountStore = create<AccountState>((set, get) => ({
	account: undefined,
	settings: {},
	context: {},
	init: (): Promise<void> =>
		baseJsonFetch(get, set)<any, GetInfoResponse>('GetInfo', {
			_jsns: 'urn:zimbraAccount'
		})
			.then((res): void => {
				if (res) {
					const { account, settings, apps } = normalizeAccount(res);
					useAppStore.getState().setters.addApps(apps);
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-ignore
					set({ account, settings });
				}
			})
			.catch((err) => {
				console.log('there was an error checking user data');
				console.error(err);
			}),
	soapFetch: baseJsonFetch(get, set)
}));
