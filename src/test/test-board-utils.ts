/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { first, keys } from 'lodash';
import { Border } from '../shell/hooks/useResize';
import { Board } from '../../types';
import { useBoardStore } from '../store/boards';
import { SizeAndPosition } from '../utils/utils';

export type InitialSizeAndPosition = SizeAndPosition & { clientLeft: number; clientTop: number };

export const mockedBoardState: Record<string, Board> = {
	'board-1': { id: 'board-1', url: '/url', app: 'app', title: 'title1', icon: 'CubeOutline' },
	'board-2': { id: 'board-2', url: '/url', app: 'app', title: 'title2', icon: 'CubeOutline' },
	'board-3': { id: 'board-3', url: '/url', app: 'app', title: 'title3', icon: 'CubeOutline' }
};

export function setupBoardStore(current?: string, boardState?: Record<string, Board>): void {
	const boards = boardState || mockedBoardState;
	useBoardStore.setState(() => ({
		boards,
		orderedBoards: Object.keys(boards),
		current: current || first(keys(boards))
	}));
}

// initial size and pos must be greater than the min width and height of the board
export const INITIAL_SIZE_AND_POS: SizeAndPosition = { width: 800, height: 600, top: 75, left: 25 };
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
	const boardContainer = board.parentElement;
	if (boardContainer) {
		jest.spyOn(boardContainer, 'clientWidth', 'get').mockReturnValue(1024);
		jest.spyOn(boardContainer, 'clientHeight', 'get').mockReturnValue(800);
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
