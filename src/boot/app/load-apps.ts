/*
 * *** BEGIN LICENSE BLOCK *****
 * Copyright (C) 2011-2021 Zextras
 *
 *  The contents of this file are subject to the Zextras EULA;
 * you may not use this file except in compliance with the EULA.
 * You may obtain a copy of the EULA at
 * http://www.zextras.com/zextras-eula.html
 * *** END LICENSE BLOCK *****
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
		sortBy(appsToLoad, (app) => -app.core.priority),
		(app) => loadApp(app.core, storeFactory)
	);
}

export function unloadAllApps(): Promise<void> {
	return unloadApps();
}
