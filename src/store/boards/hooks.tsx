/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React, { FC, useContext, useMemo, createContext } from 'react';
import { Board, BoardHooksContext } from '../../../types';
import { closeBoard, setCurrentBoard, updateBoard, useBoardStore } from './store';

export const useBoardById = <T,>(id: string): Board<T> => useBoardStore((s) => s.boards[id]);
export const getBoardById = <T,>(id: string): Board<T> => useBoardStore.getState().boards[id];
export const useBoardContextById = <T,>(id: string): T =>
	useBoardStore((s) => s.boards[id].context);
export const getBoardContextById = <T,>(id: string): T =>
	useBoardStore.getState().boards[id].context;

// Must be empty if no board is available
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const boardContext = createContext<Board>();
// Must be empty if no board is available
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const boardHooksContext = createContext<BoardHooksContext>();

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

export const useBoardHooks = (): BoardHooksContext => useContext(boardHooksContext);
export const useBoard = (): Board => useContext(boardContext);
