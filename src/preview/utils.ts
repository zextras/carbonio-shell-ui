/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: T[SubKey] };
