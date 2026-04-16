/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { AppErrorCatcher } from './app-error-catcher';
import { ModuleI18nextProvider } from '../module-i18next-provider';

interface AppContextProviderProps {
	pkg: string;
	children: React.ReactNode | React.ReactNode[];
}

/**
 * Provide all the base providers of an app (e.g. i18n)
 * @param pkg - The app key of the module
 * @param children -
 */
export const AppContextProvider = ({
	pkg,
	children
}: AppContextProviderProps): React.JSX.Element => (
	<ModuleI18nextProvider pkg={pkg}>
		<AppErrorCatcher>{children}</AppErrorCatcher>
	</ModuleI18nextProvider>
);
