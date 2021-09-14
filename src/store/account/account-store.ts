import create from 'zustand';
import { AccountContext, AccountState } from './types';
import { getInfo } from '../../network/get-info';
import { getSoapFetch, getXmlSoapFetch } from '../../network/fetch';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const useAccountStore = create<AccountState>((set, get) => ({
	account: undefined,
	version: '',
	settings: {
		prefs: {},
		attrs: {},
		props: []
	},
	context: {},
	setContext: (context: AccountContext): void => set({ context }),
	init: (): Promise<void> => getInfo(set, get),
	soapFetch: (
		app: string
	): (<Request, Response>(api: string, body: Request) => Promise<Response | void>) =>
		getSoapFetch(app, set, get),
	xmlSoapFetch: (
		app: string
	): (<Request, Response>(api: string, body: Request) => Promise<Response | void>) =>
		getXmlSoapFetch(app, set, get)
}));
