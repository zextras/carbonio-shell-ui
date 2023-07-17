/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import produce from 'immer';
import { forEach, trimStart, uniqueId } from 'lodash';
import { create } from 'zustand';

import type { BoardState, Board } from '../../../types';
import { getApp } from '../app';

// extra currying as suggested in https://github.com/pmndrs/zustand/blob/main/docs/guides/typescript.md#basic-usage
export const useBoardStore = create<BoardState>()(() => ({
	orderedBoards: [],
	boards: {},
	expanded: false,
	minimized: false
}));

export const addBoard =
	(app: string) =>
	<T = unknown>(
		board: Omit<Board<T>, 'app' | 'icon' | 'id'> & { id?: string; icon?: string },
		expanded?: BoardState['expanded']
	): Board => {
		const id = board.id ?? uniqueId('board-');
		useBoardStore.setState(
			produce((state: BoardState) => {
				state.boards[id] = {
					...board,
					app,
					id,
					icon: board.icon ?? getApp(app)()?.icon ?? 'CubeOutline',
					url: trimStart(board.url, '/')
				};
				state.current = id;
				state.minimized = false;
				state.expanded = expanded ?? state.expanded;
				state.orderedBoards.unshift(id);
			})
		);
		return useBoardStore.getState().boards[id];
	};
export const closeBoard = (id: string): void => {
	useBoardStore.setState(
		produce((state: BoardState) => {
			state.boards[id]?.onClose?.(state.boards[id]);
			delete state.boards[id];
			const index = state.orderedBoards.findIndex((boardId) => boardId === id);
			if (state.current === id) {
				state.current = state.orderedBoards[index + 1] || state.orderedBoards[index - 1];
			}
			if (index !== -1) {
				state.orderedBoards.splice(index, 1);
			}
		})
	);
};
export const closeAllBoards = (): void => {
	useBoardStore.setState(
		produce((state: BoardState) => {
			forEach(state.boards, (b) => {
				b?.onClose?.(b);
				delete state.boards[b.id];
			});
			state.orderedBoards = [];
		})
	);
};
export const onGoToPanel = (): void => {
	useBoardStore.setState(
		produce((state: BoardState) => {
			const id = state.current;
			if (id) {
				state.boards[id]?.onGoToPanel?.(state.boards[id]);
				delete state.boards[id];
				const index = state.orderedBoards.findIndex((boardId) => boardId === id);
				if (index !== -1) {
					state.orderedBoards.splice(index, 1);
				}
			}
		})
	);
};
export const minimizeBoards = (): void => {
	useBoardStore.setState({
		minimized: true
	});
};
export const reopenBoards = (): void => {
	useBoardStore.setState({
		minimized: false
	});
};
export const expandBoards = (): void => {
	useBoardStore.setState({
		expanded: true
	});
};
export const reduceBoards = (): void => {
	useBoardStore.setState({
		expanded: false
	});
};
export const setCurrentBoard = (id: string): void => {
	useBoardStore.setState({
		current: id
	});
};
export const updateBoard = <T = unknown>(id: string, board: Partial<Board<T>>): void => {
	useBoardStore.setState(
		produce((state: BoardState) => {
			if (state.boards[id])
				state.boards[id] = {
					...state.boards[id],
					...board
				};
		})
	);
};
export const updateBoardContext = <T = unknown>(id: string, context: T): void => {
	useBoardStore.setState(
		produce((state: BoardState) => {
			if (state.boards[id]) {
				state.boards[id].context = context;
			}
		})
	);
};
