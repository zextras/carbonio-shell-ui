/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React, { ComponentType } from 'react';
import { act, screen, waitFor, within } from '@testing-library/react';
import { reduce, sample, size } from 'lodash';
import 'jest-styled-components';
import { Input } from '@zextras/carbonio-design-system';
import { setup } from '../../test/utils';
import { BOARD_DEFAULT_POSITION, BoardContainer } from './board-container';
import { ICONS, TESTID_SELECTORS } from '../../test/constants';
import { Border } from '../hooks/useResize';
import {
	buildBoardSizeAndPosition,
	buildMousePosition,
	INITIAL_SIZE_AND_POS,
	setupBoardStore,
	setupBoardSizes,
	resizeBoard,
	moveBoard,
	mockedBoardState
} from '../../test/test-board-utils';
import { SizeAndPosition } from '../../utils/utils';
import { reopenBoards, useBoardStore } from '../../store/boards';
import { mockedApps, setupAppStore } from '../../test/test-app-utils';
import { BOARD_MIN_VISIBILITY, LOCAL_STORAGE_BOARD_SIZE } from '../../constants';
import { Board, BoardView } from '../../../types';
import { useAppStore } from '../../store/app';

beforeEach(() => {
	setupAppStore();
	setupBoardStore();
});

describe('Board container', () => {
	describe('Tabs', () => {
		const boards = reduce<unknown, Record<string, Board>>(
			Array<never>(10),
			(accumulator, value, index) => {
				const boardId = `board-${index + 1}`;
				accumulator[boardId] = {
					id: boardId,
					url: '/url',
					app: mockedApps[0].name,
					title: `title${index + 1}`,
					icon: 'CubeOutline'
				};
				return accumulator;
			},
			{}
		);

		test('If a lot of tabs are opened, they are all visible and available in the dropdown', async () => {
			setupBoardStore('board-1', boards);
			const { getByRoleWithIcon, user } = setup(<BoardContainer />);
			act(() => {
				// run updateBoardPosition debounced fn
				jest.advanceTimersToNextTimer();
			});
			const title1 = screen.getByText('title1');
			expect(title1).toBeVisible();
			const title2 = screen.getByText('title2');
			expect(title2).toBeVisible();
			const title3 = screen.getByText('title3');
			expect(title3).toBeVisible();
			const title4 = screen.getByText('title4');
			expect(title4).toBeVisible();
			const title5 = screen.getByText('title5');
			expect(title5).toBeVisible();
			const title6 = screen.getByText('title6');
			expect(title6).toBeVisible();
			const title7 = screen.getByText('title7');
			expect(title7).toBeVisible();
			const title8 = screen.getByText('title8');
			expect(title8).toBeVisible();
			const title9 = screen.getByText('title9');
			expect(title9).toBeVisible();
			const title10 = screen.getByText('title10');
			expect(title10).toBeVisible();

			const chevronDownIcon = getByRoleWithIcon('button', { icon: 'ChevronDown' });
			expect(chevronDownIcon).toBeVisible();

			await user.click(chevronDownIcon);

			expect(screen.getAllByText('From Mails')).toHaveLength(10);
		});

		test('If close a tab from the dropdown, it will be removed', async () => {
			setupBoardStore('board-1', boards);
			const { getByRoleWithIcon, user } = setup(<BoardContainer />);
			act(() => {
				// run updateBoardPosition debounced fn
				jest.advanceTimersToNextTimer();
			});

			const chevronDownIcon = getByRoleWithIcon('button', { icon: 'ChevronDown' });

			await user.click(chevronDownIcon);

			expect(screen.getAllByText('From Mails')).toHaveLength(10);

			const firstCloseIcon = within(screen.getByTestId('dropdown-popper-list')).getAllByTestId(
				'icon: CloseOutline'
			)[0];
			await user.click(firstCloseIcon);
			expect(screen.getAllByText('From Mails')).toHaveLength(9);
			expect(useBoardStore.getState().orderedBoards).toHaveLength(9);
			expect(size(useBoardStore.getState().boards)).toBe(9);
		});
	});

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
							'with the border $border, updates the size and position of the board',
							async ({ border, expectedUpdates }) => {
								setup(<BoardContainer />);
								act(() => {
									// run updateBoardPosition debounced fn
									jest.advanceTimersToNextTimer();
								});
								const board = screen.getByTestId(TESTID_SELECTORS.board);
								const boardInitialSizeAndPos = buildBoardSizeAndPosition(
									INITIAL_SIZE_AND_POS,
									offset
								);
								const mouseInitialPos = buildMousePosition(border, boardInitialSizeAndPos);
								const expectedSizeAndPos: SizeAndPosition = {
									width: boardInitialSizeAndPos.width + (expectedUpdates.width ?? 0),
									height: boardInitialSizeAndPos.height + (expectedUpdates.height ?? 0),
									top: boardInitialSizeAndPos.top + (expectedUpdates.top ?? 0),
									left: boardInitialSizeAndPos.left + (expectedUpdates.left ?? 0)
								};
								await resizeBoard(
									board,
									boardInitialSizeAndPos,
									border,
									{
										clientX: mouseInitialPos.clientX + deltaX,
										clientY: mouseInitialPos.clientY + deltaY
									},
									expectedSizeAndPos
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
			setup(<BoardContainer />);
			act(() => {
				// run updateBoardPosition debounced fn
				jest.advanceTimersToNextTimer();
			});
			const border: Border = 'nw';
			const board = screen.getByTestId(TESTID_SELECTORS.board);
			const boardInitialSizeAndPos = buildBoardSizeAndPosition();
			const mouseInitialPos = buildMousePosition(border, boardInitialSizeAndPos);
			// last accepted resize, should set offsetLeft and offsetTop of the element to 0
			const deltaY = boardInitialSizeAndPos.top * -1;
			const deltaX = boardInitialSizeAndPos.left * -1;
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
			await resizeBoard(board, boardInitialSizeAndPos, border, mouseNewPos, boardNewSizeAndPos);
			expect(board).toHaveStyle({
				height: `${boardNewSizeAndPos.height}px`,
				width: `${boardNewSizeAndPos.width}px`,
				top: `${boardNewSizeAndPos.top}px`,
				left: `${boardNewSizeAndPos.left}px`
			});
			// do another resize moving the mouse outside the area where the resize is accepted
			await resizeBoard(
				board,
				buildBoardSizeAndPosition(boardNewSizeAndPos),
				border,
				{
					clientX: mouseNewPos.clientX - 1,
					clientY: mouseNewPos.clientY - 1
				},
				boardNewSizeAndPos
			);
			// board keeps last sizes
			expect(board).toHaveStyle({
				height: `${boardNewSizeAndPos.height}px`,
				width: `${boardNewSizeAndPos.width}px`,
				top: `${boardNewSizeAndPos.top}px`,
				left: `${boardNewSizeAndPos.left}px`
			});
		});
	});

	test('Enlarge default board set board to fill board area', async () => {
		const { getByRoleWithIcon, user } = setup(<BoardContainer />);
		act(() => {
			// run updateBoardPosition debounced fn
			jest.advanceTimersToNextTimer();
		});
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
		const { getByRoleWithIcon, user } = setup(<BoardContainer />);
		act(() => {
			// run updateBoardPosition debounced fn
			jest.advanceTimersToNextTimer();
		});
		const border: Border = 'n';
		const board = screen.getByTestId(TESTID_SELECTORS.board);
		const boardInitialSizeAndPos = buildBoardSizeAndPosition();
		const mouseInitialPos = buildMousePosition(border, boardInitialSizeAndPos);
		const deltaY = -50;
		const boardNewSizeAndPos: SizeAndPosition = {
			height: boardInitialSizeAndPos.height - deltaY,
			width: boardInitialSizeAndPos.width,
			top: boardInitialSizeAndPos.top + deltaY,
			left: boardInitialSizeAndPos.left
		};
		await resizeBoard(
			board,
			boardInitialSizeAndPos,
			border,
			{ clientX: 0, clientY: mouseInitialPos.clientY + deltaY },
			boardNewSizeAndPos
		);
		await user.click(getByRoleWithIcon('button', { icon: ICONS.enlargeBoard }));
		expect(board).toHaveStyleRule('height', 'calc(100% - 1.5rem) !important');
		expect(board).toHaveStyleRule('width', 'calc(100% - 3rem) !important');
		expect(board).toHaveStyleRule('top', '1.5rem !important');
		expect(board).toHaveStyleRule('left', '1.5rem !important');
	});

	test('Reduce default board set board to default size', async () => {
		const { getByRoleWithIcon, user } = setup(<BoardContainer />);
		act(() => {
			// run updateBoardPosition debounced fn
			jest.advanceTimersToNextTimer();
		});
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
		const { getByRoleWithIcon, user } = setup(<BoardContainer />);
		act(() => {
			// run updateBoardPosition debounced fn
			jest.advanceTimersToNextTimer();
		});
		const border: Border = 'n';
		const board = screen.getByTestId(TESTID_SELECTORS.board);
		const boardInitialSizeAndPos = buildBoardSizeAndPosition();
		const mouseInitialPos = buildMousePosition(border, boardInitialSizeAndPos);
		const deltaY = -50;
		const boardNewSizeAndPos: SizeAndPosition = {
			height: boardInitialSizeAndPos.height - deltaY,
			width: boardInitialSizeAndPos.width,
			top: boardInitialSizeAndPos.top + deltaY,
			left: boardInitialSizeAndPos.left
		};
		await resizeBoard(
			board,
			boardInitialSizeAndPos,
			border,
			{ clientX: 0, clientY: mouseInitialPos.clientY + deltaY },
			boardNewSizeAndPos
		);
		await user.click(getByRoleWithIcon('button', { icon: ICONS.enlargeBoard }));
		await user.click(getByRoleWithIcon('button', { icon: ICONS.reduceBoard }));
		act(() => {
			jest.advanceTimersToNextTimer();
		});
		expect(board).toHaveStyle({
			height: `${boardNewSizeAndPos.height}px`,
			width: `${boardNewSizeAndPos.width}px`,
			top: `${boardNewSizeAndPos.top}px`,
			left: `${boardNewSizeAndPos.left}px`
		});
		expect(board).not.toHaveStyleRule('height', '70vh');
		expect(board).not.toHaveStyleRule('width', 'auto');
	});

	test('Collapse and un-collapse of a resized board set board to resized size', async () => {
		const { getByRoleWithIcon, user } = setup(<BoardContainer />);
		act(() => {
			// run updateBoardPosition debounced fn
			jest.advanceTimersToNextTimer();
		});
		const border: Border = 'n';
		const board = screen.getByTestId(TESTID_SELECTORS.board);
		const boardInitialSizeAndPos = buildBoardSizeAndPosition();
		const mouseInitialPos = buildMousePosition(border, boardInitialSizeAndPos);
		const deltaY = -50;
		const boardNewSizeAndPos: SizeAndPosition = {
			height: boardInitialSizeAndPos.height - deltaY,
			width: boardInitialSizeAndPos.width,
			top: boardInitialSizeAndPos.top + deltaY,
			left: boardInitialSizeAndPos.left
		};
		await resizeBoard(
			board,
			boardInitialSizeAndPos,
			border,
			{ clientX: 0, clientY: mouseInitialPos.clientY + deltaY },
			boardNewSizeAndPos
		);
		await user.click(getByRoleWithIcon('button', { icon: `${ICONS.collapseBoard}Outline` }));
		act(() => {
			reopenBoards();
		});
		act(() => {
			jest.advanceTimersToNextTimer();
		});
		expect(board).toHaveStyle({
			height: `${boardNewSizeAndPos.height}px`,
			width: `${boardNewSizeAndPos.width}px`,
			top: `${boardNewSizeAndPos.top}px`,
			left: `${boardNewSizeAndPos.left}px`
		});
		expect(board).not.toHaveStyleRule('height', '70vh');
		expect(board).not.toHaveStyleRule('width', 'auto');
	});

	test('Reset size action is disabled if board is at default size', async () => {
		const { getByRoleWithIcon } = setup(<BoardContainer />);
		act(() => {
			// run updateBoardPosition debounced fn
			jest.advanceTimersToNextTimer();
		});
		const board = screen.getByTestId(TESTID_SELECTORS.board);
		const boardInitialSizeAndPos = buildBoardSizeAndPosition();
		setupBoardSizes(board, boardInitialSizeAndPos);
		expect(getByRoleWithIcon('button', { icon: ICONS.resetBoardSize })).toBeDisabled();
	});

	test('Reset size action is enabled if board is not at default size', async () => {
		const { getByRoleWithIcon } = setup(<BoardContainer />);
		act(() => {
			// run updateBoardPosition debounced fn
			jest.advanceTimersToNextTimer();
		});
		const border: Border = 'n';
		const board = screen.getByTestId(TESTID_SELECTORS.board);
		const boardInitialSizeAndPos = buildBoardSizeAndPosition();
		const mouseInitialPos = buildMousePosition(border, boardInitialSizeAndPos);
		const deltaY = -50;
		const boardNewSizeAndPos: SizeAndPosition = {
			height: boardInitialSizeAndPos.height - deltaY,
			width: boardInitialSizeAndPos.width,
			top: boardInitialSizeAndPos.top + deltaY,
			left: boardInitialSizeAndPos.left
		};
		await resizeBoard(
			board,
			boardInitialSizeAndPos,
			border,
			{ clientX: 0, clientY: mouseInitialPos.clientY + deltaY },
			boardNewSizeAndPos
		);
		expect(getByRoleWithIcon('button', { icon: ICONS.resetBoardSize })).toBeEnabled();
	});

	test('Reset size action reset board sizes to default', async () => {
		const { getByRoleWithIcon, user } = setup(<BoardContainer />);
		act(() => {
			// run updateBoardPosition debounced fn
			jest.advanceTimersToNextTimer();
		});
		const border: Border = 'n';
		const board = screen.getByTestId(TESTID_SELECTORS.board);
		const boardInitialSizeAndPos = buildBoardSizeAndPosition();
		const mouseInitialPos = buildMousePosition(border, boardInitialSizeAndPos);
		const deltaY = -50;
		const boardNewSizeAndPos: SizeAndPosition = {
			height: boardInitialSizeAndPos.height - deltaY,
			width: boardInitialSizeAndPos.width,
			top: boardInitialSizeAndPos.top + deltaY,
			left: boardInitialSizeAndPos.left
		};
		await resizeBoard(
			board,
			boardInitialSizeAndPos,
			border,
			{ clientX: 0, clientY: mouseInitialPos.clientY + deltaY },
			boardNewSizeAndPos
		);
		await user.click(getByRoleWithIcon('button', { icon: ICONS.resetBoardSize }));
		act(() => {
			// run move timer
			jest.advanceTimersToNextTimer();
		});
		await waitFor(() =>
			expect(JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_BOARD_SIZE) || '')).toEqual({})
		);
		expect(board).toHaveStyle({
			height: '70vh',
			width: 'auto',
			...BOARD_DEFAULT_POSITION
		});
	});

	test('Resize of the window keeps the board top-left corner visible inside the window', async () => {
		setup(<BoardContainer />);
		act(() => {
			// run updateBoardPosition debounced fn
			jest.advanceTimersToNextTimer();
		});
		const rightBorder: Border = 'e';
		const leftBorder: Border = 'w';
		const board = screen.getByTestId(TESTID_SELECTORS.board);
		const boardInitialSizeAndPos = buildBoardSizeAndPosition();
		// move right border to the extreme right
		const mouseMoveInitialPosition = buildMousePosition(rightBorder, boardInitialSizeAndPos);
		let mouseFinalPosition = {
			clientX: window.innerWidth,
			clientY: mouseMoveInitialPosition.clientY
		};
		let boardNewSizeAndPos: SizeAndPosition = {
			height: boardInitialSizeAndPos.height,
			width: window.innerWidth - boardInitialSizeAndPos.left,
			top: boardInitialSizeAndPos.top,
			left: boardInitialSizeAndPos.left
		};
		await resizeBoard(
			board,
			boardInitialSizeAndPos,
			rightBorder,
			mouseFinalPosition,
			boardNewSizeAndPos
		);
		// move left border to the right to get the initial width of the board
		const mouseInitialPosition = buildMousePosition(
			leftBorder,
			buildBoardSizeAndPosition(boardNewSizeAndPos)
		);
		mouseFinalPosition = {
			clientX: window.innerWidth - boardInitialSizeAndPos.width,
			clientY: mouseInitialPosition.clientY
		};
		boardNewSizeAndPos = {
			width: boardInitialSizeAndPos.width,
			height: boardInitialSizeAndPos.height,
			left: window.innerWidth - boardInitialSizeAndPos.width,
			top: boardInitialSizeAndPos.top
		};
		await resizeBoard(
			board,
			buildBoardSizeAndPosition(boardNewSizeAndPos),
			leftBorder,
			mouseFinalPosition,
			boardNewSizeAndPos
		);

		const newWindowSize = {
			height: 100,
			width: 100
		};
		act(() => {
			window.resizeTo(newWindowSize.width, newWindowSize.height);
			jest.advanceTimersToNextTimer();
		});
		expect(board).toHaveStyle({
			height: `${boardNewSizeAndPos.height}px`,
			width: `${boardNewSizeAndPos.width}px`,
			top: `${newWindowSize.height - BOARD_MIN_VISIBILITY.top}px`,
			left: `${newWindowSize.width - BOARD_MIN_VISIBILITY.left}px`
		});
	});

	test('Resizing down the window and then resizing it up reset board position to the last manually set', async () => {
		setup(<BoardContainer />);
		act(() => {
			// run updateBoardPosition debounced fn
			jest.advanceTimersToNextTimer();
		});
		const rightBorder: Border = 'e';
		const leftBorder: Border = 'w';
		const board = screen.getByTestId(TESTID_SELECTORS.board);
		const boardInitialSizeAndPos = buildBoardSizeAndPosition();
		// move right border to the extreme right
		const mouseMoveInitialPosition = buildMousePosition(rightBorder, boardInitialSizeAndPos);
		let mouseFinalPosition = {
			clientX: window.innerWidth,
			clientY: mouseMoveInitialPosition.clientY
		};
		let boardNewSizeAndPos: SizeAndPosition = {
			height: boardInitialSizeAndPos.height,
			width: window.innerWidth - boardInitialSizeAndPos.left,
			top: boardInitialSizeAndPos.top,
			left: boardInitialSizeAndPos.left
		};
		await resizeBoard(
			board,
			boardInitialSizeAndPos,
			rightBorder,
			mouseFinalPosition,
			boardNewSizeAndPos
		);
		// move left border to the right to get the initial width of the board
		const mouseInitialPosition = buildMousePosition(
			leftBorder,
			buildBoardSizeAndPosition(boardNewSizeAndPos)
		);
		mouseFinalPosition = {
			clientX: window.innerWidth - boardInitialSizeAndPos.width,
			clientY: mouseInitialPosition.clientY
		};
		boardNewSizeAndPos = {
			width: boardInitialSizeAndPos.width,
			height: boardInitialSizeAndPos.height,
			left: window.innerWidth - boardInitialSizeAndPos.width,
			top: boardInitialSizeAndPos.top
		};
		await resizeBoard(
			board,
			buildBoardSizeAndPosition(boardNewSizeAndPos),
			leftBorder,
			mouseFinalPosition,
			boardNewSizeAndPos
		);

		const initialWindowSize = {
			height: window.innerHeight,
			width: window.innerWidth
		};
		const newWindowSize = {
			height: 100,
			width: 100
		};
		act(() => {
			window.resizeTo(newWindowSize.width, newWindowSize.height);
		});

		await waitFor(() =>
			expect(board).toHaveStyle({
				top: `${newWindowSize.height - BOARD_MIN_VISIBILITY.top}px`,
				left: `${newWindowSize.width - BOARD_MIN_VISIBILITY.left}px`
			})
		);

		act(() => {
			window.resizeTo(initialWindowSize.width, initialWindowSize.height);
			jest.advanceTimersToNextTimer();
		});

		expect(board).toHaveStyle({
			height: `${boardNewSizeAndPos.height}px`,
			width: `${boardNewSizeAndPos.width}px`,
			top: `${boardNewSizeAndPos.top}px`,
			left: `${boardNewSizeAndPos.left}px`
		});
	});

	test('Move a board with default size set new position and keep default size', async () => {
		setup(<BoardContainer />);
		act(() => {
			// run updateBoardPosition debounced fn
			jest.advanceTimersToNextTimer();
		});
		const board = screen.getByTestId(TESTID_SELECTORS.board);
		const boardInitialSizeAndPos = buildBoardSizeAndPosition();
		const boardNewPosition = {
			top: 0,
			left: 0
		};
		await moveBoard(
			board,
			boardInitialSizeAndPos,
			{ clientX: boardInitialSizeAndPos.clientLeft, clientY: boardInitialSizeAndPos.clientTop },
			{ clientX: 0, clientY: 0 },
			boardNewPosition
		);
		expect(board).toHaveStyle({
			height: '70vh',
			width: 'auto',
			left: 0,
			top: 0
		});
	});

	test('Multiple move of a board with default size set new position and keep default size', async () => {
		setup(<BoardContainer />);
		act(() => {
			// run updateBoardPosition debounced fn
			jest.advanceTimersToNextTimer();
		});
		const board = screen.getByTestId(TESTID_SELECTORS.board);
		let boardInitialSizeAndPos = buildBoardSizeAndPosition();
		let boardNewPosition = {
			top: 10,
			left: 10
		};
		await moveBoard(
			board,
			boardInitialSizeAndPos,
			{ clientX: boardInitialSizeAndPos.clientLeft, clientY: boardInitialSizeAndPos.clientTop },
			{ clientX: 10, clientY: 10 },
			boardNewPosition
		);
		boardInitialSizeAndPos = buildBoardSizeAndPosition({
			...boardInitialSizeAndPos,
			...boardNewPosition
		});
		boardNewPosition = {
			top: 50,
			left: 80
		};
		await moveBoard(
			board,
			boardInitialSizeAndPos,
			{ clientX: boardInitialSizeAndPos.clientLeft, clientY: boardInitialSizeAndPos.clientTop },
			{ clientX: 80, clientY: 50 },
			boardNewPosition
		);
		expect(board).toHaveStyle({
			height: '70vh',
			width: 'auto',
			left: `${boardNewPosition.left}px`,
			top: `${boardNewPosition.top}px`
		});
	});

	test('Move a board with custom size set new position and keep custom size', async () => {
		setup(<BoardContainer />);
		act(() => {
			// run updateBoardPosition debounced fn
			jest.advanceTimersToNextTimer();
		});
		const border: Border = 'n';
		const board = screen.getByTestId(TESTID_SELECTORS.board);
		const boardInitialSizeAndPos = buildBoardSizeAndPosition();
		const mouseInitialPos = buildMousePosition(border, boardInitialSizeAndPos);
		const deltaY = -50;
		let boardNewSizeAndPos: SizeAndPosition = {
			height: boardInitialSizeAndPos.height - deltaY,
			width: boardInitialSizeAndPos.width,
			top: boardInitialSizeAndPos.top + deltaY,
			left: boardInitialSizeAndPos.left
		};
		await resizeBoard(
			board,
			boardInitialSizeAndPos,
			border,
			{ clientX: 0, clientY: mouseInitialPos.clientY + deltaY },
			boardNewSizeAndPos
		);
		const boardNewInitialSizeAndPos = buildBoardSizeAndPosition(boardNewSizeAndPos);
		boardNewSizeAndPos = {
			width: boardNewSizeAndPos.width,
			height: boardNewSizeAndPos.height,
			top: 0,
			left: 0
		};
		await moveBoard(
			board,
			boardNewInitialSizeAndPos,
			{
				clientX: boardNewInitialSizeAndPos.clientLeft,
				clientY: boardNewInitialSizeAndPos.clientTop
			},
			{ clientX: 0, clientY: 0 },
			boardNewSizeAndPos
		);
		expect(board).toHaveStyle({
			height: `${boardNewSizeAndPos.height}px`,
			width: `${boardNewSizeAndPos.width}px`,
			left: `${boardNewSizeAndPos.left}px`,
			top: `${boardNewSizeAndPos.top}px`
		});
	});

	test('Resizing the board, resetting to default size and position and then moving it to a different position set the new position, but keep the default size', async () => {
		const { getByRoleWithIcon, user } = setup(<BoardContainer />);
		act(() => {
			// run updateBoardPosition debounced fn
			jest.advanceTimersToNextTimer();
		});
		const border: Border = 'n';
		const board = screen.getByTestId(TESTID_SELECTORS.board);
		const boardInitialSizeAndPos = buildBoardSizeAndPosition();
		const mouseInitialPos = buildMousePosition(border, boardInitialSizeAndPos);
		const deltaY = -50;
		const boardNewSizeAndPos: SizeAndPosition = {
			height: boardInitialSizeAndPos.height - deltaY,
			width: boardInitialSizeAndPos.width,
			top: boardInitialSizeAndPos.top + deltaY,
			left: boardInitialSizeAndPos.left
		};
		await resizeBoard(
			board,
			boardInitialSizeAndPos,
			border,
			{ clientX: 0, clientY: mouseInitialPos.clientY + deltaY },
			boardNewSizeAndPos
		);
		await user.click(getByRoleWithIcon('button', { icon: ICONS.resetBoardSize }));
		act(() => {
			// run move timer
			jest.advanceTimersToNextTimer();
		});
		await waitFor(() =>
			expect(JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_BOARD_SIZE) || '')).toEqual({})
		);
		const boardNewPos = {
			top: 0,
			left: 0
		};
		await moveBoard(
			board,
			boardInitialSizeAndPos,
			{ clientX: boardInitialSizeAndPos.clientLeft, clientY: boardInitialSizeAndPos.clientTop },
			{ clientX: 0, clientY: 0 },
			boardNewPos
		);
		expect(board).toHaveStyle({
			height: '70vh',
			width: 'auto',
			left: 0,
			top: 0
		});
	});

	test.each<[action: string, icon: string]>([
		['collapse board', `${ICONS.collapseBoard}Outline`],
		['close tab', ICONS.close],
		['close board', ICONS.closeBoard],
		['reset board', ICONS.resetBoardSize],
		['enlarge board', ICONS.enlargeBoard]
	])('Action %s is not fired if a move is performed on it', async (actionName, icon) => {
		const boardItem = sample(mockedBoardState) as Board;
		setupBoardStore(boardItem.id, { [boardItem.id]: boardItem });
		const { getAllByRoleWithIcon } = setup(<BoardContainer />);
		act(() => {
			// run updateBoardPosition debounced fn
			jest.advanceTimersToNextTimer();
		});
		const board = screen.getByTestId(TESTID_SELECTORS.board);
		const actionElement = getAllByRoleWithIcon('button', { icon })[0];
		let boardInitialSizeAndPos = buildBoardSizeAndPosition();
		let boardNewPosition = {
			top: 0,
			left: 0
		};
		await moveBoard(
			board,
			boardInitialSizeAndPos,
			{ clientX: boardInitialSizeAndPos.clientLeft, clientY: boardInitialSizeAndPos.clientTop },
			{ clientX: 0, clientY: 0 },
			boardNewPosition
		);
		boardInitialSizeAndPos = buildBoardSizeAndPosition({
			...boardInitialSizeAndPos,
			...boardNewPosition
		});
		boardNewPosition = {
			top: 30,
			left: 30
		};
		await moveBoard(
			board,
			boardInitialSizeAndPos,
			{ clientX: boardInitialSizeAndPos.clientLeft, clientY: boardInitialSizeAndPos.clientTop },
			{ clientX: 30, clientY: 30 },
			boardNewPosition,
			actionElement
		);
		expect(board).toBeVisible();
		expect(board).toHaveStyle({
			height: '70vh',
			width: 'auto',
			left: `${boardNewPosition.left}px`,
			top: `${boardNewPosition.top}px`
		});
	});

	test('Double click inside a focused input select the text', async () => {
		const boardObj = sample(mockedBoardState) as Board;
		setupBoardStore(boardObj.id, { [boardObj.id]: boardObj });
		const boardView: BoardView = {
			id: boardObj.id,
			app: boardObj.app,
			route: boardObj.url,
			component: (): JSX.Element => <Input label={'Board input'} />
		};
		useAppStore.getState().setters.addBoardView(boardView);
		const { user } = setup(<BoardContainer />);
		act(() => {
			// run updateBoardPosition debounced fn
			jest.advanceTimersToNextTimer();
		});
		const inputElement = screen.getByRole<HTMLInputElement>('textbox', { name: /board input/i });
		expect(inputElement).toBeVisible();
		const typedText = 'wonderful';
		await user.type(inputElement, typedText);
		await user.dblClick(screen.getByDisplayValue(typedText));
		expect(inputElement.selectionStart).toBe(0);
		expect(inputElement.selectionEnd).toBe(typedText.length);
	});

	test('Move board is disabled on enlarged board', async () => {
		const { getByRoleWithIcon, user } = setup(<BoardContainer />);
		act(() => {
			// run updateBoardPosition debounced fn
			jest.advanceTimersToNextTimer();
		});
		const board = screen.getByTestId(TESTID_SELECTORS.board);
		setupBoardSizes(board, buildBoardSizeAndPosition());
		expect(board).toHaveStyleRule('height', '70vh');
		await user.click(getByRoleWithIcon('button', { icon: ICONS.enlargeBoard }));
		const boardInitialSizeAndPos = buildBoardSizeAndPosition();
		await moveBoard(
			board,
			boardInitialSizeAndPos,
			{ clientX: boardInitialSizeAndPos.clientLeft, clientY: boardInitialSizeAndPos.clientTop },
			{ clientX: 0, clientY: 0 },
			{}
		);
		await user.click(getByRoleWithIcon('button', { icon: ICONS.reduceBoard }));
		expect(board).toHaveStyle({
			height: '70vh',
			width: 'auto',
			...BOARD_DEFAULT_POSITION
		});
	});
});
