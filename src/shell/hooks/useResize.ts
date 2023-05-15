/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React, { useCallback, useRef } from 'react';

type SizeAndPosition = {
	width: number;
	height: number;
	top: number;
	left: number;
};

type OffsetSizeAndPosition = {
	[K in keyof SizeAndPosition as `offset${Capitalize<K>}`]: SizeAndPosition[K];
};

/**
 * Define the border following the cardinal points (north, south, west, east).
 * Similar to the definition of the cursor for the pointer
 */
type Border = 'n' | 's' | 'e' | 'w' | 'ne' | 'sw' | 'nw' | 'se';

type UseResizableReturnType = React.MouseEventHandler;

function calcNewSizeAndPosition(
	border: Border,
	from: SizeAndPosition & OffsetSizeAndPosition,
	mouseEvent: MouseEvent
): SizeAndPosition {
	const newSizeAndPosition = {
		top: from.offsetTop,
		left: from.offsetLeft,
		height: from.offsetHeight,
		width: from.offsetWidth
	};
	if (border.includes('n')) {
		const heightDifference = from.top - mouseEvent.clientY;
		newSizeAndPosition.height = from.offsetHeight + heightDifference;
		newSizeAndPosition.top = from.offsetTop - heightDifference;
	}
	if (border.includes('s')) {
		newSizeAndPosition.height = mouseEvent.clientY - from.top;
	}
	if (border.includes('e')) {
		newSizeAndPosition.width = mouseEvent.clientX - from.left;
	}
	if (border.includes('w')) {
		const widthDifference = from.left - mouseEvent.clientX;
		newSizeAndPosition.width = from.offsetWidth + widthDifference;
		newSizeAndPosition.left = from.offsetLeft - widthDifference;
	}
	return newSizeAndPosition;
}

export const useResize = (
	elementToResizeRef: React.RefObject<HTMLElement>,
	border: Border
): UseResizableReturnType => {
	const initialSizeAndPositionRef = useRef<Parameters<typeof calcNewSizeAndPosition>[1]>();

	const resizeElement = useCallback(
		({ width, height, top, left }: SizeAndPosition) => {
			if (elementToResizeRef.current) {
				const elementToResize = elementToResizeRef.current;
				if (top >= 0) {
					elementToResize.style.height = `${height}px`;
					elementToResize.style.top = `${top}px`;
				}
				if (left >= 0) {
					elementToResize.style.width = `${width}px`;
					elementToResize.style.left = `${left}px`;
				}
				// reset bottom in favor of top
				elementToResize.style.bottom = '';
				// reset right in favor of left
				elementToResize.style.right = '';
			}
		},
		[elementToResizeRef]
	);

	const onMouseMove = useCallback(
		(mouseMoveEvent: MouseEvent) => {
			if (initialSizeAndPositionRef.current) {
				resizeElement(
					calcNewSizeAndPosition(border, initialSizeAndPositionRef.current, mouseMoveEvent)
				);
			}
		},
		[border, resizeElement]
	);

	const onMouseUp = useCallback(() => {
		document.body.removeEventListener('mousemove', onMouseMove);
		document.body.removeEventListener('mouseup', onMouseUp);
	}, [onMouseMove]);

	return useCallback(
		(mouseDownEvent: React.MouseEvent | MouseEvent) => {
			if (!mouseDownEvent.defaultPrevented && elementToResizeRef.current) {
				mouseDownEvent.preventDefault();
				const clientRect = elementToResizeRef.current.getBoundingClientRect();
				initialSizeAndPositionRef.current = {
					offsetWidth: elementToResizeRef.current.offsetWidth,
					offsetHeight: elementToResizeRef.current.offsetHeight,
					offsetTop: elementToResizeRef.current.offsetTop,
					offsetLeft: elementToResizeRef.current.offsetLeft,
					width: clientRect.width,
					height: clientRect.height,
					top: clientRect.top,
					left: clientRect.left
				};
				document.body.addEventListener('mousemove', onMouseMove);
				document.body.addEventListener('mouseup', onMouseUp);
			}
		},
		[elementToResizeRef, onMouseMove, onMouseUp]
	);
};
