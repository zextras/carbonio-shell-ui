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

import React, { lazy, Suspense } from 'react';
import { render } from 'react-dom';
import BootstrapperRouter from './bootstrapper-router';
import BootstrapperContextProvider from './bootstrapper-context-provider';
import LoadingView from './loading-view';
// TODO: Can be loaded asynchronously
import ShellDb from '../db/shell-db';
import ShellNetworkService from '../network/shell-network-service';
import FiberChannelFactory from '../fiberchannel/fiber-channel';
import I18nProvider from '../i18n/i18n-provider';
import I18nFactory from '../i18n/i18n-factory';

const Bootstrap = lazy(() => {
	const shellDb = new ShellDb();

	return shellDb.open()
		.then((db) => {
			const shellNetworkService = new ShellNetworkService(
				shellDb
			);
			const fiberChannelFactory = new FiberChannelFactory();
			const i18nFactory = new I18nFactory(fiberChannelFactory);

			return {
				'default': () => (
					<BootstrapperContextProvider
						shellDb={db}
						shellNetworkService={shellNetworkService}
						fiberChannelFactory={fiberChannelFactory}
						i18nFactory={i18nFactory}
					>
						<I18nProvider i18n={i18nFactory.getShellI18n()}>
							<BootstrapperRouter />
						</I18nProvider>
					</BootstrapperContextProvider>)
			};
		});
});

export function boot() {
	render(
		(
			<Suspense fallback={<LoadingView />}>
				<Bootstrap />
			</Suspense>
		),
		document.getElementById('app')
	);
}
