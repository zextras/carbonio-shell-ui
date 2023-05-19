/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import 'jest-styled-components';
import { setup } from '../../test/utils';
import { BoardContainer } from './board-container';
import { Board } from '../../../types';
import { useBoardStore } from '../../store/boards';
import { ICONS, TESTID_SELECTORS } from '../../test/constants';
import { Border, SizeAndPosition } from '../hooks/useResize';
import { LOCAL_STORAGE_BOARD_SIZE } from '../../constants';

type InitialSizeAndPosition = SizeAndPosition & { clientLeft: number; clientTop: number };

describe('Board container', () => {
	const boards: Record<string, Board> = {
		'board-1': { id: 'board-1', url: '/url', app: 'app', title: 'title1', icon: 'CubeOutline' },
		'board-2': { id: 'board-2', url: '/url', app: 'app', title: 'title2', icon: 'CubeOutline' },
		'board-3': { id: 'board-3', url: '/url', app: 'app', title: 'title3', icon: 'CubeOutline' }
	};

	function setupState(): void {
		useBoardStore.setState(() => ({
			boards,
			orderedBoards: ['board-1', 'board-2', 'board-3'],
			current: 'board-1'
		}));
	}

	const INITIAL_SIZE_AND_POS: SizeAndPosition = { width: 200, height: 100, top: 75, left: 25 };
	function buildBoardSizeAndPosition(
		sizeAndPos = INITIAL_SIZE_AND_POS,
		offset = 0
	): InitialSizeAndPosition {
		return {
			...sizeAndPos,
			clientTop: sizeAndPos.top + offset,
			clientLeft: sizeAndPos.left + offset
		};
	}

	function buildMousePosition(
		border: Border,
		boardInitialSizeAndPos: InitialSizeAndPosition
	): { clientX: number; clientY: number } {
		const mousePosition = {
			clientX: boardInitialSizeAndPos.clientLeft,
			clientY: boardInitialSizeAndPos.clientTop
		};
		if (border.includes('s')) {
			mousePosition.clientY += boardInitialSizeAndPos.height;
		}
		if (border.includes('e')) {
			mousePosition.clientX += boardInitialSizeAndPos.width;
		}
		return mousePosition;
	}
	function setupBoardSizes(board: HTMLElement, initialSizeAndPos: InitialSizeAndPosition): void {
		jest.spyOn(board, 'offsetWidth', 'get').mockReturnValue(initialSizeAndPos.width);
		jest.spyOn(board, 'offsetHeight', 'get').mockReturnValue(initialSizeAndPos.height);
		jest.spyOn(board, 'offsetTop', 'get').mockReturnValue(initialSizeAndPos.top);
		jest.spyOn(board, 'offsetLeft', 'get').mockReturnValue(initialSizeAndPos.left);
		jest.spyOn(board, 'getBoundingClientRect').mockReturnValue({
			top: initialSizeAndPos.clientTop,
			left: initialSizeAndPos.clientLeft
		} as DOMRect);
	}

	describe('Resize a board', () => {
		describe('within the resizable area of the document', () => {
			describe.each([-10, 0, 10])('with offset %d', (offset) => {
				describe.each([25, -25, 0])('moving mouse on x-axis of %d', (deltaX) => {
					describe.each([25, -25, 0])('moving mouse on y-axis of %d', (deltaY) => {
						test.each<{ border: Border; expectedUpdates: Partial<SizeAndPosition> }>([
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
							'through the border $border, updates the size and position of the board',
							async ({ border, expectedUpdates }) => {
								setupState();
								setup(<BoardContainer />);
								const boardInitialSizeAndPos = buildBoardSizeAndPosition(
									INITIAL_SIZE_AND_POS,
									offset
								);
								const mouseInitialPos = buildMousePosition(border, boardInitialSizeAndPos);
								const board = screen.getByTestId(TESTID_SELECTORS.board);
								const resizableBorder = screen.getByTestId(
									TESTID_SELECTORS.resizableBorder(border)
								);
								setupBoardSizes(board, boardInitialSizeAndPos);
								fireEvent.mouseDown(resizableBorder);
								fireEvent.mouseMove(document.body, {
									clientX: mouseInitialPos.clientX + deltaX,
									clientY: mouseInitialPos.clientY + deltaY
								});
								fireEvent.mouseUp(document.body);
								const expectedSizeAndPos: SizeAndPosition = {
									width: boardInitialSizeAndPos.width + (expectedUpdates.width ?? 0),
									height: boardInitialSizeAndPos.height + (expectedUpdates.height ?? 0),
									top: boardInitialSizeAndPos.top + (expectedUpdates.top ?? 0),
									left: boardInitialSizeAndPos.left + (expectedUpdates.left ?? 0)
								};
								const localStorageSavedData =
									window.localStorage.getItem(LOCAL_STORAGE_BOARD_SIZE) || '';
								await waitFor(() =>
									expect(JSON.parse(localStorageSavedData)).toEqual(expectedSizeAndPos)
								);
								expect(board).toHaveStyle({
									width: `${expectedSizeAndPos.width}px`,
									height: `${expectedSizeAndPos.height}px`,
									top: `${expectedSizeAndPos.top}px`,
									left: `${expectedSizeAndPos.left}px`
								});
							}
						);
					});
				});
			});
		});

		test('outside the resizable area of the document, does not update sizes', async () => {
			setupState();
			setup(<BoardContainer />);
			const border: Border = 'nw';
			const board = screen.getByTestId(TESTID_SELECTORS.board);
			const boardInitialSizeAndPos = buildBoardSizeAndPosition();
			const mouseInitialPos = buildMousePosition(border, boardInitialSizeAndPos);
			// last accepted resize, should set offsetLeft and offsetTop of the element to 0
			const deltaY = boardInitialSizeAndPos.top * -1;
			const deltaX = boardInitialSizeAndPos.left * -1;
			setupBoardSizes(board, boardInitialSizeAndPos);
			const resizableBorder = screen.getByTestId(TESTID_SELECTORS.resizableBorder(border));
			fireEvent.mouseDown(resizableBorder);
			fireEvent.mouseMove(document.body, {
				clientX: mouseInitialPos.clientX + deltaX,
				clientY: mouseInitialPos.clientY + deltaY
			});
			fireEvent.mouseUp(document.body);
			const boardNewSizeAndPos: SizeAndPosition = {
				height: boardInitialSizeAndPos.height - deltaY,
				width: boardInitialSizeAndPos.width - deltaX,
				top: boardInitialSizeAndPos.top + deltaY,
				left: boardInitialSizeAndPos.left + deltaX
			};
			const mouseNewPos = {
				clientX: mouseInitialPos.clientX + deltaX,
				clientY: mouseInitialPos.clientY + deltaY
			};
			let localStorageSavedData = window.localStorage.getItem(LOCAL_STORAGE_BOARD_SIZE) || '';
			await waitFor(() => expect(JSON.parse(localStorageSavedData)).toEqual(boardNewSizeAndPos));
			expect(board).toHaveStyle({
				height: `${boardNewSizeAndPos.height}px`,
				width: `${boardNewSizeAndPos.width}px`,
				top: `${boardNewSizeAndPos.top}px`,
				left: `${boardNewSizeAndPos.left}px`
			});
			// do another resize moving the mouse outside the area where the resize is accepted
			setupBoardSizes(board, buildBoardSizeAndPosition(boardNewSizeAndPos));
			fireEvent.mouseDown(resizableBorder);
			fireEvent.mouseMove(document.body, {
				clientX: mouseNewPos.clientX - 1,
				clientY: mouseNewPos.clientY - 1
			});
			fireEvent.mouseUp(document.body);
			// board keeps last sizes
			expect(board).toHaveStyle({
				height: `${boardNewSizeAndPos.height}px`,
				width: `${boardNewSizeAndPos.width}px`,
				top: `${boardNewSizeAndPos.top}px`,
				left: `${boardNewSizeAndPos.left}px`
			});
			localStorageSavedData = window.localStorage.getItem(LOCAL_STORAGE_BOARD_SIZE) || '';
			await waitFor(() => expect(JSON.parse(localStorageSavedData)).toEqual(boardNewSizeAndPos));
		});
	});

	test('Enlarge default board set board to fill board area', async () => {
		setupState();
		const { getByRoleWithIcon, user } = setup(<BoardContainer />);
		const board = screen.getByTestId(TESTID_SELECTORS.board);
		setupBoardSizes(board, buildBoardSizeAndPosition());
		expect(board).toHaveStyleRule('height', '70vh');
		await user.click(getByRoleWithIcon('button', { icon: ICONS.enlargeBoard }));
		expect(board).toHaveStyleRule('height', 'calc(100% - 1.5rem) !important');
		expect(board).toHaveStyleRule('width', 'calc(100% - 3rem) !important');
		expect(board).toHaveStyleRule('top', '1.5rem !important');
		expect(board).toHaveStyleRule('left', '1.5rem !important');
	});

	test('Enlarge resized board set board to fill board area', async () => {
		setupState();
		const { getByRoleWithIcon, user } = setup(<BoardContainer />);
		const board = screen.getByTestId(TESTID_SELECTORS.board);
		setupBoardSizes(board, buildBoardSizeAndPosition());
		expect(board).toHaveStyleRule('height', '70vh');
		await user.click(getByRoleWithIcon('button', { icon: ICONS.enlargeBoard }));
		expect(board).toHaveStyleRule('height', 'calc(100% - 1.5rem) !important');
		expect(board).toHaveStyleRule('width', 'calc(100% - 3rem) !important');
		expect(board).toHaveStyleRule('top', '1.5rem !important');
		expect(board).toHaveStyleRule('left', '1.5rem !important');
	});

	test('Reduce default board set board to default size', async () => {
		setupState();
		const { getByRoleWithIcon, user } = setup(<BoardContainer />);
		const board = screen.getByTestId(TESTID_SELECTORS.board);
		setupBoardSizes(board, buildBoardSizeAndPosition());
		await user.click(getByRoleWithIcon('button', { icon: ICONS.enlargeBoard }));
		await user.click(getByRoleWithIcon('button', { icon: ICONS.reduceBoard }));
		expect(board).toHaveStyleRule('height', '70vh');
		expect(board).toHaveStyleRule('width', 'auto');
		expect(board).toHaveStyleRule('bottom', '0');
		expect(board).toHaveStyleRule('left', '1.5rem');
	});

	test('Reduce resized board set board to resized size', async () => {
		setupState();
		const { getByRoleWithIcon, user } = setup(<BoardContainer />);
		const border: Border = 'n';
		const board = screen.getByTestId(TESTID_SELECTORS.board);
		const boardInitialSizeAndPos = buildBoardSizeAndPosition();
		const mouseInitialPos = buildMousePosition(border, boardInitialSizeAndPos);
		const deltaY = -50;
		setupBoardSizes(board, boardInitialSizeAndPos);
		const topBorder = screen.getByTestId(TESTID_SELECTORS.resizableBorder(border));
		fireEvent.mouseDown(topBorder);
		fireEvent.mouseMove(document.body, { clientX: 0, clientY: mouseInitialPos.clientY + deltaY });
		fireEvent.mouseUp(document.body);
		await user.click(getByRoleWithIcon('button', { icon: ICONS.enlargeBoard }));
		await user.click(getByRoleWithIcon('button', { icon: ICONS.reduceBoard }));
		expect(board).toHaveStyle({
			height: `${boardInitialSizeAndPos.height - deltaY}px`,
			width: `${boardInitialSizeAndPos.width}px`,
			top: `${boardInitialSizeAndPos.top + deltaY}px`,
			left: `${boardInitialSizeAndPos.left}px`
		});
		expect(board).not.toHaveStyleRule('height', '70vh');
		expect(board).not.toHaveStyleRule('width', 'auto');
	});
});
