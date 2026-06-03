/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { act, screen, waitFor, within } from '@testing-library/react';
import { Input } from '@zextras/carbonio-design-system';
import { reduce, sample, size } from 'lodash';

import { BOARD_DEFAULT_POSITION, BoardContainer } from './board-container';
import {
	BOARD_MIN_VISIBILITY,
	HEADER_BAR_HEIGHT,
	LOCAL_STORAGE_BOARD_SIZE,
	PRIMARY_BAR_WIDTH
} from '../../constants';
import { useAppStore } from '../../store/app';
import { reopenBoards, useBoardStore } from '../../store/boards';
import { ICONS, TESTID_SELECTORS } from '../../tests/constants';
import { mockedApps, setupAppStore } from '../../tests/test-app-utils';
import {
	buildBoardSizeAndPosition,
	buildMousePosition,
	setupBoardStore,
	setupBoardSizes,
	resizeBoard,
	moveBoard,
	mockedBoardState
} from '../../tests/test-board-utils';
import { setup } from '../../tests/utils';
import type { BoardView } from '../../types/apps';
import type { Board } from '../../types/boards';
import type { SizeAndPosition } from '../../utils/utils';
import type { Border } from '../hooks/useResize';

beforeEach(() => {
	setupAppStore();
	setupBoardStore();
});

// Renders BoardContainer and flushes the debounced updateBoardPosition that runs
// after mount (see board-container.tsx:282, `debounce(fn, 0, { trailing: true })`).
// Centralises the timer flush so future changes to that mechanism touch only this helper.
function setupBoardContainer(): ReturnType<typeof setup> {
	const result = setup(<BoardContainer />);
	act(() => {
		vi.advanceTimersToNextTimer();
	});
	return result;
}

const ENLARGED_BOARD_POSITION = {
	top: '1.5rem!important',
	left: '1.5rem!important'
};

describe('Board container', () => {
	describe('Tabs', () => {
		const boards = reduce<unknown, Record<string, Board>>(
			Array<never>(10),
			(accumulator, value, index) => {
				const boardId = `board-${index + 1}`;
				accumulator[boardId] = {
					id: boardId,
					boardViewId: '/url',
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
			const { getByRoleWithIcon, user } = setupBoardContainer();
			const title1 = screen.getByText('title1');
			expect(title1, 'tab title1 should be visible').toBeVisible();
			const title2 = screen.getByText('title2');
			expect(title2, 'tab title2 should be visible').toBeVisible();
			const title3 = screen.getByText('title3');
			expect(title3, 'tab title3 should be visible').toBeVisible();
			const title4 = screen.getByText('title4');
			expect(title4, 'tab title4 should be visible').toBeVisible();
			const title5 = screen.getByText('title5');
			expect(title5, 'tab title5 should be visible').toBeVisible();
			const title6 = screen.getByText('title6');
			expect(title6, 'tab title6 should be visible').toBeVisible();
			const title7 = screen.getByText('title7');
			expect(title7, 'tab title7 should be visible').toBeVisible();
			const title8 = screen.getByText('title8');
			expect(title8, 'tab title8 should be visible').toBeVisible();
			const title9 = screen.getByText('title9');
			expect(title9, 'tab title9 should be visible').toBeVisible();
			const title10 = screen.getByText('title10');
			expect(title10, 'tab title10 should be visible').toBeVisible();

			const chevronDownIcon = getByRoleWithIcon('button', { icon: 'ChevronDown' });
			expect(chevronDownIcon, 'the tabs overflow dropdown trigger should be visible').toBeVisible();

			await user.click(chevronDownIcon);
			expect(
				screen.getAllByText(/from mails/i),
				'all 10 boards should be listed in the dropdown'
			).toHaveLength(10);
		});

		test('If close a tab from the dropdown, it will be removed', async () => {
			setupBoardStore('board-1', boards);
			const { getByRoleWithIcon, user } = setupBoardContainer();

			const chevronDownIcon = getByRoleWithIcon('button', { icon: 'ChevronDown' });

			await user.click(chevronDownIcon);

			expect(
				screen.getAllByText(/from mails/i),
				'all 10 boards should be listed in the dropdown before closing any'
			).toHaveLength(10);

			const firstCloseIcon = within(screen.getByTestId('dropdown-popper-list')).getAllByTestId(
				'icon: CloseOutline'
			)[0];
			await user.click(firstCloseIcon);
			expect(
				screen.getAllByText(/from mails/i),
				'the dropdown should list 9 boards after closing one'
			).toHaveLength(9);
			expect(
				useBoardStore.getState().orderedBoards,
				'orderedBoards should contain 9 boards after closing one'
			).toHaveLength(9);
			expect(
				size(useBoardStore.getState().boards),
				'boards map should contain 9 boards after closing one'
			).toBe(9);
		});
	});

	describe('board container offsets', () => {
		test('has default values for topOffset and leftOffset ', () => {
			setup(<BoardContainer />);
			const boardContainer = screen.getByTestId(TESTID_SELECTORS.boardContainerComp);

			expect(
				boardContainer,
				'container height should default to viewport height minus the header bar'
			).toHaveStyleRule('height', `calc(100vh - ${HEADER_BAR_HEIGHT})`);
			expect(
				boardContainer,
				'container width should default to viewport width minus the primary bar'
			).toHaveStyleRule('width', `calc(100vw - ${PRIMARY_BAR_WIDTH})`);
			expect(
				boardContainer,
				'container top should default to the header bar height'
			).toHaveStyleRule('top', HEADER_BAR_HEIGHT);
			expect(
				boardContainer,
				'container left should default to the primary bar width'
			).toHaveStyleRule('left', PRIMARY_BAR_WIDTH);
		});
		test('has customizable values for topOffset and leftOffset ', () => {
			const leftOffset = '3rem';
			const topOffset = '2rem';
			setup(<BoardContainer leftOffset={leftOffset} topOffset={topOffset} />);
			const boardContainer = screen.getByTestId(TESTID_SELECTORS.boardContainerComp);

			expect(boardContainer, 'container height should use the custom top offset').toHaveStyleRule(
				'height',
				`calc(100vh - ${topOffset})`
			);
			expect(boardContainer, 'container width should use the custom left offset').toHaveStyleRule(
				'width',
				`calc(100vw - ${leftOffset})`
			);
			expect(boardContainer, 'container top should equal the custom top offset').toHaveStyleRule(
				'top',
				topOffset
			);
			expect(boardContainer, 'container left should equal the custom left offset').toHaveStyleRule(
				'left',
				leftOffset
			);
		});
	});
	describe('Resize a board', () => {
		describe('within the resizable area of the document', () => {
			// Initial board position is far from any window boundary, so the visibility
			// clamp in `calcPositionToRemainVisible` never triggers; offset would be
			// purely additive and add no coverage. Kept offset = 0 (default).
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
							setupBoardContainer();
							const board = screen.getByTestId(TESTID_SELECTORS.board);
							const boardInitialSizeAndPos = buildBoardSizeAndPosition();
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
							expect(
								board,
								'board size and position should match the expected values after resizing the border'
							).toHaveStyle({
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

		test('outside the resizable area of the document, does not update sizes', async () => {
			setupBoardContainer();
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
			expect(
				board,
				'board should accept the last resize that keeps it inside the resizable area'
			).toHaveStyle({
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
			expect(
				board,
				'board should keep its last accepted size when the resize moves outside the allowed area'
			).toHaveStyle({
				height: `${boardNewSizeAndPos.height}px`,
				width: `${boardNewSizeAndPos.width}px`,
				top: `${boardNewSizeAndPos.top}px`,
				left: `${boardNewSizeAndPos.left}px`
			});
		});
	});

	test('Enlarge default board set board to fill board area', async () => {
		const { getByRoleWithIcon, user } = setupBoardContainer();
		const board = screen.getByTestId(TESTID_SELECTORS.board);
		setupBoardSizes(board, buildBoardSizeAndPosition());
		expect(board, 'board should start at the default 70vh height').toHaveStyleRule(
			'height',
			'70vh'
		);
		await user.click(getByRoleWithIcon('button', { icon: ICONS.enlargeBoard }));
		expect(board, 'enlarged board height should fill the board area').toHaveStyleRule(
			'height',
			'calc(100% - 1.5rem)!important'
		);
		expect(board, 'enlarged board width should fill the board area').toHaveStyleRule(
			'width',
			'calc(100% - 3rem)!important'
		);
		expect(board, 'enlarged board should be positioned at the area top').toHaveStyleRule(
			'top',
			ENLARGED_BOARD_POSITION.top
		);
		expect(board, 'enlarged board should be positioned at the area left').toHaveStyleRule(
			'left',
			ENLARGED_BOARD_POSITION.left
		);
	});

	test('Enlarge resized board set board to fill board area', async () => {
		const { getByRoleWithIcon, user } = setupBoardContainer();
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
		expect(board, 'enlarged resized board height should fill the board area').toHaveStyleRule(
			'height',
			'calc(100% - 1.5rem)!important'
		);
		expect(board, 'enlarged resized board width should fill the board area').toHaveStyleRule(
			'width',
			'calc(100% - 3rem)!important'
		);
		expect(board, 'enlarged resized board should be positioned at the area top').toHaveStyleRule(
			'top',
			ENLARGED_BOARD_POSITION.top
		);
		expect(board, 'enlarged resized board should be positioned at the area left').toHaveStyleRule(
			'left',
			ENLARGED_BOARD_POSITION.left
		);
	});

	test('Reduce default board set board to default size', async () => {
		const { getByRoleWithIcon, user } = setupBoardContainer();
		const board = screen.getByTestId(TESTID_SELECTORS.board);
		setupBoardSizes(board, buildBoardSizeAndPosition());
		await user.click(getByRoleWithIcon('button', { icon: ICONS.enlargeBoard }));
		await user.click(getByRoleWithIcon('button', { icon: ICONS.reduceBoard }));
		expect(board, 'reduced board should return to the default 70vh height').toHaveStyleRule(
			'height',
			'70vh'
		);
		expect(board, 'reduced board should return to the default auto width').toHaveStyleRule(
			'width',
			'auto'
		);
		expect(board, 'reduced board should be anchored to the bottom').toHaveStyleRule('bottom', '0');
		expect(board, 'reduced board should return to the default left position').toHaveStyleRule(
			'left',
			'1.5rem'
		);
	});

	test('Reduce resized board set board to resized size', async () => {
		const { getByRoleWithIcon, user } = setupBoardContainer();
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
			vi.advanceTimersToNextTimer();
		});
		expect(
			board,
			'reduced board should restore the previously resized size and position'
		).toHaveStyle({
			height: `${boardNewSizeAndPos.height}px`,
			width: `${boardNewSizeAndPos.width}px`,
			top: `${boardNewSizeAndPos.top}px`,
			left: `${boardNewSizeAndPos.left}px`
		});
		expect(board, 'reduced board should not fall back to the default height').not.toHaveStyleRule(
			'height',
			'70vh'
		);
		expect(board, 'reduced board should not fall back to the default width').not.toHaveStyleRule(
			'width',
			'auto'
		);
	});

	describe('Minimize a board', () => {
		test('button is available by default', async () => {
			const { getByRoleWithIcon } = setup(<BoardContainer />);

			expect(
				getByRoleWithIcon('button', { icon: `${ICONS.collapseBoard}Outline` }),
				'collapse button should be visible by default'
			).toBeVisible();
		});
		test('button is available if minimizeAllowed is true', async () => {
			const { getByRoleWithIcon } = setup(<BoardContainer minimizeAllowed />);

			expect(
				getByRoleWithIcon('button', { icon: `${ICONS.collapseBoard}Outline` }),
				'collapse button should be visible when minimizeAllowed is true'
			).toBeVisible();
		});
		test('button is not available if minimizeAllowed is false', async () => {
			const { queryByRoleWithIcon } = setup(<BoardContainer minimizeAllowed={false} />);

			expect(
				queryByRoleWithIcon('button', { icon: `${ICONS.collapseBoard}Outline` }),
				'collapse button should not be rendered when minimizeAllowed is false'
			).not.toBeInTheDocument();
		});
	});

	test('Collapse and un-collapse of a resized board set board to resized size', async () => {
		const { getByRoleWithIcon, user } = setupBoardContainer();
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
			vi.advanceTimersToNextTimer();
		});
		expect(
			board,
			'un-collapsed board should restore the previously resized size and position'
		).toHaveStyle({
			height: `${boardNewSizeAndPos.height}px`,
			width: `${boardNewSizeAndPos.width}px`,
			top: `${boardNewSizeAndPos.top}px`,
			left: `${boardNewSizeAndPos.left}px`
		});
		expect(
			board,
			'un-collapsed board should not fall back to the default height'
		).not.toHaveStyleRule('height', '70vh');
		expect(
			board,
			'un-collapsed board should not fall back to the default width'
		).not.toHaveStyleRule('width', 'auto');
	});

	test('Reset size action is disabled if board is at default size', async () => {
		const { getByRoleWithIcon } = setupBoardContainer();
		const board = screen.getByTestId(TESTID_SELECTORS.board);
		const boardInitialSizeAndPos = buildBoardSizeAndPosition();
		setupBoardSizes(board, boardInitialSizeAndPos);
		expect(
			getByRoleWithIcon('button', { icon: ICONS.resetBoardSize }),
			'reset size action should be disabled when the board is at the default size'
		).toBeDisabled();
	});

	test('Reset size action is enabled if board is not at default size', async () => {
		const { getByRoleWithIcon } = setupBoardContainer();
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
		expect(
			getByRoleWithIcon('button', { icon: ICONS.resetBoardSize }),
			'reset size action should be enabled when the board is not at the default size'
		).toBeEnabled();
	});

	test('Reset size action reset board sizes to default', async () => {
		const { getByRoleWithIcon, user } = setupBoardContainer();
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
			vi.advanceTimersToNextTimer();
		});
		await waitFor(() =>
			expect(
				JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_BOARD_SIZE) ?? ''),
				'resetting the size should clear the persisted board size in local storage'
			).toEqual({})
		);
		expect(board, 'reset board should return to the default size and position').toHaveStyle({
			height: '70vh',
			width: 'auto',
			...BOARD_DEFAULT_POSITION
		});
	});

	test('Resize of the window keeps the board top-left corner visible inside the window', async () => {
		setupBoardContainer();
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
			vi.advanceTimersToNextTimer();
		});
		expect(
			board,
			'shrinking the window should clamp the board so its top-left corner stays visible'
		).toHaveStyle({
			height: `${boardNewSizeAndPos.height}px`,
			width: `${boardNewSizeAndPos.width}px`,
			top: `${newWindowSize.height - BOARD_MIN_VISIBILITY.top}px`,
			left: `${newWindowSize.width - BOARD_MIN_VISIBILITY.left}px`
		});
	});

	test('Resizing down the window and then resizing it up reset board position to the last manually set', async () => {
		setupBoardContainer();
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
			expect(
				board,
				'shrinking the window should clamp the board to keep its top-left corner visible'
			).toHaveStyle({
				top: `${newWindowSize.height - BOARD_MIN_VISIBILITY.top}px`,
				left: `${newWindowSize.width - BOARD_MIN_VISIBILITY.left}px`
			})
		);

		act(() => {
			window.resizeTo(initialWindowSize.width, initialWindowSize.height);
			vi.advanceTimersToNextTimer();
		});

		expect(
			board,
			'enlarging the window back should restore the last manually set size and position'
		).toHaveStyle({
			height: `${boardNewSizeAndPos.height}px`,
			width: `${boardNewSizeAndPos.width}px`,
			top: `${boardNewSizeAndPos.top}px`,
			left: `${boardNewSizeAndPos.left}px`
		});
	});

	test('Reset size action reduce board if enlarged', async () => {
		const { getByRoleWithIcon, user } = setupBoardContainer();
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
		await user.click(getByRoleWithIcon('button', { icon: ICONS.resetBoardSize }));
		await waitFor(() =>
			expect(
				JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_BOARD_SIZE) || '{}'),
				'resetting an enlarged board should clear the persisted board size in local storage'
			).toEqual({})
		);
		expect(
			board,
			'resetting an enlarged board should return it to the default size and position'
		).toHaveStyle({
			height: '70vh',
			width: 'auto',
			...BOARD_DEFAULT_POSITION
		});
	});

	test('Move a board with default size set new position and keep default size', async () => {
		setupBoardContainer();
		const board = screen.getByTestId(TESTID_SELECTORS.board);
		const elementForMove = screen.getByTestId(TESTID_SELECTORS.boardHeader);
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
			boardNewPosition,
			elementForMove
		);
		expect(
			board,
			'moving a default-size board should update its position and keep the default size'
		).toHaveStyle({
			height: '70vh',
			width: 'auto',
			left: 0,
			top: 0
		});
	});

	test('Multiple move of a board with default size set new position and keep default size', async () => {
		setupBoardContainer();
		const board = screen.getByTestId(TESTID_SELECTORS.board);
		const elementForMove = screen.getByTestId(TESTID_SELECTORS.boardHeader);
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
			boardNewPosition,
			elementForMove
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
			boardNewPosition,
			elementForMove
		);
		expect(
			board,
			'moving a default-size board twice should keep the latest position and the default size'
		).toHaveStyle({
			height: '70vh',
			width: 'auto',
			left: `${boardNewPosition.left}px`,
			top: `${boardNewPosition.top}px`
		});
	});

	test('Move a board with custom size set new position and keep custom size', async () => {
		setupBoardContainer();
		const border: Border = 'n';
		const board = screen.getByTestId(TESTID_SELECTORS.board);
		const elementForMove = screen.getByTestId(TESTID_SELECTORS.boardHeader);
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
			boardNewSizeAndPos,
			elementForMove
		);
		expect(
			board,
			'moving a custom-size board should update its position and keep the custom size'
		).toHaveStyle({
			height: `${boardNewSizeAndPos.height}px`,
			width: `${boardNewSizeAndPos.width}px`,
			left: `${boardNewSizeAndPos.left}px`,
			top: `${boardNewSizeAndPos.top}px`
		});
	});

	test('Resizing the board, resetting to default size and position and then moving it to a different position set the new position, but keep the default size', async () => {
		const { getByRoleWithIcon, user } = setupBoardContainer();
		const border: Border = 'n';
		const board = screen.getByTestId(TESTID_SELECTORS.board);
		const elementForMove = screen.getByTestId(TESTID_SELECTORS.boardHeader);
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
			vi.advanceTimersToNextTimer();
		});
		await waitFor(() =>
			expect(
				JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_BOARD_SIZE) || ''),
				'resetting the size should clear the persisted board size in local storage'
			).toEqual({})
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
			boardNewPos,
			elementForMove
		);
		expect(
			board,
			'moving after a reset should set the new position while keeping the default size'
		).toHaveStyle({
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
		const { getAllByRoleWithIcon } = setupBoardContainer();
		const board = screen.getByTestId(TESTID_SELECTORS.board);
		const elementForMove = screen.getByTestId(TESTID_SELECTORS.boardHeader);
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
			boardNewPosition,
			elementForMove
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
		expect(
			board,
			`board should still be visible after a move on the ${actionName} action`
		).toBeVisible();
		expect(
			board,
			`${actionName} action should not fire when a move is performed on it, so the board keeps the moved position`
		).toHaveStyle({
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
			id: boardObj.boardViewId,
			app: boardObj.app,
			component: (): React.JSX.Element => <Input label={'Board input'} />
		};
		useAppStore.getState().addBoardView(boardView);
		const { user } = setupBoardContainer();
		const inputElement = screen.getByRole<HTMLInputElement>('textbox', { name: /board input/i });
		expect(inputElement, 'the board input should be visible').toBeVisible();
		const typedText = 'wonderful';
		await user.type(inputElement, typedText);
		await user.dblClick(screen.getByDisplayValue(typedText));
		expect(
			inputElement.selectionStart,
			'double click should select the text from the start of the input'
		).toBe(0);
		expect(
			inputElement.selectionEnd,
			'double click should select the text up to the end of the typed value'
		).toBe(typedText.length);
	});

	test('Move board is disabled on enlarged board', async () => {
		const { getByRoleWithIcon, user } = setupBoardContainer();
		const board = screen.getByTestId(TESTID_SELECTORS.board);
		setupBoardSizes(board, buildBoardSizeAndPosition());
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
		expect(
			board,
			'move should be ignored on an enlarged board, so reducing it returns to the default size and position'
		).toHaveStyle({
			height: '70vh',
			width: 'auto',
			...BOARD_DEFAULT_POSITION
		});
	});

	test('Keyboard space trigger icon button inside board header', async () => {
		const { getByRoleWithIcon, user } = setupBoardContainer();
		const board = screen.getByTestId(TESTID_SELECTORS.board);
		setupBoardSizes(board, buildBoardSizeAndPosition());
		// click to set focus
		await user.click(getByRoleWithIcon('button', { icon: ICONS.enlargeBoard }));
		// act needed to catch the update of TabsList
		await act(async () => {
			await user.keyboard('[Space]');
		});
		await waitFor(() =>
			expect(
				board,
				'pressing Space on the focused enlarge button should reduce the board to the default size and position'
			).toHaveStyle({
				height: '70vh',
				width: 'auto',
				...BOARD_DEFAULT_POSITION
			})
		);
	});

	test('Reset is disabled when opening a new board which had custom position but default sizes', async () => {
		const { user, getByRoleWithIcon } = setupBoardContainer();
		const board = screen.getByTestId(TESTID_SELECTORS.board);
		const elementForMove = screen.getByTestId(TESTID_SELECTORS.boardHeader);
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
			boardNewPosition,
			elementForMove
		);
		await user.click(getByRoleWithIcon('button', { icon: ICONS.closeBoard }));
		act(() => {
			setupBoardStore();
		});
		await waitFor(() =>
			expect(
				JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_BOARD_SIZE) ?? '{}'),
				'no board size should be persisted for a board that only had a custom position'
			).toEqual({})
		);
		expect(
			getByRoleWithIcon('button', { icon: ICONS.resetBoardSize }),
			'reset size action should be disabled for a new board with default sizes'
		).toBeDisabled();
	});
});
