/* eslint-disable import/no-import-module-exports */
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
