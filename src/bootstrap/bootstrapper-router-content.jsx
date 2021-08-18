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
import React, { Suspense } from 'react';
import LoadingView from './loading-view';
import { LazyShellView } from './bootstrapper-lazy-loader';
import { goToLogin } from '../account/go-to-login';

export default function BootstrapperRouterContent() {
	return (
		<Suspense fallback={<LoadingView />}>
			<LazyShellView />
		</Suspense>
	);
}
