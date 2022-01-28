/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { CarbonioModule } from '../../types';
import { getIntegratedFunction } from '../store/integrations/getters';

export const report =
	(app: CarbonioModule) =>
	(error: Error, hint?: unknown): void => {
		const [reportError, available] = getIntegratedFunction('report-error');
		if (available) {
			reportError(error, app, hint);
		}
	};
