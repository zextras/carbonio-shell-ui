/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React, { CSSProperties, useCallback, useEffect, useRef } from 'react';

import { find, forEach } from 'lodash';

import { useLocalStorage } from './useLocalStorage';
import {
	createExportForTestOnly,
	setElementSizeAndPosition,
	setGlobalCursor,
	SizeAndPosition
} from '../../utils/utils';

/**
 * Define the border following the cardinal points (north, south, west, east).
 * Similar to the definition of the cursor for the pointer
 */
export type Border = 'n' | 's' | 'e' | 'w' | 'ne' | 'sw' | 'nw' | 'se';

type UseResizableReturnType = React.MouseEventHandler;

type ResizeOptions = {
	localStorageKey?: string;
	keepSynchedWithStorage?: boolean;
};

export const BORDERS: Border[] = ['n', 's', 'e', 'w', 'ne', 'se', 'sw', 'nw'];

export function getCursorFromBorder(border: Border): NonNullable<CSSProperties['cursor']> {
	const direction = find(
		[
			['n', 's'],
			['e', 'w'],
			['ne', 'sw'],
			['nw', 'se']
		],
		(borders) => borders.includes(border)
	)?.join('');
	return (direction && direction.concat('-resize')) || '';
}

function calcNewSizeAndPosition(
	border: Border,
	from: { clientTop: number; clientLeft: number } & SizeAndPosition,
	mouseEvent: MouseEvent
): SizeAndPosition {
	const newSizeAndPosition = {
		top: from.top,
		left: from.left,
		height: from.height,
		width: from.width
	};
	if (border.includes('n')) {
		const heightDifference = from.clientTop - mouseEvent.clientY;
		newSizeAndPosition.height = from.height + heightDifference;
		newSizeAndPosition.top = from.top - heightDifference;
	}
	if (border.includes('s')) {
		newSizeAndPosition.height = mouseEvent.clientY - from.clientTop;
	}
	if (border.includes('e')) {
		newSizeAndPosition.width = mouseEvent.clientX - from.clientLeft;
	}
	if (border.includes('w')) {
		const widthDifference = from.clientLeft - mouseEvent.clientX;
		newSizeAndPosition.width = from.width + widthDifference;
		newSizeAndPosition.left = from.left - widthDifference;
	}
	return newSizeAndPosition;
}

export const useResize = (
	elementToResizeRef: React.RefObject<HTMLElement>,
	border: Border,
	options?: ResizeOptions
): UseResizableReturnType => {
	const initialSizeAndPositionRef = useRef<Parameters<typeof calcNewSizeAndPosition>[1]>();
	const [lastSavedSizeAndPosition, setLastSavedSizeAndPosition] = useLocalStorage<
		Partial<SizeAndPosition>
	>(
		options?.localStorageKey || 'use-resize-data',
		{},
		{ keepSynchedWithStorage: options?.keepSynchedWithStorage }
	);
	const lastSizeAndPositionRef = useRef<Partial<SizeAndPosition>>(lastSavedSizeAndPosition);

	useEffect(() => {
		lastSizeAndPositionRef.current = { ...lastSavedSizeAndPosition };
	}, [lastSavedSizeAndPosition]);

	const resizeElement = useCallback(
		({ width, height, top, left }: SizeAndPosition) => {
			if (elementToResizeRef.current) {
				const elementToResize = elementToResizeRef.current;
				const sizeAndPositionToApply: Partial<SizeAndPosition> = lastSizeAndPositionRef.current;
				const computedStyle = getComputedStyle(elementToResizeRef.current);
				const minHeight = parseFloat(computedStyle.minHeight) || 0;
				const minWidth = parseFloat(computedStyle.minWidth) || 0;
				if (top >= 0 && height >= minHeight) {
					sizeAndPositionToApply.height = height;
					sizeAndPositionToApply.top = top;
				}
				if (left >= 0 && width >= minWidth) {
					sizeAndPositionToApply.width = width;
					sizeAndPositionToApply.left = left;
				}
				forEach(sizeAndPositionToApply, (value, key) => {
					setElementSizeAndPosition(elementToResize, key as keyof SizeAndPosition, value);
				});
				// reset bottom in favor of top
				elementToResize.style.bottom = '';
				// reset right in favor of left
				elementToResize.style.right = '';
				lastSizeAndPositionRef.current = sizeAndPositionToApply;
			}
		},
		[elementToResizeRef]
	);

	const onMouseMove = useCallback(
		(mouseMoveEvent: MouseEvent) => {
			if (initialSizeAndPositionRef.current) {
				const newSizeAndPosition = calcNewSizeAndPosition(
					border,
					initialSizeAndPositionRef.current,
					mouseMoveEvent
				);
				resizeElement(newSizeAndPosition);
			}
		},
		[border, resizeElement]
	);

	const onMouseUp = useCallback(() => {
		setGlobalCursor(undefined);
		document.body.removeEventListener('mousemove', onMouseMove);
		document.body.removeEventListener('mouseup', onMouseUp);
		if (options?.localStorageKey) {
			setLastSavedSizeAndPosition(lastSizeAndPositionRef.current);
		}
	}, [onMouseMove, options?.localStorageKey, setLastSavedSizeAndPosition]);

	return useCallback(
		(mouseDownEvent: React.MouseEvent | MouseEvent) => {
			if (!mouseDownEvent.defaultPrevented && elementToResizeRef.current) {
				mouseDownEvent.preventDefault();
				const clientRect = elementToResizeRef.current.getBoundingClientRect();
				initialSizeAndPositionRef.current = {
					width: elementToResizeRef.current.offsetWidth,
					height: elementToResizeRef.current.offsetHeight,
					top: elementToResizeRef.current.offsetTop,
					left: elementToResizeRef.current.offsetLeft,
					clientTop: clientRect.top,
					clientLeft: clientRect.left
				};
				setGlobalCursor(getCursorFromBorder(border));
				document.body.addEventListener('mousemove', onMouseMove);
				document.body.addEventListener('mouseup', onMouseUp);
			}
		},
		[border, elementToResizeRef, onMouseMove, onMouseUp]
	);
};

export const exportForTest = createExportForTestOnly({ calcNewSizeAndPosition });
