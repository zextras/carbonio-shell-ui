/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import type { FC } from 'react';
import React, { createContext, useContext, useMemo } from 'react';

import { closeBoard, setCurrentBoard, updateBoard, useBoardStore } from './store';
import type { Board } from '../../types/boards';

export const useBoardById = <T,>(id: string): Board<T> | undefined =>
	useBoardStore((s) => s.boards[id]) as Board<T> | undefined;
export const getBoardById = <T,>(id: string): Board<T> | undefined =>
	useBoardStore.getState().boards[id] as Board<T> | undefined;
export const useBoardContextById = <T,>(id: string): T | undefined =>
	useBoardStore((s) => s.boards[id]?.context) as T | undefined;
export const getBoardContextById = <T,>(id: string): T | undefined =>
	useBoardStore.getState().boards[id]?.context as T | undefined;

// Must be empty if no board is available
export const boardContext = createContext<Board | undefined>(undefined);
export type BoardHooksContext = {
	closeBoard: () => void;
	updateBoard: (b: Partial<Board>) => void;
	setCurrentBoard: () => void;
	getBoardContext: <T>() => T;
	getBoard: <T>() => Board<T>;
};

// Must be empty if no board is available
export const boardHooksContext = createContext<BoardHooksContext | undefined>(undefined);

export const BoardProvider: FC<{ id: string }> = ({ children, id }) => {
	const board = useBoardById(id);
	const callbacks = useMemo<BoardHooksContext>(
		() => ({
			// at this point the id should be only one of the available boards,
			// that's way the cast without further checks
			getBoardContext: <T,>() => getBoardContextById(id) as T,
			getBoard: <T,>() => getBoardById(id) as Board<T>,
			closeBoard: () => closeBoard(id),
			updateBoard: (b) => updateBoard(id, b),
			setCurrentBoard: () => setCurrentBoard(id)
		}),
		[id]
	);
	return (
		<boardHooksContext.Provider value={callbacks}>
			<boardContext.Provider value={board}>{children}</boardContext.Provider>
		</boardHooksContext.Provider>
	);
};

/**
 * Allow quick access to all current board hooks.
 * This hook must be used from inside a board view.
 * Outside a board, it will throw an error.
 */
export const useBoardHooks = (): BoardHooksContext => {
	const hooks = useContext(boardHooksContext);
	if (hooks === undefined) {
		throw new Error(
			'board hooks is undefined. This hook is meant to be used only from inside boards. Check that the hook is invoked from a board'
		);
	}
	return hooks;
};

/**
 * Retrieve the board object.
 * This hook must be used from inside a board view.
 * Outside a board, it will throw an error.
 */
export const useBoard = <TBoardContext,>(): Board<TBoardContext> => {
	const board = useContext(boardContext);
	if (board === undefined) {
		throw new Error(
			'board is undefined. This hook is meant to be used only from inside boards. Check that the hook is invoked from a board'
		);
	}
	return board as Board<TBoardContext>;
};
