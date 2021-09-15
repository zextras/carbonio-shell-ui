import { GetState, SetState } from 'zustand';
import { SHELL_APP_ID } from '../constants';
import { useAppStore } from '../store/app/store';
import { normalizeAccount } from '../store/account/normalization';
import { AccountState, GetInfoResponse, Tag, ZextrasModule } from '../../types';

export const getInfo = (set: SetState<AccountState>, get: GetState<AccountState>): Promise<void> =>
	get()
		.soapFetch(SHELL_APP_ID)<{ _jsns: string }, GetInfoResponse>('GetInfo', {
			_jsns: 'urn:zimbraAccount'
		})
		.then((res: any): void => {
			if (res) {
				const { account, settings, version } = normalizeAccount(res);
				set({ account, settings, zimbraVersion: version });
			}
		})
		.then(() => fetch('/static/iris/components.json'))
		.then((r: any) => r.json())
		.then(({ components }: { components: Array<ZextrasModule> }) => {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			useAppStore.getState().setters.addApps(components);
		})
		.then(() =>
			get().soapFetch(SHELL_APP_ID)<{ _jsns: string }, { tag: Array<Tag> }>('GetTag', {
				_jsns: 'urn:zimbraMail'
			})
		)
		.then((r: any) => set({ tags: r?.tag ?? [] }))
		.catch((err: unknown) => {
			console.log('there was an error checking user data');
			console.error(err);
		});
