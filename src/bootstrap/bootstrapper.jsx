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

import React from 'react';
import BootstrapperRouter from './bootstrapper-router';
import BootstrapperContextProvider from './bootstrapper-context-provider';
import ShellNetworkService from '../network/shell-network-service';
import FiberChannelFactory from '../fiberchannel/fiber-channel';
import I18nFactory from '../i18n/i18n-factory';
import createShellStore from '../store/create-shell-store';
import StoreFactory from '../store/store-factory';
import AppLoaderContextProvider from '../app/app-loader-context-provider';
import AppLoaderMounter from '../app/app-loader-mounter';
import ShellThemeProvider from '../shell/shell-theme-provider';

export default function bootstrapper(onBeforeBoot) {
	const { shellStore, shellStorePersistor } = createShellStore();

	const fiberChannelFactory = new FiberChannelFactory();
	const i18nFactory = new I18nFactory(fiberChannelFactory);
	const shellNetworkService = new ShellNetworkService(
		shellStore,
		fiberChannelFactory
	);
	const storeFactory = new StoreFactory();

	const container = {
		fiberChannelFactory,
		i18nFactory,
		shellNetworkService,
		shellStore,
		storeFactory,
	};

	return ((onBeforeBoot)
		? (onBeforeBoot(container)
			.then(() => (container))
			.catch((err) => {
				throw err;
			}))
		: (Promise.resolve((container))))
		.then(({
			fiberChannelFactory: _fiberChannelFactory,
			i18nFactory: _i18nFactory,
			shellNetworkService: _shellNetworkService,
			shellStore: _shellStore,
			storeFactory: _storeFactory,
		}) => ({
			default: () => (
				<BootstrapperContextProvider
					fiberChannelFactory={_fiberChannelFactory}
					i18nFactory={_i18nFactory}
					shellNetworkService={_shellNetworkService}
					shellStore={_shellStore}
					storeFactory={_storeFactory}
					shellStorePersistor={shellStorePersistor}
				>
					<BootstrapperRouter />
				</BootstrapperContextProvider>
			)
		}));
}
