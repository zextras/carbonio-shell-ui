/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React from 'react';

import { I18nextProvider } from 'react-i18next';

import { SHELL_APP_ID } from '../constants';
import { useI18nStore } from '../store/i18n/store';

interface ModuleI18nextProviderProps {
	pkg: string;
	children: React.ReactNode | React.ReactNode[];
}
export const ModuleI18nextProvider = ({
	pkg,
	children
}: ModuleI18nextProviderProps): React.JSX.Element => {
	const { instances, defaultI18n } = useI18nStore.getState();
	const i18n = instances[pkg] ?? instances[SHELL_APP_ID] ?? defaultI18n;

	return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};
