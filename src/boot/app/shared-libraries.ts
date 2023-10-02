/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React from 'react';

import * as ReduxJSToolkit from '@reduxjs/toolkit';
import * as ZappUI from '@zextras/carbonio-design-system';
import * as Preview from '@zextras/carbonio-ui-preview';
import * as Darkreader from 'darkreader';
import * as Lodash from 'lodash';
import * as Moment from 'moment';
import * as ReactDOM from 'react-dom';
import * as ReactI18n from 'react-i18next';
import * as ReactRedux from 'react-redux';
import * as ReactRouterDom from 'react-router-dom';
import * as StyledComponents from 'styled-components';

export function injectSharedLibraries(): void {
	if (!window.__ZAPP_SHARED_LIBRARIES__) {
		window.__ZAPP_SHARED_LIBRARIES__ = {
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
			'@zextras/carbonio-ui-preview': Preview,
			darkreader: Darkreader
		};
		window.__ZAPP_HMR_EXPORT__ = {};
	}
}
