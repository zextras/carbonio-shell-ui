/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React from 'react';

import AppErrorCatcher from './app-error-catcher';
import { ModuleI18nextProvider } from '../module-i18next-provider';

interface AppContextProviderProps {
	pkg: string;
	children: React.ReactNode | React.ReactNode[];
}

const AppContextProvider = ({ pkg, children }: AppContextProviderProps): React.JSX.Element => (
	<ModuleI18nextProvider pkg={pkg}>
		<AppErrorCatcher>{children}</AppErrorCatcher>
	</ModuleI18nextProvider>
);

export default AppContextProvider;
