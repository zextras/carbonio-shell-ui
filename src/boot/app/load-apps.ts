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
import { default as Lodash, map, orderBy, compact, keyBy, forOwn, filter } from 'lodash';
import * as RxJS from 'rxjs';
import React, { ComponentClass } from 'react';
import * as ReactDOM from 'react-dom';
import * as RxJSOperators from 'rxjs/operators';
import * as ReactRouterDom from 'react-router-dom';
import * as PropTypes from 'prop-types';
import * as Moment from 'moment';
import * as ReactI18n from 'react-i18next';
import * as Msw from 'msw';
import * as Faker from 'faker';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as ReactRedux from 'react-redux';
import * as ReduxJSToolkit from '@reduxjs/toolkit';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as ZappUI from '@zextras/zapp-ui';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as StyledComponents from 'styled-components';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { RichTextEditor } from '@zextras/zapp-ui/dist/zapp-ui.rich-text-editor';

import StoreFactory from '../../redux/store-factory';

import { appStore } from '../../store/app';
import {
	IShellWindow,
	loadApp,
	LoadedAppsCache,
	SharedLibrariesAppsMap,
	_scripts,
	unloadApps
} from './load-app';
import { AppData } from '../../store/app/store-types';

function injectSharedLibraries(): void {
	// eslint-disable-next-line max-len
	const wnd: IShellWindow<
		SharedLibrariesAppsMap,
		ComponentClass
	> = (window as unknown) as IShellWindow<SharedLibrariesAppsMap, ComponentClass>;
	if (wnd.__ZAPP_SHARED_LIBRARIES__) {
		return;
	}
	wnd.__ZAPP_SHARED_LIBRARIES__ = {
		react: React,
		'react-dom': ReactDOM,
		'react-i18next': ReactI18n,
		'react-redux': ReactRedux,
		lodash: Lodash,
		rxjs: RxJS,
		'rxjs/operators': RxJSOperators,
		'react-router-dom': ReactRouterDom,
		moment: Moment,
		'prop-types': PropTypes,
		'styled-components': StyledComponents,
		'@reduxjs/toolkit': {
			...ReduxJSToolkit,
			configureStore: (): void => {
				throw new Error('Apps must use the store given by the Shell.');
			},
			createStore: (): void => {
				throw new Error('Apps must use the store given by the Shell.');
			}
		},
		'@zextras/zapp-shell': {},
		'@zextras/zapp-ui': { ...ZappUI, RichTextEditor }
	};
	wnd.__ZAPP_HMR_EXPORT__ = {};
	switch (FLAVOR) {
		case 'NPM':
			wnd.__ZAPP_SHARED_LIBRARIES__.faker = Faker;
			wnd.__ZAPP_SHARED_LIBRARIES__.msw = Msw;
			wnd.__ZAPP_HMR_HANDLERS__ = {};
			break;
		default:
	}
}

export function loadApps(
	storeFactory: StoreFactory,
	apps: Array<AppData>
): Promise<LoadedAppsCache> {
	injectSharedLibraries();
	const appsToLoad =
		typeof cliSettings === 'undefined' || cliSettings.enableErrorReporter
			? apps
			: filter(apps, (app) => app.core.name !== 'carbonio-error-reporter');
	console.log(
		'%cLOADING APPS',
		'color: white; background: #2b73d2;padding: 4px 8px 2px 4px; font-family: sans-serif; border-radius: 12px; width: 100%'
	);
	return Promise.all(map(appsToLoad, (app) => loadApp(app.core, storeFactory)))
		.then((loaded) => compact(loaded))
		.then((loaded) => keyBy(loaded, 'pkg.name'));
}

export function unloadAllApps(): Promise<void> {
	return unloadApps();
}
