import { GetState, SetState } from 'zustand';
import { SHELL_APP_ID } from '../constants';
import { useAppStore } from '../store/app/store';
import { normalizeAccount } from '../store/account/normalization';
import { AccountSettings, AccountState, GetInfoResponse, Tag, ZextrasModule } from '../../types';
import { goToLogin } from './go-to-login';

const parsePollingInterval = (settings: AccountSettings): void => {
	const polling = (settings.prefs?.zimbraPrefMailPollingInterval ?? '') as string;
	// if (polling.includes('m')) {
		
	// }
};
export const getInfo = (set: SetState<AccountState>, get: GetState<AccountState>): Promise<void> =>
	get()
		.soapFetch(SHELL_APP_ID)<{ _jsns: string }, GetInfoResponse>('GetInfo', {
			_jsns: 'urn:zimbraAccount'
		})
		.then((res: any): void => {
			if (res) {
				const { account, settings, version } = normalizeAccount(res);
				set({
					account,
					settings,
					// pollingInterval: parsePollingInterval(settings),
					zimbraVersion: version
				});
			}
		})
		.then(() => fetch('/static/iris/components.json'))
		.then((r: any) => r.json())
		.then(({ components }: { components: Array<ZextrasModule> }) => {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			useAppStore.getState().setters.addApps(components);
		})
		.catch((err: unknown) => {
			console.log('there was an error checking user data');
			console.error(err);
			goToLogin();
		});
