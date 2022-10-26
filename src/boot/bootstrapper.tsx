/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { FC, useEffect } from 'react';
import { unloadAllApps } from './app/load-apps';
import BootstrapperContextProvider from './bootstrapper-provider';
import BootstrapperRouter from './bootstrapper-router';
import { init } from './init';
import { ThemeProvider } from './theme-provider';

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
