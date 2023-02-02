/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
export const testFolderIsChecked = ({ string }: { string: string | undefined }): boolean =>
	/#/.test(string || '');
