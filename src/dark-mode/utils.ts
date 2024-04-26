/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import type { DARK_READER_VALUES } from '../constants';

export const getPrefersColorSchemeDarkMedia = (): MediaQueryList =>
	window.matchMedia('(prefers-color-scheme: dark)');

export type DarkReaderPropValues = (typeof DARK_READER_VALUES)[number];
