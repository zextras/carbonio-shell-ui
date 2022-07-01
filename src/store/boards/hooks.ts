import { Board, useBoardStore } from './store';

/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
export const useBoard = <T>(id: string): Board<T> => useBoardStore((s) => s.boards[id]);
export const getBoard = <T>(id: string): Board<T> => useBoardStore.getState().boards[id];
export const useBoardContext = <T>(id: string): T => useBoardStore((s) => s.boards[id].context);
export const getBoardContext = <T>(id: string): T => useBoardStore.getState().boards[id].context;
