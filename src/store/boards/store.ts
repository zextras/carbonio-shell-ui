/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import produce from 'immer';
import { forEach } from 'lodash';
import create from 'zustand';
import { BoardState, Board } from '../../../types';

export const useBoardStore = create<BoardState>(() => ({
	boards: {},
	expanded: false,
	minimized: false
}));

export const addBoard =
	(app: string) =>
	<T = any>(board: Omit<Board<T>, 'app'>): void => {
		useBoardStore.setState(
			produce((s: BoardState) => {
				// eslint-disable-next-line no-param-reassign
				s.boards[board.id] = { ...board, app };
				// eslint-disable-next-line no-param-reassign
				s.current = board.id;
				// eslint-disable-next-line no-param-reassign
				s.minimized = false;
			})
		);
	};
export const closeBoard = (id: string): void => {
	useBoardStore.setState(
		produce((s: BoardState) => {
			s.boards[id]?.onClose?.(s.boards[id]);
			// eslint-disable-next-line no-param-reassign
			delete s.boards[id];
		})
	);
};
export const closeAllBoards = (): void => {
	useBoardStore.setState(
		produce((s: BoardState) => {
			forEach(s.boards, (b) => {
				b?.onClose?.(b);
				// eslint-disable-next-line no-param-reassign
				delete s.boards[b.id];
			});
		})
	);
};
export const onGoToPanel = (): void => {
	useBoardStore.setState(
		produce((s: BoardState) => {
			const id = s.current;
			if (id) {
				s.boards[id]?.onGoToPanel?.(s.boards[id]);
				// eslint-disable-next-line no-param-reassign
				delete s.boards[id];
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
export const updateBoard = <T = any>(id: string, board: Partial<Board<T>>): void => {
	useBoardStore.setState(
		produce((s: BoardState) => {
			if (s.boards[id])
				// eslint-disable-next-line no-param-reassign
				s.boards[id] = {
					...s.boards[id],
					...board
				};
		})
	);
};
export const updateBoardContext = <T = any>(id: string, context: T): void => {
	useBoardStore.setState(
		produce((s: BoardState) => {
			if (s.boards[id])
				// eslint-disable-next-line no-param-reassign
				s.boards[id].context = context;
		})
	);
};
