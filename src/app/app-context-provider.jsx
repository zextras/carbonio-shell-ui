/*
 * *** BEGIN LICENSE BLOCK *****
 * Copyright (C) 2011-2021 Zextras
 *
 *  The contents of this file are subject to the Zextras EULA;
 * you may not use this file except in compliance with the EULA.
 * You may obtain a copy of the EULA at
 * http://www.zextras.com/zextras-eula.html
 * *** END LICENSE BLOCK *****
 */

import React, { useMemo } from 'react';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { ModalManager, SnackbarManager } from '@zextras/zapp-ui';
import { useStoreFactory, useI18nFactory } from '../boot/bootstrapper-context';
import AppErrorCatcher from './app-error-catcher';
import { useAppStore } from '../app-store';

export default function AppContextProvider({ pkg, children }) {
	const i18nFactory = useI18nFactory();
	const storeFactory = useStoreFactory();
	const app = useAppStore((s) => s.apps[pkg]?.core);

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
}
