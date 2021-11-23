/*
 * SPDX-FileCopyrightText: 2021 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

/* eslint-disable import/no-duplicates */
/* eslint-disable import/no-named-default */
import { filter, forEach, sortBy } from 'lodash';

import StoreFactory from '../../redux/store-factory';

import { loadApp, unloadApps } from './load-app';
import { AppData } from '../../../types';
import { injectSharedLibraries } from './shared-libraries';

export function loadApps(storeFactory: StoreFactory, apps: Array<AppData>): void {
	injectSharedLibraries();
	const appsToLoad =
		typeof cliSettings === 'undefined' || cliSettings.enableErrorReporter
			? apps
			: filter(apps, (app) => app.core.name !== 'carbonio-error-reporter');
	console.log(
		'%cLOADING APPS',
		'color: white; background: #2b73d2;padding: 4px 8px 2px 4px; font-family: sans-serif; border-radius: 12px; width: 100%'
	);
	forEach(
		sortBy(appsToLoad, (app) => app.core.priority),
		(app) => loadApp(app.core, storeFactory)
	);
}

export function unloadAllApps(): Promise<void> {
	return unloadApps();
}
