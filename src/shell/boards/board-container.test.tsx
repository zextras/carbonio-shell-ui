/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React from 'react';
import { screen, within } from '@testing-library/react';
import { size } from 'lodash';
import { setup } from '../../test/utils';
import { useBoardStore } from '../../store/boards';
import { Board } from '../../../types';
import 'jest-styled-components';
import { BoardContainer } from './board-container';
import { useAppStore } from '../../store/app';

describe('Board container', () => {
	const boards: Record<string, Board> = {
		'board-1': { id: 'board-1', url: '/url', app: 'app', title: 'title1', icon: 'CubeOutline' },
		'board-2': { id: 'board-2', url: '/url', app: 'app', title: 'title2', icon: 'CubeOutline' },
		'board-3': { id: 'board-3', url: '/url', app: 'app', title: 'title3', icon: 'CubeOutline' },
		'board-4': { id: 'board-4', url: '/url', app: 'app', title: 'title4', icon: 'CubeOutline' },
		'board-5': { id: 'board-5', url: '/url', app: 'app', title: 'title5', icon: 'CubeOutline' },
		'board-6': { id: 'board-6', url: '/url', app: 'app', title: 'title6', icon: 'CubeOutline' },
		'board-7': { id: 'board-7', url: '/url', app: 'app', title: 'title7', icon: 'CubeOutline' },
		'board-8': { id: 'board-8', url: '/url', app: 'app', title: 'title8', icon: 'CubeOutline' },
		'board-9': { id: 'board-9', url: '/url', app: 'app', title: 'title9', icon: 'CubeOutline' },
		'board-10': { id: 'board-10', url: '/url', app: 'app', title: 'title10', icon: 'CubeOutline' }
	};

	function setupState(current: string, boardState?: Record<string, Board>): void {
		useBoardStore.setState(() => ({
			boards: boardState || boards,
			orderedBoards: [
				'board-1',
				'board-2',
				'board-3',
				'board-4',
				'board-5',
				'board-6',
				'board-7',
				'board-8',
				'board-9',
				'board-10'
			],
			current
		}));

		useAppStore.getState().setters.addApps([
			{
				commit: '',
				description: 'Mails module',
				display: 'Mails',
				icon: 'MailModOutline',
				js_entrypoint: '',
				name: 'app',
				priority: 1,
				type: 'carbonio',
				version: '0.0.1'
			}
		]);
	}

	test('If a lot of tabs are opened, they are all visible and available in the dropdown', async () => {
		setupState('board-1');
		const { getByRoleWithIcon, user } = setup(<BoardContainer />);
		const title1 = screen.getByText('title1');
		expect(title1).toBeVisible();
		const title2 = screen.getByText('title2');
		expect(title2).toBeVisible();
		const title3 = screen.getByText('title3');
		expect(title3).toBeVisible();
		const title4 = screen.getByText('title4');
		expect(title4).toBeVisible();
		const title5 = screen.getByText('title5');
		expect(title5).toBeVisible();
		const title6 = screen.getByText('title6');
		expect(title6).toBeVisible();
		const title7 = screen.getByText('title7');
		expect(title7).toBeVisible();
		const title8 = screen.getByText('title8');
		expect(title8).toBeVisible();
		const title9 = screen.getByText('title9');
		expect(title9).toBeVisible();
		const title10 = screen.getByText('title10');
		expect(title10).toBeVisible();

		const chevronDownIcon = getByRoleWithIcon('button', { icon: 'ChevronDown' });
		expect(chevronDownIcon).toBeVisible();

		await user.click(chevronDownIcon);

		expect(screen.getAllByText('From Mails')).toHaveLength(10);
	});

	test('If close a tab from the dropdown, it will be removed', async () => {
		setupState('board-1');
		const { getByRoleWithIcon, user } = setup(<BoardContainer />);

		const chevronDownIcon = getByRoleWithIcon('button', { icon: 'ChevronDown' });

		await user.click(chevronDownIcon);

		expect(screen.getAllByText('From Mails')).toHaveLength(10);

		const firstCloseIcon = within(screen.getByTestId('dropdown-popper-list')).getAllByTestId(
			'icon: CloseOutline'
		)[0];
		await user.click(firstCloseIcon);
		expect(screen.getAllByText('From Mails')).toHaveLength(9);
		expect(useBoardStore.getState().orderedBoards).toHaveLength(9);
		expect(size(useBoardStore.getState().boards)).toBe(9);
	});
});
