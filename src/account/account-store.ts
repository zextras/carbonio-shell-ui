import create from 'zustand';
import { goToLogin } from './go-to-login';
import { normalizeAccount } from './normalization';
import { Account, AccountState, GetInfoResponse } from './types';

const getAccount = (accounts: Array<Account>): { by: string; _content: string } | undefined => {
	if (accounts.length > 0) {
		const acc = accounts[0];
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

export const useAccountStore = create<AccountState>((set, get) => ({
	accounts: [],
	context: {},
	init: (): Promise<void> =>
		fetch('/service/soap/GetInfoRequest', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				Header: {
					_jsns: 'urn:zimbra'
				},
				Body: {
					GetInfoRequest: {
						_jsns: 'urn:zimbraAccount'
					}
				}
			})
		})
			.then((res) => res?.json())
			.then((res): void => {
				if (res?.Body?.Fault) {
					if (res?.Body.Fault.Detail?.Error?.Code === 'service.AUTH_REQUIRED') {
						goToLogin();
					}
					throw new Error(
						`${res?.Body.Fault.Detail?.Error?.Detail}: ${res?.Body.Fault.Reason?.Text}`
					);
				}
				if (res?.Header?.context) {
					set({
						context: res?.Header?.context
					});
				}
				if (res?.Body?.GetInfoResponse) {
					set({
						accounts: normalizeAccount(res?.Body?.GetInfoResponse as GetInfoResponse)
					});
				}
			})
			.catch((err) => {
				console.log('there was an error checking user data');
				console.error(err);
			}),
	soapFetch: <Request, Response>(api: string, body: Request): Promise<Response> =>
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
						account: getAccount(get().accounts)
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
					throw new Error(
						`${res?.Body.Fault.Detail?.Error?.Detail}: ${res.Body.Fault.Reason?.Text}`
					);
				}
				if (res?.Header?.context) {
					set({
						context: res?.Header?.context
					});
				}
				return res;
			})
			.catch(console.error)
}));
