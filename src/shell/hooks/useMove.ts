/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React, { useCallback, useEffect, useRef } from 'react';
import { forEach } from 'lodash';
import {
	ElementPosition,
	setElementSizeAndPosition,
	setGlobalCursor,
	SizeAndPosition
} from '../../utils/utils';
import { useLocalStorage } from './useLocalStorage';

type UseMoveReturnType = React.MouseEventHandler;
type MoveOptions = {
	localStorageKey?: string;
	keepSynchedWithStorage?: boolean;
};

export const BOARD_CURSOR_TIMEOUT = 100;

function calcNewPosition(
	from: SizeAndPosition & {
		clientTop: number;
		clientLeft: number;
		mouseClientX: number;
		mouseClientY: number;
	},
	limitContainer: HTMLElement,
	mouseEvent: MouseEvent
): ElementPosition {
	const limitClientRect = limitContainer.getBoundingClientRect();
	const clientTopLimit = limitClientRect.top ?? 0;
	const moveTopDelta = mouseEvent.clientY - from.mouseClientY;
	const newClientTop = from.clientTop + moveTopDelta;
	const newTop = from.top + moveTopDelta;
	const clientLeftLimit = limitClientRect.left ?? 0;
	const moveLeftDelta = mouseEvent.clientX - from.mouseClientX;
	const newClientLeft = from.clientLeft + moveLeftDelta;
	const newLeft = from.left + moveLeftDelta;
	return {
		left: newClientLeft > clientLeftLimit ? newLeft : 0,
		top: newClientTop > clientTopLimit ? newTop : 0
	};
}

export const useMove = (
	elementToMoveRef: React.RefObject<HTMLElement>,
	options?: MoveOptions
): UseMoveReturnType => {
	const initialSizeAndPositionRef = useRef<Parameters<typeof calcNewPosition>[0]>();
	const lastPositionRef = useRef<Partial<ElementPosition>>({});
	const [lastSavedPosition, setLastSavedPosition] = useLocalStorage<Partial<SizeAndPosition>>(
		options?.localStorageKey || 'use-move-data',
		{},
		{ keepSynchedWithStorage: options?.keepSynchedWithStorage }
	);
	const globalCursorSetterTimerRef = useRef<ReturnType<typeof setTimeout>>();
	const shouldUpdateLocalStorageRef = useRef(false);

	const moveElement = useCallback(
		({ left, top }: ElementPosition) => {
			if (elementToMoveRef.current) {
				const elementToMove = elementToMoveRef.current;
				const positionToApply: Partial<ElementPosition> = lastPositionRef.current;
				if (top >= 0) {
					positionToApply.top = top;
				}
				if (left >= 0) {
					positionToApply.left = left;
				}
				forEach(positionToApply, (value, key) => {
					setElementSizeAndPosition(elementToMove, key as keyof ElementPosition, value);
				});
				lastPositionRef.current = positionToApply;
			}
		},
		[elementToMoveRef]
	);

	useEffect(() => {
		if (elementToMoveRef.current) {
			setElementSizeAndPosition(elementToMoveRef.current, 'top', lastSavedPosition.top);
			setElementSizeAndPosition(elementToMoveRef.current, 'left', lastSavedPosition.left);
			lastPositionRef.current = { ...lastSavedPosition };
		}
	}, [elementToMoveRef, lastSavedPosition]);

	const preventClick = useCallback((event: MouseEvent) => {
		event.preventDefault();
		document.body.removeEventListener('click', preventClick, { capture: true });
	}, []);

	const onMouseMove = useCallback(
		(mouseMoveEvent: MouseEvent) => {
			if (initialSizeAndPositionRef.current && elementToMoveRef.current) {
				const offsetParent =
					(elementToMoveRef.current.offsetParent instanceof HTMLElement &&
						elementToMoveRef.current.offsetParent) ||
					document.body;

				const newPosition = calcNewPosition(
					initialSizeAndPositionRef.current,
					offsetParent,
					mouseMoveEvent
				);
				moveElement({
					left: newPosition.left,
					top: newPosition.top
				});
				// prevent clickable elements from being clicked if a move has been made
				document.body.addEventListener('click', preventClick, { capture: true });
				shouldUpdateLocalStorageRef.current = true;
			}
		},
		[elementToMoveRef, moveElement, preventClick]
	);

	const onMouseUp = useCallback(() => {
		if (globalCursorSetterTimerRef.current) {
			clearTimeout(globalCursorSetterTimerRef.current);
		}
		setGlobalCursor(undefined);
		document.body.removeEventListener('mousemove', onMouseMove);
		document.body.removeEventListener('mouseup', onMouseUp);
		if (options?.localStorageKey && shouldUpdateLocalStorageRef.current) {
			setLastSavedPosition(lastPositionRef.current);
			shouldUpdateLocalStorageRef.current = false;
		}
	}, [onMouseMove, options?.localStorageKey, setLastSavedPosition]);

	return useCallback(
		(mouseDownEvent: React.MouseEvent) => {
			if (!mouseDownEvent.defaultPrevented && elementToMoveRef.current) {
				mouseDownEvent.preventDefault();
				const clientRect = elementToMoveRef.current.getBoundingClientRect();
				initialSizeAndPositionRef.current = {
					width: elementToMoveRef.current.offsetWidth,
					height: elementToMoveRef.current.offsetHeight,
					left: elementToMoveRef.current.offsetLeft,
					top: elementToMoveRef.current.offsetTop,
					clientTop: clientRect.top,
					clientLeft: clientRect.left,
					mouseClientY: mouseDownEvent.clientY,
					mouseClientX: mouseDownEvent.clientX
				};
				globalCursorSetterTimerRef.current = setTimeout(() => {
					setGlobalCursor('move');
				}, BOARD_CURSOR_TIMEOUT);
				document.body.addEventListener('mousemove', onMouseMove);
				document.body.addEventListener('mouseup', onMouseUp);
			}
		},
		[elementToMoveRef, onMouseMove, onMouseUp]
	);
};
