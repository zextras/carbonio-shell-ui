import { getIntegratedFunction } from '../store/integrations/getters';
import { ZextrasModule } from '../store/account/types';

export const report = (app: ZextrasModule) => (error: Error, hint?: unknown): void => {
	const [reportError, available] = getIntegratedFunction('report-error');
	if (available) {
		reportError(error, app, hint);
	}
};
