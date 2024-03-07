/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import type { FC } from 'react';
import React from 'react';

import { I18nextProvider } from 'react-i18next';

import AppErrorCatcher from './app-error-catcher';
import { SHELL_APP_ID } from '../../constants';
import { useI18nStore } from '../../store/i18n/store';

const AppContextProvider: FC<{ pkg: string }> = ({ pkg, children }) => {
	const { instances, defaultI18n } = useI18nStore.getState();
	const i18n = instances[pkg] ?? instances[SHELL_APP_ID] ?? defaultI18n;
	return (
		<I18nextProvider i18n={i18n}>
			<AppErrorCatcher>{children}</AppErrorCatcher>
		</I18nextProvider>
	);
};

export default AppContextProvider;
