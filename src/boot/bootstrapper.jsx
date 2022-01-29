/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useEffect } from 'react';
import { SnackbarManager, ModalManager } from '@zextras/carbonio-design-system';
import { init } from './init';
import { ThemeProvider } from './theme-provider';
import BootstrapperRouter from './bootstrapper-router';
import BootstrapperContextProvider from './bootstrapper-provider';
import I18nFactory from '../i18n/i18n-factory';
import StoreFactory from '../redux/store-factory';
import { unloadAllApps } from './app/load-apps';

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
			useEffect(() => {
				init(_i18nFactory, _storeFactory);
				return () => unloadAllApps();
			}, []);
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
