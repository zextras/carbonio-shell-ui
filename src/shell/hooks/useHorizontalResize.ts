/*
 * SPDX-FileCopyrightText: 2026 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import type React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { setGlobalCursor } from '../../utils/utils';

type UseHorizontalResizeOptions = {
	/** Element whose width is changed while dragging */
	elementRef: React.RefObject<HTMLElement>;
	/** Receive the requested width in px and return the width to apply, in px */
	clampWidth: (width: number) => number;
	/**
	 * Called with the current width in px when the drag starts and on every mouse move.
	 * Keep it cheap: it runs on every move, so only update state when something actually changes.
	 */
	onResize?: (width: number) => void;
	/** Called on mouse up with the final width in px, only if the width changed */
	onResizeEnd: (width: number) => void;
};

/**
 * Resize horizontally an element by dragging its right border.
 * While dragging, the width is applied directly on the element style to avoid re-renders.
 * Once the drag ends, the final width is notified through onResizeEnd and the inline style is removed,
 * so that the owner can store the width and apply it through its own styles.
 *
 * @returns the mouse down handler to attach to the drag handle, and whether a drag is in progress
 */
export const useHorizontalResize = ({
	elementRef,
	clampWidth,
	onResize,
	onResizeEnd
}: UseHorizontalResizeOptions): {
	onResizeStart: React.MouseEventHandler;
	isResizing: boolean;
} => {
	const callbacksRef = useRef({ clampWidth, onResize, onResizeEnd });
	const stopDragRef = useRef<() => void>();
	const [isResizing, setIsResizing] = useState(false);

	useEffect(() => {
		callbacksRef.current = { clampWidth, onResize, onResizeEnd };
	}, [clampWidth, onResize, onResizeEnd]);

	// remove listeners if the component is unmounted while dragging
	useEffect(() => (): void => stopDragRef.current?.(), []);

	const onResizeStart = useCallback(
		(event: React.MouseEvent) => {
			const element = elementRef.current;
			// only primary button
			if (event.button !== 0 || !element) {
				return;
			}
			// avoid text selection while dragging
			event.preventDefault();

			const startX = event.clientX;
			const startWidth = element.getBoundingClientRect().width;
			let lastWidth = startWidth;

			const onMouseMove = (moveEvent: MouseEvent): void => {
				lastWidth = callbacksRef.current.clampWidth(startWidth + moveEvent.clientX - startX);
				element.style.width = `${lastWidth}px`;
				callbacksRef.current.onResize?.(lastWidth);
			};

			const stopDrag = (): void => {
				setGlobalCursor(undefined);
				document.body.removeEventListener('mousemove', onMouseMove);
				// eslint-disable-next-line @typescript-eslint/no-use-before-define
				document.body.removeEventListener('mouseup', onMouseUp);
				stopDragRef.current = undefined;
				setIsResizing(false);
			};

			const onMouseUp = (): void => {
				stopDrag();
				if (lastWidth !== startWidth) {
					callbacksRef.current.onResizeEnd(lastWidth);
				}
				element.style.width = '';
				element.style.transition = '';
			};

			element.style.transition = 'none';
			callbacksRef.current.onResize?.(startWidth);
			setGlobalCursor('ew-resize');
			document.body.addEventListener('mousemove', onMouseMove);
			document.body.addEventListener('mouseup', onMouseUp);
			stopDragRef.current = stopDrag;
			setIsResizing(true);
		},
		[elementRef]
	);

	return { onResizeStart, isResizing };
};
