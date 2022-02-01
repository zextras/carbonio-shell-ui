/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

/* eslint-disable import/no-import-module-exports */

import './index.css';
import React, { lazy, Suspense } from 'react';
import { render } from 'react-dom';
import LoadingView from './boot/splash';

const Bootstrapper = lazy(() => import('./boot/bootstrapper'));

if (module.hot) module.hot.accept();
render(
	<Suspense fallback={<LoadingView />}>
		<Bootstrapper />
	</Suspense>,
	document.getElementById('app')
);
