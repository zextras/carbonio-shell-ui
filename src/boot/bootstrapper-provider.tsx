/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { FC } from 'react';
import { I18nextProvider } from 'react-i18next';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import BoardContextProvider from '../shell/boards/board-context-provider';
import { BootstrapperContext } from './bootstrapper-context';
import I18nFactory from '../i18n/i18n-factory';
import StoreFactory from '../redux/store-factory';

const BootstrapperContextProvider: FC<{ i18nFactory: I18nFactory; storeFactory: StoreFactory }> = ({
	children,
	i18nFactory,
	storeFactory
}) => (
	<BootstrapperContext.Provider
		value={{
			storeFactory,
			i18nFactory
		}}
	>
		<I18nextProvider i18n={i18nFactory.getShellI18n()}>
			<BoardContextProvider>{children}</BoardContextProvider>
		</I18nextProvider>
	</BootstrapperContext.Provider>
);
export default BootstrapperContextProvider;
