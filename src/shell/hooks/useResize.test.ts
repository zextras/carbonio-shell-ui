/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { Border, exportForTest } from './useResize';
import { SizeAndPosition } from '../../utils/utils';

type InitialSizeAndPosition = NonNullable<Parameters<typeof calcNewSizeAndPosition>[1]>;

const {
	calcNewSizeAndPosition = (): SizeAndPosition => {
		throw new Error('not implemented');
	}
} = exportForTest;

describe('Use resize', () => {
	describe('calcNewSizeAndPosition', () => {
		const INITIAL: SizeAndPosition = { width: 100, height: 100, left: 25, top: 25 };
		function buildInitialSizeAndPosition(offset: number): InitialSizeAndPosition {
			return {
				width: INITIAL.width,
				height: INITIAL.height,
				left: INITIAL.left,
				top: INITIAL.top,
				clientLeft: INITIAL.left + offset,
				clientTop: INITIAL.top + offset
			};
		}
		function buildInitialMousePosition(
			border: Border,
			initial: InitialSizeAndPosition
		): { clientX: number; clientY: number } {
			const mousePosition = { clientX: initial.clientLeft, clientY: initial.clientTop };
			if (border.includes('s')) {
				mousePosition.clientY += initial.height;
			}
			if (border.includes('e')) {
				mousePosition.clientX += initial.width;
			}
			return mousePosition;
		}

		function buildMouseEventWithMovement(
			border: Border,
			mouseMovement: { x: number; y: number },
			initialMousePosition: { clientX: number; clientY: number }
		): MouseEvent {
			const newMousePosition = { ...initialMousePosition };
			if (border.includes('n') || border.includes('s')) {
				newMousePosition.clientY += mouseMovement.y;
			}
			if (border.includes('e') || border.includes('w')) {
				newMousePosition.clientX += mouseMovement.x;
			}

			return new MouseEvent('mouseMove', newMousePosition);
		}

		describe.each([-10, 0, 10])('with offset %d', (offset) => {
			describe.each([25, -25, 0])('moving mouse on x-axis of %d', (deltaX) => {
				describe.each([25, -25, 0])('moving mouse on y-axis of %d', (deltaY) => {
					it.each<{
						border: Border;
						expectedUpdates: Partial<SizeAndPosition>;
					}>([
						{
							border: 'n',
							expectedUpdates: {
								height: -deltaY,
								top: deltaY
							}
						},
						{
							border: 's',
							expectedUpdates: {
								height: deltaY
							}
						},
						{
							border: 'e',
							expectedUpdates: {
								width: deltaX
							}
						},
						{
							border: 'w',
							expectedUpdates: {
								width: -deltaX,
								left: deltaX
							}
						},
						{
							border: 'sw',
							expectedUpdates: {
								height: deltaY,
								width: -deltaX,
								left: deltaX
							}
						},
						{
							border: 'se',
							expectedUpdates: {
								height: deltaY,
								width: deltaX
							}
						},
						{
							border: 'nw',
							expectedUpdates: {
								height: -deltaY,
								top: deltaY,
								width: -deltaX,
								left: deltaX
							}
						},
						{
							border: 'ne',
							expectedUpdates: {
								height: -deltaY,
								top: deltaY,
								width: deltaX
							}
						}
					])(
						`should updates size and position of $expectedUpdates`,
						({ border, expectedUpdates }) => {
							const initial = buildInitialSizeAndPosition(offset);
							const initialMousePosition = buildInitialMousePosition(border, initial);
							const mouseEvent = buildMouseEventWithMovement(
								border,
								{ x: deltaX, y: deltaY },
								initialMousePosition
							);
							const result = calcNewSizeAndPosition(border, initial, mouseEvent);
							const expected: SizeAndPosition = {
								width: initial.width + (expectedUpdates?.width ?? 0),
								height: initial.height + (expectedUpdates?.height ?? 0),
								top: initial.top + (expectedUpdates?.top ?? 0),
								left: initial.left + (expectedUpdates?.left ?? 0)
							};
							expect(result).toEqual<SizeAndPosition>(expected);
						}
					);
				});
			});
		});
	});
});
