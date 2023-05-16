/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { CSSProperties } from 'react';

export const testFolderIsChecked = ({ string }: { string: string | undefined }): boolean =>
	/#/.test(string || '');

export function setGlobalCursor(cursor: CSSProperties['cursor']): void {
	// remove previously set cursor
	const cursors: string[] = [];
	document.body.classList.forEach((item) => {
		if (item.startsWith('global-cursor-')) {
			cursors.push(item);
		}
	});
	document.body.classList.remove(...cursors);
	if (cursor) {
		document.body.classList.add(`global-cursor-${cursor}`);
	}
}
