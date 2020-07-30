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

import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useUserAccounts } from './bootstrapper-context';
import LoadingView from './loading-view';
import BootstrapperRouterContent from './bootstrapper-router-content';

export default function BootstrapperRouter() {
	const { accounts, accountLoaded } = useUserAccounts();

	return accountLoaded ?
		(
			<BrowserRouter>
				<BootstrapperRouterContent accounts={accounts} />
			</BrowserRouter>
		)
		:
		(
			<LoadingView />
		);
}
