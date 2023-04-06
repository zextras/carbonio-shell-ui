/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React from 'react';
import { screen, within } from '@testing-library/react';
import { setup } from '../../test/utils';
import { TabsList } from './board-tab-list';
import { useBoardStore } from '../../store/boards';
import { Board } from '../../../types';
import 'jest-styled-components';
import { PALETTE } from '../../test/constants';

describe('Shell boards', () => {
	const boards: Record<string, Board> = {
		'board-1': { id: 'board-1', url: 'url', app: 'app', title: 'title1', icon: 'CubeOutline' },
		'board-2': { id: 'board-2', url: 'url', app: 'app', title: 'title2', icon: 'CubeOutline' },
		'board-3': { id: 'board-3', url: 'url', app: 'app', title: 'title3', icon: 'CubeOutline' }
	};

	function setupState(current: string, boardState?: Record<string, Board>): void {
		useBoardStore.setState(() => ({
			boards: boardState || boards,
			orderedBoards: ['board-1', 'board-2', 'board-3'],
			current
		}));
	}

	test('If I close the first tab that is open, the tab on its right should be seen correctly', async () => {
		setupState('board-1');
		const { user } = setup(<TabsList />);
		const title1 = screen.getByText('title1');
		const title2 = screen.getByText('title2');
		const title3 = screen.getByText('title3');
		expect(title1).toHaveStyleRule('color', PALETTE.text.regular);
		expect(title2).toHaveStyleRule('color', PALETTE.secondary.regular);
		expect(title3).toHaveStyleRule('color', PALETTE.secondary.regular);

		const tab1 = screen.getByTestId(`board-tab-board-1`);
		const board1closeIcon = within(tab1).getByTestId('icon: Close');
		await user.click(board1closeIcon);
		expect(tab1).not.toBeInTheDocument();
		expect(title1).not.toBeInTheDocument();
		expect(title2).toHaveStyleRule('color', PALETTE.text.regular);
		expect(title3).toHaveStyleRule('color', PALETTE.secondary.regular);
		expect(useBoardStore.getState().current).toBe('board-2');
	});

	test('If I close the first tab that is not open, the one that is already open must remain correctly visible', async () => {
		setupState('board-2');
		const { user } = setup(<TabsList />);
		const title1 = screen.getByText('title1');
		const title2 = screen.getByText('title2');
		const title3 = screen.getByText('title3');
		expect(title1).toHaveStyleRule('color', PALETTE.secondary.regular);
		expect(title2).toHaveStyleRule('color', PALETTE.text.regular);
		expect(title3).toHaveStyleRule('color', PALETTE.secondary.regular);

		const tab1 = screen.getByTestId(`board-tab-board-1`);
		const board1closeIcon = within(tab1).getByTestId('icon: Close');
		await user.click(board1closeIcon);
		expect(tab1).not.toBeInTheDocument();
		expect(title1).not.toBeInTheDocument();
		expect(title2).toHaveStyleRule('color', PALETTE.text.regular);
		expect(title3).toHaveStyleRule('color', PALETTE.secondary.regular);
		expect(useBoardStore.getState().current).toBe('board-2');
	});

	test('If I close the last tab that is open (tab on the far right) the tab on its left must be correctly visible', async () => {
		setupState('board-3');
		const { user } = setup(<TabsList />);
		const title1 = screen.getByText('title1');
		const title2 = screen.getByText('title2');
		const title3 = screen.getByText('title3');
		expect(title1).toHaveStyleRule('color', PALETTE.secondary.regular);
		expect(title2).toHaveStyleRule('color', PALETTE.secondary.regular);
		expect(title3).toHaveStyleRule('color', PALETTE.text.regular);

		const tab3 = screen.getByTestId(`board-tab-board-3`);
		const board3closeIcon = within(tab3).getByTestId('icon: Close');
		await user.click(board3closeIcon);
		expect(tab3).not.toBeInTheDocument();
		expect(title3).not.toBeInTheDocument();
		expect(title1).toHaveStyleRule('color', PALETTE.secondary.regular);
		expect(title2).toHaveStyleRule('color', PALETTE.text.regular);
		expect(useBoardStore.getState().current).toBe('board-2');
	});

	test('If I close the last tab that is not open (tab on the far right) the one that is already open must remain correctly visible', async () => {
		setupState('board-2');
		const { user } = setup(<TabsList />);
		const title1 = screen.getByText('title1');
		const title2 = screen.getByText('title2');
		const title3 = screen.getByText('title3');
		expect(title1).toHaveStyleRule('color', PALETTE.secondary.regular);
		expect(title2).toHaveStyleRule('color', PALETTE.text.regular);
		expect(title3).toHaveStyleRule('color', PALETTE.secondary.regular);

		const tab3 = screen.getByTestId(`board-tab-board-3`);
		const board3closeIcon = within(tab3).getByTestId('icon: Close');
		await user.click(board3closeIcon);
		expect(tab3).not.toBeInTheDocument();
		expect(title3).not.toBeInTheDocument();
		expect(title1).toHaveStyleRule('color', PALETTE.secondary.regular);
		expect(title2).toHaveStyleRule('color', PALETTE.text.regular);
		expect(useBoardStore.getState().current).toBe('board-2');
	});

	test('If i close a middle tab that is open, the tab on its right must be correctly visible', async () => {
		setupState('board-2');
		const { user } = setup(<TabsList />);
		const title1 = screen.getByText('title1');
		const title2 = screen.getByText('title2');
		const title3 = screen.getByText('title3');
		expect(title1).toHaveStyleRule('color', PALETTE.secondary.regular);
		expect(title2).toHaveStyleRule('color', PALETTE.text.regular);
		expect(title3).toHaveStyleRule('color', PALETTE.secondary.regular);

		const tab2 = screen.getByTestId(`board-tab-board-2`);
		const board2closeIcon = within(tab2).getByTestId('icon: Close');
		await user.click(board2closeIcon);
		expect(tab2).not.toBeInTheDocument();
		expect(title2).not.toBeInTheDocument();
		expect(title1).toHaveStyleRule('color', PALETTE.secondary.regular);
		expect(title3).toHaveStyleRule('color', PALETTE.text.regular);
		expect(useBoardStore.getState().current).toBe('board-3');
	});

	test('If I close a middle tab that is not open, the one that is already open must remain correctly visible', async () => {
		setupState('board-1');
		const { user } = setup(<TabsList />);
		const title1 = screen.getByText('title1');
		const title2 = screen.getByText('title2');
		const title3 = screen.getByText('title3');
		expect(title1).toHaveStyleRule('color', PALETTE.text.regular);
		expect(title2).toHaveStyleRule('color', PALETTE.secondary.regular);
		expect(title3).toHaveStyleRule('color', PALETTE.secondary.regular);

		const tab2 = screen.getByTestId(`board-tab-board-2`);
		const board2closeIcon = within(tab2).getByTestId('icon: Close');
		await user.click(board2closeIcon);
		expect(tab2).not.toBeInTheDocument();
		expect(title2).not.toBeInTheDocument();
		expect(title1).toHaveStyleRule('color', PALETTE.text.regular);
		expect(title3).toHaveStyleRule('color', PALETTE.secondary.regular);
		expect(useBoardStore.getState().current).toBe('board-1');
	});
});
