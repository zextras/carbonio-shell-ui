/*
 * SPDX-FileCopyrightText: 2025 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React from 'react';

import { act, renderHook } from '@testing-library/react';

import { BoardProvider, useBoardHooks } from './hooks';
import { setBoardContentStatus, useBoardStore } from './store';
import { mockedBoardState, setupBoardStore } from '../../tests/test-board-utils';

beforeEach(() => {
	setupBoardStore('board-1');
});

describe('setBoardContentStatus', () => {
	test('sets the content status of the board', () => {
		setBoardContentStatus('board-1', 'dirty');
		expect(useBoardStore.getState().boards['board-1'].contentStatus).toBe('dirty');
		setBoardContentStatus('board-1', 'saving');
		expect(useBoardStore.getState().boards['board-1'].contentStatus).toBe('saving');
		setBoardContentStatus('board-1', 'saved');
		expect(useBoardStore.getState().boards['board-1'].contentStatus).toBe('saved');
		setBoardContentStatus('board-1', 'pristine');
		expect(useBoardStore.getState().boards['board-1'].contentStatus).toBe('pristine');
	});

	test('does not change the other boards', () => {
		setBoardContentStatus('board-1', 'dirty');
		expect(useBoardStore.getState().boards['board-2']).toEqual(mockedBoardState['board-2']);
	});

	test('does nothing if the board does not exist', () => {
		const before = useBoardStore.getState().boards;
		setBoardContentStatus('unknown', 'dirty');
		expect(useBoardStore.getState().boards).toEqual(before);
		expect(useBoardStore.getState().boards).not.toHaveProperty('unknown');
	});
});

describe('useBoardHooks setContentStatus', () => {
	test('sets the content status of the board of the provider only', () => {
		const wrapper = ({ children }: React.PropsWithChildren): React.JSX.Element => (
			<BoardProvider id="board-2">{children}</BoardProvider>
		);
		const { result } = renderHook(() => useBoardHooks(), { wrapper });
		act(() => result.current.setContentStatus('saving'));
		expect(useBoardStore.getState().boards['board-2'].contentStatus).toBe('saving');
		expect(result.current.getBoard().contentStatus).toBe('saving');
		expect(useBoardStore.getState().boards['board-1'].contentStatus).toBeUndefined();
	});
});
