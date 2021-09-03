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
import { ThemeProvider } from './theme-provider';
import BootstrapperRouter from './bootstrapper-router';
import BootstrapperContextProvider from './bootstrapper-provider';
import I18nFactory from '../i18n/i18n-factory';
import StoreFactory from '../redux/store-factory';
import { useAppStore } from '../store/app';
import { settingsAppData, getSettingsCore } from '../settings/settings-app';
import { searchAppData, getSearchCore } from '../search/search-app';
import { SETTINGS_APP_ID, SEARCH_APP_ID } from '../constants';
import { useAccountStore } from '../store/account/account-store';
import { useUserAccount } from '../store/account/hooks';
import { AppLoader } from './app/app-loader';

// const AppStoreInterface = () => {
// 	const { addApps, registerAppData } = useAppStore((s) => s.setters);
// 	const account = useUserAccount;
// 	const [status, setStatus] = useState(0);
// 	const [t] = useTranslation();
// 	useEffect(() => {
// 		if (status === 1) {
// 			registerAppData(SETTINGS_APP_ID)(settingsAppData);
// 			registerAppData(SEARCH_APP_ID)(searchAppData);
// 			setStatus(2);
// 		}
// 	}, [addApps, status, registerAppData, t, account]);
// 	return null;
// };

export default function bootstrapper(onBeforeBoot) {
	// const { shellStore, shellStorePersistor } = createShellStore(true);

	const i18nFactory = new I18nFactory();
	const storeFactory = new StoreFactory();

	const container = {
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
	).then(({ i18nFactory: _i18nFactory, storeFactory: _storeFactory }) => ({
		default: function BoostrapperCls() {
			const init = useAccountStore((s) => s.init);
			useEffect(() => {
				init();
			}, [init]);
			return (
				<ThemeProvider>
					<BootstrapperContextProvider i18nFactory={_i18nFactory} storeFactory={_storeFactory}>
						<AppLoader />
						{/* <AppStoreInterface /> */}
						<BootstrapperRouter />
					</BootstrapperContextProvider>
				</ThemeProvider>
			);
		}
	}));
}
