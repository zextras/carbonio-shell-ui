/*
 * SPDX-FileCopyrightText: 2025 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import type { AppDependantExports } from './boot/app/app-dependant-exports';
import { getAppDependantExports } from './boot/app/app-dependant-exports';
import { useAccountStore } from './store/account';
import { useAppStore } from './store/app';
import type { AccountState } from './types/account';
import type { CarbonioModule } from './types/apps';

export const testingUtility = {
	initShell: (apps: Array<Partial<CarbonioModule>>): void => {
		useAppStore.getState().setApps(apps);
	},
	getAppExports: (app: CarbonioModule): AppDependantExports => getAppDependantExports(app),

	setAccounts: (state: AccountState): void => {
		useAccountStore.setState(state);
	}
};
