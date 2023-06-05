/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { CSSProperties } from 'react';

export type SizeAndPosition = {
	width: number;
	height: number;
	top: number;
	left: number;
};

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

export function setElementSizeAndPosition(
	element: HTMLElement,
	key: keyof SizeAndPosition,
	value: number | undefined
): void {
	// eslint-disable-next-line no-param-reassign
	element.style[key] = value !== undefined ? `${value}px` : '';
}
