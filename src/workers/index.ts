/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const tagWorker = new Worker(new URL('./tag', import.meta.url));
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const folderWorker = new Worker(new URL('./folder', import.meta.url));
