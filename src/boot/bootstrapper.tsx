/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { FC } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ModalManager, SnackbarManager } from '@zextras/carbonio-design-system';
import ShellI18nextProvider from './bootstrapper-provider';
import BootstrapperRouter from './bootstrapper-router';
import { ThemeProvider } from './theme-provider';
import { BASENAME } from '../constants';

const Bootstrapper: FC = () => (
	<ThemeProvider>
		<ShellI18nextProvider>
			<BrowserRouter basename={BASENAME}>
				<SnackbarManager>
					<ModalManager>
						<BootstrapperRouter />
					</ModalManager>
				</SnackbarManager>
			</BrowserRouter>
		</ShellI18nextProvider>
	</ThemeProvider>
);

export default Bootstrapper;
