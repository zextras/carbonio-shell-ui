import { find } from 'lodash';
import { SHELL_APP_ID } from '../../constants';
import { useAppStore } from '../app';
import { useAccountStore } from './account-store';
import { baseJsonFetch } from './fetch';
import { normalizeAccount } from './normalization';
import { GetInfoResponse, ZextrasModule, Tag } from './types';

export const getInfo = (): Promise<void> =>
	baseJsonFetch<{ _jsns: string }, GetInfoResponse>(SHELL_APP_ID, 'GetInfo', {
		_jsns: 'urn:zimbraAccount'
	})
		.then((res): void => {
			if (res) {
				const { account, settings, version } = normalizeAccount(res);
				useAccountStore.setState({ account, settings, zimbraVersion: version });
			}
		})
		.then(() => fetch('/static/iris/components.json'))
		.then((r) => r.json())
		.then(({ components }: { components: Array<ZextrasModule> }) => {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			useAccountStore.setState({ shell: find(components, (c) => c.name === SHELL_APP_ID)! });
			useAppStore.getState().setters.addApps(components);
		})
		.then(() =>
			baseJsonFetch<{ _jsns: string }, { tag: Array<Tag> }>(SHELL_APP_ID, 'GetTag', {
				_jsns: 'urn:zimbraMail'
			})
		)
		.then((r) => useAccountStore.setState({ tags: r?.tag ?? [] }))
		.catch((err) => {
			console.log('there was an error checking user data');
			console.error(err);
		});
