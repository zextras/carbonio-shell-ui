/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ModalManager, SnackbarManager } from '@zextras/carbonio-design-system';
import { BASENAME } from '../constants';
import { ShellI18nextProvider } from './shell-i18n-provider';
import { ThemeProvider } from './theme-provider';

interface GlobalProvidersWrapperProps {
	children?: React.ReactNode;
}

export const GlobalProvidersWrapper = ({ children }: GlobalProvidersWrapperProps): JSX.Element => (
	<BrowserRouter basename={BASENAME}>
		<ShellI18nextProvider>
			<ThemeProvider>
				<SnackbarManager>
					<ModalManager>{children}</ModalManager>
				</SnackbarManager>
			</ThemeProvider>
		</ShellI18nextProvider>
	</BrowserRouter>
);
