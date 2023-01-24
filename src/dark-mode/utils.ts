/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

export const getPrefersColorSchemeDarkMedia = (): MediaQueryList =>
	window.matchMedia('(prefers-color-scheme: dark)');
