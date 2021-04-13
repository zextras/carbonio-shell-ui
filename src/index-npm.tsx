/*
 * *** BEGIN LICENSE BLOCK *****
 * Copyright (C) 2011-2020 Zextras
 *
 *  The contents of this file are subject to the Zextras EULA;
 * you may not use this file except in compliance with the EULA.
 * You may obtain a copy of the EULA at
 * http://www.zextras.com/zextras-eula.html
 * *** END LICENSE BLOCK *****
 */
import './index.css';

import React, { Suspense } from 'react';
import { render } from 'react-dom';
import LoadingView from './bootstrap/loading-view';
import LazyBootstrapper from './bootstrap/lazy-bootstrapper';
import loadDevelopmentEnv from './dev/dev-utils-injector';

render(
	<Suspense fallback={<LoadingView />}>
		<LazyBootstrapper onBeforeBoot={loadDevelopmentEnv} />
	</Suspense>,
	document.getElementById('app')
);
