/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React, { CSSProperties } from 'react';

import { reduce } from 'lodash';

export type ElementPosition = {
	top: number;
	left: number;
};

export type ElementSize = {
	width: number;
	height: number;
};

export type SizeAndPosition = ElementPosition & ElementSize;

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

export function stopPropagation(event: Event | React.SyntheticEvent): void {
	event.stopPropagation();
}

export function createExportForTestOnly<TObj extends Record<string, unknown>>(
	objToExport: TObj
): { [K in keyof TObj]: TObj[K] | undefined } {
	return process.env.NODE_ENV === 'test'
		? objToExport
		: reduce(
				objToExport,
				(accumulator, value, key) => {
					accumulator[key as keyof TObj] = undefined;
					return accumulator;
				},
				{} as Record<keyof TObj, undefined>
		  );
}
