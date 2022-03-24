/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

export type ThemeExtension = (theme: any) => any;
export type ThemeExtensionMap = Record<string, ThemeExtension>;
