import { GetState, SetState } from 'zustand';
import { filter, find } from 'lodash';
import { SHELL_APP_ID } from '../../constants';
import { useAppStore } from '../app';
import { normalizeAccount } from './normalization';
import { GetInfoResponse, ZextrasModule, Tag, AccountState } from './types';

export const getInfo = (set: SetState<AccountState>, get: GetState<AccountState>): Promise<void> =>
	get()
		.soapFetch(SHELL_APP_ID)<{ _jsns: string }, GetInfoResponse>('GetInfo', {
			_jsns: 'urn:zimbraAccount'
		})
		.then((res): void => {
			if (res) {
				const { account, settings, version } = normalizeAccount(res);
				set({ account, settings, zimbraVersion: version });
			}
		})
		.then(() => fetch('/static/iris/components.json'))
		.then((r) => r.json())
		.then(({ components }: { components: [Array<ZextrasModule>] }) => {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			set({ shell: find(components[0], (c) => c.name === SHELL_APP_ID)! });
			useAppStore
				.getState()
				.setters.addApps(filter(components[0], (app) => app.name !== SHELL_APP_ID));
		})
		.then(() =>
			get().soapFetch(SHELL_APP_ID)<{ _jsns: string }, { tag: Array<Tag> }>('GetTag', {
				_jsns: 'urn:zimbraMail'
			})
		)
		.then((r) => set({ tags: r?.tag ?? [] }))
		.catch((err) => {
			console.log('there was an error checking user data');
			console.error(err);
		});
