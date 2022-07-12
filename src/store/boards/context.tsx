/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React, { createContext, FC, useContext } from 'react';
import { BoardHooksContext } from '../../../types';
import { useBoard } from './hooks';
import { closeBoard, setCurrentBoard, updateBoard } from './store';

// Must be empty if no board is available
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const boardHooksContext = createContext<BoardHooksContext>();

export const BoardProvider: FC<{ id: string }> = ({ children, id }) => {
	const board = useBoard(id);
	return (
		<boardHooksContext.Provider
			value={{
				boardId: id,
				board,
				closeBoard: () => closeBoard(id),
				updateBoard: (b) => updateBoard(id, b),
				setCurrentBoard: () => setCurrentBoard(id)
			}}
		>
			{children}
		</boardHooksContext.Provider>
	);
};
export const useBoardHooks = (): BoardHooksContext => useContext(boardHooksContext);
