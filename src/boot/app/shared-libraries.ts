/*
 * SPDX-FileCopyrightText: 2021 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

/* eslint-disable import/no-duplicates */
/* eslint-disable import/no-named-default */

import React, { ComponentClass } from 'react';
import * as PropTypes from 'prop-types';
import * as ReactDOM from 'react-dom';
import * as Lodash from 'lodash';
import * as ReactRouterDom from 'react-router-dom';
import * as Moment from 'moment';
import * as ReactI18n from 'react-i18next';
// import * as Msw from 'msw';
// import * as Faker from 'faker';
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

import { IShellWindow, SharedLibrariesAppsMap } from '../../../types';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { RichTextEditor } from './rte-wrap';

export function injectSharedLibraries(): void {
	// eslint-disable-next-line max-len
	const wnd: IShellWindow<SharedLibrariesAppsMap, ComponentClass> =
		window as unknown as IShellWindow<SharedLibrariesAppsMap, ComponentClass>;
	if (wnd.__ZAPP_SHARED_LIBRARIES__) {
		return;
	}
	wnd.__ZAPP_SHARED_LIBRARIES__ = {
		'prop-types': PropTypes,
		react: React,
		'react-dom': ReactDOM,
		'react-i18next': ReactI18n,
		'react-redux': ReactRedux,
		lodash: Lodash,
		'react-router-dom': ReactRouterDom,
		moment: Moment,
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
			// wnd.__ZAPP_HMR_HANDLERS__ = {};
			break;
		default:
	}
}
