/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import type { FC } from 'react';
import React from 'react';

import { I18nextProvider } from 'react-i18next';

import { SHELL_APP_ID } from '../constants';
import { useI18nStore } from '../store/i18n/store';

const ShellI18nextProvider: FC = ({ children }) => {
	const i18n = useI18nStore((s) => s.instances[SHELL_APP_ID]);
	return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};
export default ShellI18nextProvider;
