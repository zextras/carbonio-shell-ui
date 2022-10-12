/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ThemeProvider as ThemeProviderMui } from '@mui/material';
import { ModalManager, SnackbarManager } from '@zextras/carbonio-design-system';
import React, { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { themeMui } from '../theme-mui/theme';
import { registerDefaultViews } from './app/default-views';
import { unloadAllApps } from './app/load-apps';
import BootstrapperContextProvider from './bootstrapper-provider';
import BootstrapperRouter from './bootstrapper-router';
import { init } from './init';
import { ThemeProvider as ThemeProviderDS } from './theme-provider';

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
		<ThemeProviderDS>
			<ThemeProviderMui theme={themeMui}>
				<SnackbarManager>
					<ModalManager>
						<BootstrapperContextProvider>
							<DefaultViewsRegister />
							<BootstrapperRouter />
						</BootstrapperContextProvider>
					</ModalManager>
				</SnackbarManager>
			</ThemeProviderMui>
		</ThemeProviderDS>
	);
};

export default Bootstrapper;
