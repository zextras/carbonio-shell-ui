/*
 * SPDX-FileCopyrightText: 2021 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

/* eslint-disable import/no-import-module-exports */

import './index.css';
import React, { Suspense } from 'react';
import { render } from 'react-dom';
import LoadingView from './boot/loading-view';
import LazyBootstrapper from './boot/lazy-bootstrapper';

if (module.hot) module.hot.accept();

render(
	<Suspense fallback={<LoadingView />}>
		<LazyBootstrapper />
	</Suspense>,
	document.getElementById('app')
);
