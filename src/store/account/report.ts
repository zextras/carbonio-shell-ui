import { getIntegratedFunction } from '../integrations/getters';
import { ZextrasModule } from './types';

export const report = (app: ZextrasModule) => (error: Error, hint?: unknown): void => {
	const [reportError, available] = getIntegratedFunction('report-error');
	if (available) {
		reportError(error, app, hint);
	}
};
