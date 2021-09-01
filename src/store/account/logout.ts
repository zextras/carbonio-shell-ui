import { SHELL_APP_ID } from '../../constants';
import { baseJsonFetch } from './fetch';
import { goToLogin } from './go-to-login';

export const logout = (): Promise<void> =>
	baseJsonFetch(SHELL_APP_ID, 'EndSession', {
		_jsns: 'urn:zimbraAccount'
	}).then(goToLogin);
