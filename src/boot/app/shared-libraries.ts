/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

/* eslint-disable import/no-duplicates */
/* eslint-disable import/no-named-default */

import * as Lodash from 'lodash';
import * as Moment from 'moment';
import * as PropTypes from 'prop-types';
import React from 'react';
import * as ReactDOM from 'react-dom';
import * as ReactI18n from 'react-i18next';
import * as ReactRouterDom from 'react-router-dom';
// import * as Msw from 'msw';
// import * as Faker from 'faker';
import * as ReduxJSToolkit from '@reduxjs/toolkit';
import * as ZappUI from '@zextras/carbonio-design-system';
import * as ReactRedux from 'react-redux';
import * as StyledComponents from 'styled-components';
// import * as Preview from '../../preview';
import * as Preview from '@zextras/carbonio-ui-preview';

import { IShellWindow } from '../../../types';

export function injectSharedLibraries(): void {
	const wnd: IShellWindow = window as unknown as IShellWindow;
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
		'@reduxjs/toolkit': ReduxJSToolkit,
		'@zextras/carbonio-shell-ui': {},
		'@zextras/carbonio-design-system': ZappUI,
		'@zextras/carbonio-ui-preview': Preview
	};
	wnd.__ZAPP_HMR_EXPORT__ = {};
}
