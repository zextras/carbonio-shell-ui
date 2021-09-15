import { SHELL_APP_ID } from '../constants';
import { useAccountStore } from '../store/account/store';
import { goToLogin } from './go-to-login';

export const logout = (): Promise<void> =>
	useAccountStore
		.getState()
		.soapFetch(SHELL_APP_ID)('EndSession', {
			_jsns: 'urn:zimbraAccount'
		})
		.then(goToLogin);
