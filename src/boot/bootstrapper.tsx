/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { FC, useEffect, useMemo } from 'react';
import { SnackbarManager, ModalManager } from '@zextras/carbonio-design-system';
import { useTranslation } from 'react-i18next';
import { init } from './init';
import { ThemeProvider } from './theme-provider';
import BootstrapperRouter from './bootstrapper-router';
import BootstrapperContextProvider from './bootstrapper-provider';
import I18nFactory from '../i18n/i18n-factory';
import StoreFactory from '../redux/store-factory';
import { unloadAllApps } from './app/load-apps';
import { registerDefaultViews } from './app/default-views';

const DefaultViewsRegister: FC = () => {
	const [t] = useTranslation();
	useEffect(() => {
		registerDefaultViews(t);
	}, [t]);
	return null;
};

const Bootstrapper: FC = () => {
	const i18nFactory = useMemo(() => new I18nFactory(), []);
	const storeFactory = useMemo(() => new StoreFactory(), []);
	useEffect(() => {
		init(i18nFactory, storeFactory);
		return () => {
			unloadAllApps();
		};
	}, [i18nFactory, storeFactory]);
	return (
		<ThemeProvider>
			<SnackbarManager>
				<ModalManager>
					<BootstrapperContextProvider i18nFactory={i18nFactory} storeFactory={storeFactory}>
						<DefaultViewsRegister />
						<BootstrapperRouter />
					</BootstrapperContextProvider>
				</ModalManager>
			</SnackbarManager>
		</ThemeProvider>
	);
};

export default Bootstrapper;
