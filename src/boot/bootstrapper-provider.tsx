/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { FC } from 'react';
import { I18nextProvider } from 'react-i18next';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { useI18nStore } from '../store/i18n';

const BootstrapperContextProvider: FC = ({ children }) => (
	<I18nextProvider i18n={useI18nStore.getState().defaultI18n}>{children}</I18nextProvider>
);
export default BootstrapperContextProvider;
