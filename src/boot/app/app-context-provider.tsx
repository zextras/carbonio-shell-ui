/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { FC, useMemo } from 'react';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { ModalManager, SnackbarManager } from '@zextras/carbonio-design-system';
import { useStoreFactory, useI18nFactory } from '../bootstrapper-context';
import AppErrorCatcher from './app-error-catcher';
import { getApp, getShell } from '../../store/app';

const AppContextProvider: FC<{ pkg: string }> = ({ pkg, children }) => {
	const i18nFactory = useI18nFactory();
	const storeFactory = useStoreFactory();
	const app = useMemo(() => getApp(pkg)() ?? getShell(), [pkg]);
	const store = useMemo(() => storeFactory.getStoreForApp(app), [app, storeFactory]);
	const i18n = useMemo(() => i18nFactory.getAppI18n(app), [i18nFactory, app]);
	return (
		<Provider store={store}>
			<I18nextProvider i18n={i18n}>
				<ModalManager>
					<SnackbarManager>
						<AppErrorCatcher>{children}</AppErrorCatcher>
					</SnackbarManager>
				</ModalManager>
			</I18nextProvider>
		</Provider>
	);
};

export default AppContextProvider;
