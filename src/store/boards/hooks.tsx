/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import type { FC } from 'react';
import React, { useContext, useMemo, createContext } from 'react';

import { closeBoard, setCurrentBoard, updateBoard, useBoardStore } from './store';
import type { Board, BoardHooksContext } from '../../types/boards';

export const useBoardById = <T,>(id: string): Board<T> =>
	useBoardStore((s) => s.boards[id]) as Board<T>;
export const getBoardById = <T,>(id: string): Board<T> =>
	useBoardStore.getState().boards[id] as Board<T>;
export const useBoardContextById = <T,>(id: string): T =>
	useBoardStore((s) => s.boards[id].context) as T;
export const getBoardContextById = <T,>(id: string): T =>
	useBoardStore.getState().boards[id].context as T;

// Must be empty if no board is available
export const boardContext = createContext<Board | undefined>(undefined);
// Must be empty if no board is available
export const boardHooksContext = createContext<BoardHooksContext | undefined>(undefined);

export const BoardProvider: FC<{ id: string }> = ({ children, id }) => {
	const board = useBoardById(id);
	const callbacks = useMemo<BoardHooksContext>(
		() => ({
			getBoardContext: () => getBoardContextById(id),
			getBoard: () => getBoardById(id),
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

export const useBoardHooks = (): BoardHooksContext | undefined => useContext(boardHooksContext);
export const useBoard = (): Board | undefined => useContext(boardContext);
