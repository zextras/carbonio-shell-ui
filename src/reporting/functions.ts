/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

/**
 * @deprecated it will be removed in the next release
 */
export const report =
	(appId: string) =>
	(error: Event, hint?: unknown): void => {
		console.warn('report function is deprecated');
	};
