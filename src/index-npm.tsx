/*
 * SPDX-FileCopyrightText: 2021 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import './index.css';

import React, { Suspense } from 'react';
import { render } from 'react-dom';
import LoadingView from './boot/loading-view';
import LazyBootstrapper from './boot/lazy-bootstrapper';
import loadDevelopmentEnv from './dev/dev-utils-injector';

render(
	<Suspense fallback={<LoadingView />}>
		<LazyBootstrapper onBeforeBoot={loadDevelopmentEnv} />
	</Suspense>,
	document.getElementById('app')
);
