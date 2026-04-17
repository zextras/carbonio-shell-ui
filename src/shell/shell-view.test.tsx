/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { act, screen, waitFor } from '@testing-library/react';

import { BOARD_DEFAULT_POSITION } from './boards/board-container';
import type { Border } from './hooks/useResize';
import ShellView from './shell-view';
import { HEADER_BAR_HEIGHT, LOCAL_STORAGE_BOARD_SIZE, PRIMARY_BAR_WIDTH } from '../constants';
import * as constants from '../constants';
import { ICONS, TESTID_SELECTORS } from '../tests/constants';
import { mockedApps, setupAppStore } from '../tests/test-app-utils';
import {
	buildBoardSizeAndPosition,
	buildMousePosition,
	INITIAL_SIZE_AND_POS,
	moveBoard,
	resizeBoard,
	setupBoardStore
} from '../tests/test-board-utils';
import { setup } from '../tests/utils';
import type { Board } from '../types/boards';
import type { SizeAndPosition } from '../utils/utils';

const { Dummy } = vi.hoisted(() => ({
	Dummy: (): null => null
}));

vi.mock('../utility-bar/bar', () => ({
	ShellUtilityBar: Dummy
}));

vi.mock('./shell-header', () => ({ default: Dummy }));
vi.mock('../constants');

beforeEach(() => {
	setupAppStore();
	const boards: Record<string, Board> = {
		'board-1': {
			id: 'board-1',
			boardViewId: '/url',
			app: mockedApps[0].name,
			title: 'title1',
			icon: 'CubeOutline'
		}
	};
	setupBoardStore('board-1', boards);
});

describe('Shell view', () => {
	describe('BoardContainerComp', () => {
		test('will have 0 offsets in focus mode', () => {
			vi.mocked(constants).IS_FOCUS_MODE = true;

			setup(<ShellView />);

			const boardContainer = screen.getByTestId(TESTID_SELECTORS.boardContainerComp);

			expect(boardContainer).toHaveStyleRule('height', 'calc(100vh - 0rem)');
			expect(boardContainer).toHaveStyleRule('width', 'calc(100vw - 0rem)');
			expect(boardContainer).toHaveStyleRule('top', '0rem');
			expect(boardContainer).toHaveStyleRule('left', '0rem');
		});
		test('will have offsets if not in focus mode', () => {
			vi.mocked(constants).IS_FOCUS_MODE = false;

			setup(<ShellView />);

			const boardContainer = screen.getByTestId(TESTID_SELECTORS.boardContainerComp);

			expect(boardContainer).toHaveStyleRule('height', `calc(100vh - ${HEADER_BAR_HEIGHT})`);
			expect(boardContainer).toHaveStyleRule('width', `calc(100vw - ${PRIMARY_BAR_WIDTH})`);
			expect(boardContainer).toHaveStyleRule('top', HEADER_BAR_HEIGHT);
			expect(boardContainer).toHaveStyleRule('left', PRIMARY_BAR_WIDTH);
		});
	});

	test('When resizing under mobile breakpoint, board does not disappear', () => {
		setup(<ShellView />);

		expect(screen.getByText('title1')).toBeVisible();
		act(() => {
			window.resizeTo(500, 300);
		});
		expect(screen.getByText('title1')).toBeVisible();
	});

	test('Collapse board toggler toggle visibility of the board', async () => {
		const { getByRoleWithIcon, user } = setup(<ShellView />);
		expect(screen.getByText('title1')).toBeVisible();
		await user.click(getByRoleWithIcon('button', { icon: ICONS.collapseBoard }));
		expect(screen.getByText('title1')).toBeInTheDocument();
		expect(screen.queryByText('title1')).not.toBeVisible();
		await user.click(getByRoleWithIcon('button', { icon: ICONS.unCollapseBoard }));
		expect(screen.getByText('title1')).toBeVisible();
	});

	test('Board keeps custom size and position when re-opened after being collapsed', async () => {
		const { getByRoleWithIcon, user } = setup(<ShellView />);
		act(() => {
			// run updateBoardPosition debounced fn
			vi.advanceTimersToNextTimer();
		});
		const border: Border = 'n';
		const board = screen.getByTestId(TESTID_SELECTORS.board);
		const elementForMove = screen.getByTestId(TESTID_SELECTORS.boardHeader);
		let boardInitialSizeAndPos = buildBoardSizeAndPosition();
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
		boardInitialSizeAndPos = buildBoardSizeAndPosition(boardNewSizeAndPos);
		boardNewSizeAndPos = {
			width: boardNewSizeAndPos.width,
			height: boardNewSizeAndPos.height,
			top: 500,
			left: 500
		};
		await moveBoard(
			board,
			boardInitialSizeAndPos,
			{ clientX: boardInitialSizeAndPos.clientLeft, clientY: boardInitialSizeAndPos.clientTop },
			{ clientX: 500, clientY: 500 },
			boardNewSizeAndPos,
			elementForMove
		);
		await user.click(getByRoleWithIcon('button', { icon: ICONS.collapseBoard }));
		await user.click(getByRoleWithIcon('button', { icon: ICONS.unCollapseBoard }));
		expect(board).toHaveStyle({
			height: `${boardNewSizeAndPos.height}px`,
			width: `${boardNewSizeAndPos.width}px`,
			top: `${boardNewSizeAndPos.top}px`,
			left: `${boardNewSizeAndPos.left}px`
		});
	});

	test('Board keeps resized size but reset position when re-opened after being close definitively', async () => {
		const { getByRoleWithIcon, user } = setup(<ShellView />);
		act(() => {
			// run updateBoardPosition debounced fn
			vi.advanceTimersToNextTimer();
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
		await user.click(getByRoleWithIcon('button', { icon: ICONS.closeBoard }));
		act(() => {
			vi.advanceTimersToNextTimer();
		});
		await waitFor(() =>
			expect(JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_BOARD_SIZE) || '')).toEqual({
				height: boardNewSizeAndPos.height,
				width: boardNewSizeAndPos.width
			})
		);
		// update state to open a new board
		const boards2: Record<string, Board> = {
			'board-2': {
				id: 'board-2',
				boardViewId: '/url',
				app: mockedApps[0].name,
				title: 'title2',
				icon: 'CubeOutline'
			}
		};
		act(() => {
			setupBoardStore('board-2', boards2);
		});
		await screen.findByText('title2');
		act(() => {
			// run updateBoardPosition debounced fn
			vi.advanceTimersToNextTimer();
		});
		const board2Element = screen.getByTestId(TESTID_SELECTORS.board);
		expect(board2Element).toHaveStyle({
			...BOARD_DEFAULT_POSITION,
			height: `${boardNewSizeAndPos.height}px`,
			width: `${boardNewSizeAndPos.width}px`
		});
	});

	test('Resizing the board, closing it, opening a new board and then moving it to a different position set the new position and keep the custom size', async () => {
		const { getAllByRoleWithIcon, user } = setup(<ShellView />);
		act(() => {
			// run updateBoardPosition debounced fn
			vi.advanceTimersToNextTimer();
		});
		const border: Border = 'n';
		const board = screen.getByTestId(TESTID_SELECTORS.board);
		const elementForMove = screen.getByTestId(TESTID_SELECTORS.boardHeader);
		let boardInitialSizeAndPos = buildBoardSizeAndPosition();
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
		boardInitialSizeAndPos = buildBoardSizeAndPosition(boardNewSizeAndPos);
		boardNewSizeAndPos = { ...boardNewSizeAndPos, top: 0, left: 0 };
		await moveBoard(
			board,
			boardInitialSizeAndPos,
			{ clientX: boardInitialSizeAndPos.clientLeft, clientY: boardInitialSizeAndPos.clientTop },
			{ clientX: 0, clientY: 0 },
			boardNewSizeAndPos,
			elementForMove
		);
		await user.click(getAllByRoleWithIcon('button', { icon: ICONS.close })[0]);
		// update state to open a new board
		const boards2: Record<string, Board> = {
			'board-2': {
				id: 'board-2',
				boardViewId: '/url',
				app: mockedApps[0].name,
				title: 'title2',
				icon: 'CubeOutline'
			}
		};
		act(() => {
			setupBoardStore('board-2', boards2);
		});
		await screen.findByText('title2');
		act(() => {
			// run updateBoardPosition debounced fn
			vi.advanceTimersToNextTimer();
		});
		const board2Element = screen.getByTestId(TESTID_SELECTORS.board);
		const elementForMove2 = screen.getByTestId(TESTID_SELECTORS.boardHeader);
		boardInitialSizeAndPos = buildBoardSizeAndPosition({
			...INITIAL_SIZE_AND_POS,
			width: boardNewSizeAndPos.width,
			height: boardNewSizeAndPos.height
		});
		boardNewSizeAndPos = { ...boardNewSizeAndPos, top: 55, left: 80 };
		await moveBoard(
			board2Element,
			boardInitialSizeAndPos,
			{ clientX: boardInitialSizeAndPos.clientLeft, clientY: boardInitialSizeAndPos.clientTop },
			{ clientX: 80, clientY: 55 },
			boardNewSizeAndPos,
			elementForMove2
		);
		expect(board2Element).toHaveStyle({
			height: `${boardNewSizeAndPos.height}px`,
			width: `${boardNewSizeAndPos.width}px`,
			left: `${boardNewSizeAndPos.left}px`,
			top: `${boardNewSizeAndPos.top}px`
		});
	});
	test('In focus mode the board container should receive minimizeAllowed to false', async () => {
		vi.mocked(constants).IS_FOCUS_MODE = true;

		const { queryByRoleWithIcon } = setup(<ShellView />);

		expect(
			queryByRoleWithIcon('button', { icon: `${ICONS.collapseBoard}Outline` })
		).not.toBeInTheDocument();
	});
});
