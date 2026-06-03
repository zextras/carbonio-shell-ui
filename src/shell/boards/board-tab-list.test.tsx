/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { screen, within } from '@testing-library/react';

import { TabsList } from './board-tab-list';
import { useBoardStore } from '../../store/boards';
import { ICONS, PALETTE } from '../../tests/constants';
import { setupBoardStore } from '../../tests/test-board-utils';
import { setup } from '../../tests/utils';

describe('Shell boards', () => {
	test('If I close the first tab that is open, the tab on its right should be seen correctly', async () => {
		setupBoardStore('board-1');
		const { user } = setup(<TabsList />);
		const title1 = screen.getByText('title1');
		const title2 = screen.getByText('title2');
		const title3 = screen.getByText('title3');
		expect(title1, 'open tab title1 should use the active text color').toHaveStyleRule(
			'color',
			PALETTE.text.regular
		);
		expect(title2, 'inactive tab title2 should use the secondary color').toHaveStyleRule(
			'color',
			PALETTE.secondary.regular
		);
		expect(title3, 'inactive tab title3 should use the secondary color').toHaveStyleRule(
			'color',
			PALETTE.secondary.regular
		);

		const tab1 = screen.getByTestId(`board-tab-board-1`);
		const board1closeIcon = within(tab1).getByTestId(`icon: ${ICONS.close}`);
		await user.click(board1closeIcon);
		expect(tab1, 'closed tab1 should be removed from the document').not.toBeInTheDocument();
		expect(title1, 'closed tab title1 should be removed from the document').not.toBeInTheDocument();
		expect(title2, 'title2 should become the active tab after closing tab1').toHaveStyleRule(
			'color',
			PALETTE.text.regular
		);
		expect(title3, 'title3 should remain an inactive tab').toHaveStyleRule(
			'color',
			PALETTE.secondary.regular
		);
		expect(useBoardStore.getState().current, 'board-2 should become the current board').toBe(
			'board-2'
		);
	});

	test('If I close the first tab that is not open, the one that is already open must remain correctly visible', async () => {
		setupBoardStore('board-2');
		const { user } = setup(<TabsList />);
		const title1 = screen.getByText('title1');
		const title2 = screen.getByText('title2');
		const title3 = screen.getByText('title3');
		expect(title1, 'inactive tab title1 should use the secondary color').toHaveStyleRule(
			'color',
			PALETTE.secondary.regular
		);
		expect(title2, 'open tab title2 should use the active text color').toHaveStyleRule(
			'color',
			PALETTE.text.regular
		);
		expect(title3, 'inactive tab title3 should use the secondary color').toHaveStyleRule(
			'color',
			PALETTE.secondary.regular
		);

		const tab1 = screen.getByTestId(`board-tab-board-1`);
		const board1closeIcon = within(tab1).getByTestId(`icon: ${ICONS.close}`);
		await user.click(board1closeIcon);
		expect(tab1, 'closed tab1 should be removed from the document').not.toBeInTheDocument();
		expect(title1, 'closed tab title1 should be removed from the document').not.toBeInTheDocument();
		expect(title2, 'title2 should remain the active tab after closing tab1').toHaveStyleRule(
			'color',
			PALETTE.text.regular
		);
		expect(title3, 'title3 should remain an inactive tab').toHaveStyleRule(
			'color',
			PALETTE.secondary.regular
		);
		expect(useBoardStore.getState().current, 'board-2 should remain the current board').toBe(
			'board-2'
		);
	});

	test('If I close the last tab that is open (tab on the far right) the tab on its left must be correctly visible', async () => {
		setupBoardStore('board-3');
		const { user } = setup(<TabsList />);
		const title1 = screen.getByText('title1');
		const title2 = screen.getByText('title2');
		const title3 = screen.getByText('title3');
		expect(title1, 'inactive tab title1 should use the secondary color').toHaveStyleRule(
			'color',
			PALETTE.secondary.regular
		);
		expect(title2, 'inactive tab title2 should use the secondary color').toHaveStyleRule(
			'color',
			PALETTE.secondary.regular
		);
		expect(title3, 'open tab title3 should use the active text color').toHaveStyleRule(
			'color',
			PALETTE.text.regular
		);

		const tab3 = screen.getByTestId(`board-tab-board-3`);
		const board3closeIcon = within(tab3).getByTestId(`icon: ${ICONS.close}`);
		await user.click(board3closeIcon);
		expect(tab3, 'closed tab3 should be removed from the document').not.toBeInTheDocument();
		expect(title3, 'closed tab title3 should be removed from the document').not.toBeInTheDocument();
		expect(title1, 'title1 should remain an inactive tab').toHaveStyleRule(
			'color',
			PALETTE.secondary.regular
		);
		expect(title2, 'title2 should become the active tab after closing tab3').toHaveStyleRule(
			'color',
			PALETTE.text.regular
		);
		expect(useBoardStore.getState().current, 'board-2 should become the current board').toBe(
			'board-2'
		);
	});

	test('If I close the last tab that is not open (tab on the far right) the one that is already open must remain correctly visible', async () => {
		setupBoardStore('board-2');
		const { user } = setup(<TabsList />);
		const title1 = screen.getByText('title1');
		const title2 = screen.getByText('title2');
		const title3 = screen.getByText('title3');
		expect(title1, 'inactive tab title1 should use the secondary color').toHaveStyleRule(
			'color',
			PALETTE.secondary.regular
		);
		expect(title2, 'open tab title2 should use the active text color').toHaveStyleRule(
			'color',
			PALETTE.text.regular
		);
		expect(title3, 'inactive tab title3 should use the secondary color').toHaveStyleRule(
			'color',
			PALETTE.secondary.regular
		);

		const tab3 = screen.getByTestId(`board-tab-board-3`);
		const board3closeIcon = within(tab3).getByTestId(`icon: ${ICONS.close}`);
		await user.click(board3closeIcon);
		expect(tab3, 'closed tab3 should be removed from the document').not.toBeInTheDocument();
		expect(title3, 'closed tab title3 should be removed from the document').not.toBeInTheDocument();
		expect(title1, 'title1 should remain an inactive tab').toHaveStyleRule(
			'color',
			PALETTE.secondary.regular
		);
		expect(title2, 'title2 should remain the active tab after closing tab3').toHaveStyleRule(
			'color',
			PALETTE.text.regular
		);
		expect(useBoardStore.getState().current, 'board-2 should remain the current board').toBe(
			'board-2'
		);
	});

	test('If i close a middle tab that is open, the tab on its right must be correctly visible', async () => {
		setupBoardStore('board-2');
		const { user } = setup(<TabsList />);
		const title1 = screen.getByText('title1');
		const title2 = screen.getByText('title2');
		const title3 = screen.getByText('title3');
		expect(title1, 'inactive tab title1 should use the secondary color').toHaveStyleRule(
			'color',
			PALETTE.secondary.regular
		);
		expect(title2, 'open tab title2 should use the active text color').toHaveStyleRule(
			'color',
			PALETTE.text.regular
		);
		expect(title3, 'inactive tab title3 should use the secondary color').toHaveStyleRule(
			'color',
			PALETTE.secondary.regular
		);

		const tab2 = screen.getByTestId(`board-tab-board-2`);
		const board2closeIcon = within(tab2).getByTestId(`icon: ${ICONS.close}`);
		await user.click(board2closeIcon);
		expect(tab2, 'closed tab2 should be removed from the document').not.toBeInTheDocument();
		expect(title2, 'closed tab title2 should be removed from the document').not.toBeInTheDocument();
		expect(title1, 'title1 should remain an inactive tab').toHaveStyleRule(
			'color',
			PALETTE.secondary.regular
		);
		expect(title3, 'title3 should become the active tab after closing tab2').toHaveStyleRule(
			'color',
			PALETTE.text.regular
		);
		expect(useBoardStore.getState().current, 'board-3 should become the current board').toBe(
			'board-3'
		);
	});

	test('If I close a middle tab that is not open, the one that is already open must remain correctly visible', async () => {
		setupBoardStore('board-1');
		const { user } = setup(<TabsList />);
		const title1 = screen.getByText('title1');
		const title2 = screen.getByText('title2');
		const title3 = screen.getByText('title3');
		expect(title1, 'open tab title1 should use the active text color').toHaveStyleRule(
			'color',
			PALETTE.text.regular
		);
		expect(title2, 'inactive tab title2 should use the secondary color').toHaveStyleRule(
			'color',
			PALETTE.secondary.regular
		);
		expect(title3, 'inactive tab title3 should use the secondary color').toHaveStyleRule(
			'color',
			PALETTE.secondary.regular
		);

		const tab2 = screen.getByTestId(`board-tab-board-2`);
		const board2closeIcon = within(tab2).getByTestId(`icon: ${ICONS.close}`);
		await user.click(board2closeIcon);
		expect(tab2, 'closed tab2 should be removed from the document').not.toBeInTheDocument();
		expect(title2, 'closed tab title2 should be removed from the document').not.toBeInTheDocument();
		expect(title1, 'title1 should remain the active tab after closing tab2').toHaveStyleRule(
			'color',
			PALETTE.text.regular
		);
		expect(title3, 'title3 should remain an inactive tab').toHaveStyleRule(
			'color',
			PALETTE.secondary.regular
		);
		expect(useBoardStore.getState().current, 'board-1 should remain the current board').toBe(
			'board-1'
		);
	});
});
