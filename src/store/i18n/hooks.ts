/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import type { i18n, TFunction } from 'i18next';

import { useI18nStore } from './store';
import { SHELL_APP_ID } from '../../constants';

export const getI18n = (app: string) => (): i18n => {
	const { instances, defaultI18n } = useI18nStore.getState();
	return instances[app] ?? instances[SHELL_APP_ID] ?? defaultI18n;
};

export const getTFunction = (app: string): TFunction => {
	const { instances, defaultI18n } = useI18nStore.getState();
	return instances[app]?.t ?? defaultI18n.t;
};

export const getT = (): TFunction => {
	const { instances, defaultI18n } = useI18nStore.getState();
	return instances[SHELL_APP_ID]?.t ?? defaultI18n.t;
};
