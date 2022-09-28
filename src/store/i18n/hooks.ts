/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { i18n, TFunction } from 'i18next';
import { useI18nStore } from './store';

export const useI18n = (app: string) => (): i18n =>
	// eslint-disable-next-line react-hooks/rules-of-hooks
	useI18nStore((s) => s.instances[app] ?? s.defaultI18n);

export const useLocale = (): string => useI18nStore((s) => s.locale);

export const getI18n = (app: string) => (): i18n => {
	const { instances, defaultI18n } = useI18nStore.getState();
	return instances[app] ?? defaultI18n;
};

export const getTFunction = (app: string): TFunction => {
	const { instances, defaultI18n } = useI18nStore.getState();
	return instances[app]?.t ?? defaultI18n.t;
};

export const getLocale = (): string => useI18nStore.getState().locale;
