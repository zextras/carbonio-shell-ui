import { useAccountStore } from './account-store';
import { goToLogin } from './go-to-login';

export const logout = (): Promise<any> =>
	useAccountStore
		.getState()
		.soapFetch('EndSession', {
			_jsns: 'urn:zimbraAccount'
		})
		.then(goToLogin);
