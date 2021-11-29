/*
 * SPDX-FileCopyrightText: 2021 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useEffect } from 'react';
import { SnackbarManager, ModalManager } from '@zextras/zapp-ui';
import { ThemeProvider } from './theme-provider';
import BootstrapperRouter from './bootstrapper-router';
import BootstrapperContextProvider from './bootstrapper-provider';
import I18nFactory from '../i18n/i18n-factory';
import StoreFactory from '../redux/store-factory';
import { useAppStore } from '../store/app/store';
import { useAccountStore } from '../store/account/store';
import { loadApps, unloadAllApps } from './app/load-apps';

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

function bootstrapper(onBeforeBoot) {
	// const { shellStore, shellStorePersistor } = createShellStore(true);
	const i18nFactory = new I18nFactory();
	const storeFactory = new StoreFactory();

	const container = {
		i18nFactory,
		storeFactory
	};

	return (
		onBeforeBoot
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
				init().then(() => {
					_i18nFactory.setLocale(
						useAccountStore.getState()?.settings?.prefs?.zimbraPrefLocale?.split?.('_')?.[0] ?? 'en'
					);
					loadApps(_storeFactory, useAppStore.getState().apps);
				});
				return () => unloadAllApps();
			}, [init]);
			return (
				<ThemeProvider>
					<SnackbarManager>
						<ModalManager>
							<BootstrapperContextProvider i18nFactory={_i18nFactory} storeFactory={_storeFactory}>
								<BootstrapperRouter />
							</BootstrapperContextProvider>
						</ModalManager>
					</SnackbarManager>
				</ThemeProvider>
			);
		}
	}));
}

export default bootstrapper;
