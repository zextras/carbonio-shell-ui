/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { i18n } from 'i18next';

export type I18nState = {
	instances: Record<string, i18n>;
	defaultI18n: i18n;
	locale: string;
};
