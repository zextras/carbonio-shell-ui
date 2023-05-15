/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React, { useCallback } from 'react';

type UseMoveReturnType = React.MouseEventHandler;
export const useMove = (elementToMoveRef: React.RefObject<HTMLElement>): UseMoveReturnType => {
	const elementToMove = elementToMoveRef.current;

	const moveElement = useCallback(
		(left: number, top: number) => {
			if (elementToMove) {
				// eslint-disable-next-line no-param-reassign
				elementToMove.style.left = `${left}px`;
				// eslint-disable-next-line no-param-reassign
				elementToMove.style.top = `${top}px`;
			}
		},
		[elementToMove]
	);

	return useCallback(
		(mouseDownEvent: React.MouseEvent) => {
			const startPosition = {
				left: elementToMove?.offsetLeft,
				top: elementToMove?.offsetTop
			};
			const startDragPosition = { x: mouseDownEvent.pageX, y: mouseDownEvent.pageY };
			function onMouseMove(mouseMoveEvent: MouseEvent): void {
				moveElement(
					(startPosition.left || 0) + (mouseMoveEvent.pageX - startDragPosition.x),
					(startPosition.top || 0) + (mouseMoveEvent.pageY - startDragPosition.y)
				);
			}
			function onMouseUp(): void {
				document.body.removeEventListener('mousemove', onMouseMove);
				document.body.removeEventListener('mouseup', onMouseUp);
			}
			if (!mouseDownEvent.defaultPrevented) {
				mouseDownEvent.preventDefault();

				document.body.addEventListener('mousemove', onMouseMove);
				document.body.addEventListener('mouseup', onMouseUp);
			}
		},
		[elementToMove?.offsetLeft, elementToMove?.offsetTop, moveElement]
	);
};
