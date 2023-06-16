/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import type { Event, EventHint } from '@sentry/browser';

export const report =
	(appId: string) =>
	(error: Event, hint?: EventHint): string =>
		'';

export const feedback = (message: Event): string => '';
