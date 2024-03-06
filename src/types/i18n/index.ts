/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import type { i18n } from 'i18next';

import type { CarbonioModule } from '../apps';

export type I18nState = {
	instances: Record<string, i18n>;
	defaultI18n: i18n;
	locale: string;
	setters: {
		setLocale: (locale: string) => void;
	};
	actions: {
		addI18n: (apps: Array<CarbonioModule>, locale: string) => void;
	};
};
