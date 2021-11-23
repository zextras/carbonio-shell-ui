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
