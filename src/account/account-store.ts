import create from 'zustand';
import { normalizeAccount } from './normalization';
import { AccountState, GetInfoResponse, Tag, ZextrasComponent } from './types';
import { useAppStore } from '../app-store';
import { baseJsonFetch, baseXmlFetch } from './fetch';

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
	init: (): Promise<void> =>
		get()
			.soapFetch<{ _jsns: string }, GetInfoResponse>('GetInfo', {
				_jsns: 'urn:zimbraAccount'
			})
			.then((res): void => {
				if (res) {
					const { account, settings, apps, version } = normalizeAccount(res);
					useAppStore.getState().setters.addApps(apps);
					set({ account, settings, version });
				}
			})
			.then(() => fetch('/static/iris/components.json'))
			.then((r) => r.json())
			.then(({ components }: { components: Array<ZextrasComponent> }) => set({ components }))
			.then(() =>
				get().soapFetch<{ _jsns: string }, { tag: Array<Tag> }>('GetTag', {
					_jsns: 'urn:zimbraMail'
				})
			)
			.then(({ tag }) => set({ tags: tag }))
			.catch((err) => {
				console.log('there was an error checking user data');
				console.error(err);
			}),
	soapFetch: baseJsonFetch(get, set),
	xmlSoapFetch: baseXmlFetch(get, set)
}));
