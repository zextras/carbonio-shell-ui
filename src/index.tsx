/*
 * *** BEGIN LICENSE BLOCK *****
 * Copyright (C) 2011-2020 ZeXtras
 *
 * The contents of this file are subject to the ZeXtras EULA;
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

require.context(
	'file-loader?name=assets/[path][name].[ext]&context=assets/!../assets/',
	true,
	/.*/
);

require.context(
	'file-loader?name=i18n/[name].[ext]&context=.!../translations/',
	true,
	/.*/
);

render(
	(
		<Suspense fallback={<LoadingView />}>
			<LazyBootstrapper />
		</Suspense>
	),
	document.getElementById('app')
);
