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

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ThemeProvider } from './shell-theme-context-provider';
import BootstrapperRouter from './bootstrapper-router';
import BootstrapperContextProvider from './bootstrapper-context-provider';
import ShellNetworkService from '../network/shell-network-service';
import FiberChannelFactory from '../fiberchannel/fiber-channel';
import I18nFactory from '../i18n/i18n-factory';
import createShellStore from '../store/create-shell-store';
import StoreFactory from '../store/store-factory';
import { useAppStore } from '../app-store';
import { useUserAccounts } from '../store/shell-store-hooks';
import { settingsAppData, getSettingsCore } from '../settings/settings-app';
import { searchAppData, getSearchCore } from '../search/search-app';
import { SETTINGS_APP_ID, SEARCH_APP_ID } from '../constants';

const AppStoreInterface = () => {
	const { addApps, registerAppData } = useAppStore((s) => s.setters);
	const accounts = useUserAccounts();
	const [status, setStatus] = useState(0);
	const [t] = useTranslation();
	useEffect(() => {
		if (accounts && accounts.length > 0 && status === 0) {
			addApps([...accounts[0].apps, getSettingsCore(t), getSearchCore(t)]);
			setStatus(1);
		}
		if (status === 1) {
			registerAppData(SETTINGS_APP_ID)(settingsAppData);
			registerAppData(SEARCH_APP_ID)(searchAppData);
			setStatus(2);
		}
	}, [accounts, addApps, status, registerAppData, t]);
	return null;
};

export default function bootstrapper(onBeforeBoot) {
	// const { shellStore, shellStorePersistor } = createShellStore(true);

	const fiberChannelFactory = new FiberChannelFactory();
	const i18nFactory = new I18nFactory();
	const storeFactory = new StoreFactory();

	const container = {
		fiberChannelFactory,
		i18nFactory,
		storeFactory
	};

	return (onBeforeBoot
		? onBeforeBoot(container)
				.then(() => container)
				.catch((err) => {
					throw err;
				})
		: Promise.resolve(container)
	).then(
		({
			fiberChannelFactory: _fiberChannelFactory,
			i18nFactory: _i18nFactory,
			shellNetworkService: _shellNetworkService,
			storeFactory: _storeFactory
		}) => ({
			default: function BoostrapperCls() {
				return (
					<ThemeProvider>
						<BootstrapperContextProvider
							fiberChannelFactory={_fiberChannelFactory}
							i18nFactory={_i18nFactory}
							shellNetworkService={_shellNetworkService}
							storeFactory={_storeFactory}
						>
							<AppStoreInterface />
							<BootstrapperRouter />
						</BootstrapperContextProvider>
					</ThemeProvider>
				);
			}
		})
	);
}
