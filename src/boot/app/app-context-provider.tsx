/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { FC } from 'react';
import { I18nextProvider } from 'react-i18next';
import { ModalManager, SnackbarManager } from '@zextras/carbonio-design-system';
import AppErrorCatcher from './app-error-catcher';
import { useI18n } from '../../store/i18n';

const AppContextProvider: FC<{ pkg: string }> = ({ pkg, children }) => {
	const i18n = useI18n(pkg)();
	return (
		<I18nextProvider i18n={i18n}>
			<ModalManager>
				<SnackbarManager>
					<AppErrorCatcher>{children}</AppErrorCatcher>
				</SnackbarManager>
			</ModalManager>
		</I18nextProvider>
	);
};

export default AppContextProvider;
