/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { DefaultTheme } from 'styled-components';

export type ThemeExtension = (theme: DefaultTheme) => DefaultTheme;
