/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { FC, useEffect } from 'react';
import { SnackbarManager, ModalManager } from '@zextras/carbonio-design-system';
import { useTranslation } from 'react-i18next';
import { init } from './init';
import { ThemeProvider } from './theme-provider';
import BootstrapperRouter from './bootstrapper-router';
import BootstrapperContextProvider from './bootstrapper-provider';
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
	useEffect(() => {
		init();
		return () => {
			unloadAllApps();
		};
	}, []);
	return (
		<ThemeProvider>
			<SnackbarManager>
				<ModalManager>
					<BootstrapperContextProvider>
						<DefaultViewsRegister />
						<BootstrapperRouter />
					</BootstrapperContextProvider>
				</ModalManager>
			</SnackbarManager>
		</ThemeProvider>
	);
};

export default Bootstrapper;
