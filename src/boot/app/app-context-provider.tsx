/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { FC } from 'react';

import AppErrorCatcher from './app-error-catcher';
import { ModuleI18nextProvider } from '../module-i18next-provider';

const AppContextProvider: FC<{ pkg: string }> = ({ pkg, children }) => (
	<ModuleI18nextProvider pkg={pkg}>
		<AppErrorCatcher>{children}</AppErrorCatcher>
	</ModuleI18nextProvider>
);
export default AppContextProvider;
