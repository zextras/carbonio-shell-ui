/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { Board } from '../../../types';
import { useBoardStore } from './store';

export const useBoard = <T>(id: string): Board<T> => useBoardStore((s) => s.boards[id]);
export const getBoard = <T>(id: string): Board<T> => useBoardStore.getState().boards[id];
export const useBoardContext = <T>(id: string): T => useBoardStore((s) => s.boards[id].context);
export const getBoardContext = <T>(id: string): T => useBoardStore.getState().boards[id].context;
