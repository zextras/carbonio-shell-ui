import create from 'zustand';
import { normalizeAccount } from './normalization';
import { AccountState, GetInfoResponse } from './types';
import { useAppStore } from '../app-store';
import { baseJsonFetch, baseXmlFetch } from './fetch';

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
	soapFetch: baseJsonFetch(get, set),
	xmlSoapFetch: baseXmlFetch(get, set)
}));
