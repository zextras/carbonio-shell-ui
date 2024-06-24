/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import { first, keys } from 'lodash';

import { TESTID_SELECTORS } from './constants';
import { mockedApps } from './test-app-utils';
import { LOCAL_STORAGE_BOARD_SIZE } from '../constants';
import type { Border } from '../shell/hooks/useResize';
import { useBoardStore } from '../store/boards';
import type { Board } from '../types/boards';
import type { SizeAndPosition } from '../utils/utils';

export type InitialSizeAndPosition = SizeAndPosition & {
	clientLeft: number;
	clientTop: number;
};

export const mockedBoardState: Record<string, Board> = {
	'board-1': {
		id: 'board-1',
		url: '/url',
		app: mockedApps[0].name,
		title: 'title1',
		icon: 'CubeOutline'
	},
	'board-2': {
		id: 'board-2',
		url: '/url',
		app: mockedApps[0].name,
		title: 'title2',
		icon: 'CubeOutline'
	},
	'board-3': {
		id: 'board-3',
		url: '/url',
		app: mockedApps[0].name,
		title: 'title3',
		icon: 'CubeOutline'
	}
};

export function setupBoardStore(current?: string, boardState?: Record<string, Board>): void {
	const boards = boardState || mockedBoardState;
	useBoardStore.setState(() => ({
		boards,
		orderedBoards: Object.keys(boards),
		current: current ?? first(keys(boards))
	}));
}

// initial size and pos must be greater than the min width and height of the board
export const INITIAL_SIZE_AND_POS: SizeAndPosition = {
	width: 800,
	height: 600,
	top: 75,
	left: 25
};
export function buildBoardSizeAndPosition(
	sizeAndPos = INITIAL_SIZE_AND_POS,
	offset = 0
): InitialSizeAndPosition {
	return {
		...sizeAndPos,
		clientTop: sizeAndPos.top + offset,
		clientLeft: sizeAndPos.left + offset
	};
}

export function buildMousePosition(
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

export function setupBoardSizes(
	board: HTMLElement,
	initialSizeAndPos: InitialSizeAndPosition
): void {
	// eslint-disable-next-line testing-library/no-node-access
	const boardContainer = board.parentElement;
	if (boardContainer) {
		jest.spyOn(boardContainer, 'clientWidth', 'get').mockImplementation(() => window.innerWidth);
		jest.spyOn(boardContainer, 'clientHeight', 'get').mockImplementation(() => window.innerHeight);
	}
	jest.spyOn(board, 'offsetWidth', 'get').mockReturnValue(initialSizeAndPos.width);
	jest.spyOn(board, 'offsetHeight', 'get').mockReturnValue(initialSizeAndPos.height);
	jest.spyOn(board, 'offsetTop', 'get').mockReturnValue(initialSizeAndPos.top);
	jest.spyOn(board, 'offsetLeft', 'get').mockReturnValue(initialSizeAndPos.left);
	jest.spyOn(board, 'getBoundingClientRect').mockReturnValue({
		top: initialSizeAndPos.clientTop,
		left: initialSizeAndPos.clientLeft
	} as DOMRect);
}

export async function resizeBoard(
	board: HTMLElement,
	sizeAndPos: InitialSizeAndPosition,
	border: Border,
	mouseNewPosition: { clientX: number; clientY: number },
	boardNewPosition: SizeAndPosition
): Promise<void> {
	setupBoardSizes(board, sizeAndPos);
	const borderElement = screen.getByTestId(TESTID_SELECTORS.resizableBorder(border));
	// eslint-disable-next-line testing-library/prefer-user-event
	fireEvent.mouseDown(borderElement);
	// eslint-disable-next-line testing-library/prefer-user-event
	fireEvent.mouseMove(document.body, mouseNewPosition);
	// eslint-disable-next-line testing-library/prefer-user-event
	fireEvent.mouseUp(document.body);
	await waitFor(() =>
		expect(JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_BOARD_SIZE) ?? '{}')).toEqual(
			boardNewPosition
		)
	);
	act(() => {
		// run updateBoardPosition debounced fn
		jest.advanceTimersToNextTimer();
	});
}

export async function moveBoard(
	board: HTMLElement,
	sizeAndPos: InitialSizeAndPosition,
	mouseInitialPosition: { clientX: number; clientY: number },
	mouseNewPosition: { clientX: number; clientY: number },
	boardNewPosition: Partial<SizeAndPosition>,
	elementForMove: HTMLElement = board
): Promise<void> {
	setupBoardSizes(board, sizeAndPos);
	// eslint-disable-next-line testing-library/prefer-user-event
	fireEvent.mouseDown(elementForMove, mouseInitialPosition);
	act(() => {
		// run move timer
		jest.runOnlyPendingTimers();
	});
	// eslint-disable-next-line testing-library/prefer-user-event
	fireEvent.mouseMove(document.body, mouseNewPosition);
	// eslint-disable-next-line testing-library/prefer-user-event
	fireEvent.mouseUp(document.body);
	// eslint-disable-next-line testing-library/prefer-user-event
	fireEvent.click(elementForMove);
	await waitFor(() =>
		expect(JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_BOARD_SIZE) ?? '{}')).toEqual(
			boardNewPosition
		)
	);
	act(() => {
		// run updateBoardPosition debounced fn
		jest.advanceTimersToNextTimer();
	});
}
