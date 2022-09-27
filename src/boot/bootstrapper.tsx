/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { FC, useEffect } from 'react';
import { SnackbarManager, ModalManager } from '@zextras/carbonio-design-system';
import { init } from './init';
import { ThemeProvider } from './theme-provider';
import BootstrapperRouter from './bootstrapper-router';
import BootstrapperContextProvider from './bootstrapper-provider';
import { unloadAllApps } from './app/load-apps';

const Bootstrapper: FC = () => {
	useEffect(() => {
		init();
		return () => {
			unloadAllApps();
		};
	}, []);
	return (
		<ThemeProvider>
			<BootstrapperContextProvider>
				<BootstrapperRouter />
			</BootstrapperContextProvider>
		</ThemeProvider>
	);
};

export default Bootstrapper;
