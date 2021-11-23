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
