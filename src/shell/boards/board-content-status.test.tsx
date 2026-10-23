/*
 * SPDX-FileCopyrightText: 2025 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { act, screen, within } from '@testing-library/react';

import { BoardContainer } from './board-container';
import { notifyBeforeShellExit } from '../../network/before-shell-exit';
import { setBoardContentStatus, useBoardStore } from '../../store/boards';
import { ICONS } from '../../tests/constants';
import { mockedApps, setupAppStore } from '../../tests/test-app-utils';
import { mockedBoardState, setupBoardStore } from '../../tests/test-board-utils';
import { setup } from '../../tests/utils';
import type { Board } from '../../types/boards';

const withDirtyStatus = (...ids: string[]): Record<string, Board> => ({
	...mockedBoardState,
	...Object.fromEntries(
		ids.map((id) => [
			id,
			{ ...mockedBoardState[id], contentStatus: 'dirty' as const, dirtyIcon: 'Edit2Outline' }
		])
	)
});

beforeEach(() => {
	setupAppStore();
});

describe('Board content status', () => {
	test('a dirty board shows the dirty icon and the unsaved changes tooltip', async () => {
		setupBoardStore('board-1', withDirtyStatus('board-2'));
		const { user } = setup(<BoardContainer />);
		const tab = screen.getByTestId('board-tab-board-2');
		expect(within(tab).getByTestId('icon: Edit2Outline')).toBeVisible();
		await user.hover(screen.getByText('title2'));
		expect(await screen.findByText('title2 (unsaved changes)')).toBeVisible();
		expect(
			within(screen.getByTestId('board-tab-board-1')).queryByTestId('icon: Edit2Outline')
		).not.toBeInTheDocument();
	});

	test('the icon is restored when the board is no longer dirty', () => {
		setupBoardStore('board-1', withDirtyStatus('board-2'));
		setup(<BoardContainer />);
		act(() => setBoardContentStatus('board-2', 'pristine'));
		const tab = screen.getByTestId('board-tab-board-2');
		expect(within(tab).queryByTestId('icon: Edit2Outline')).not.toBeInTheDocument();
		expect(within(tab).getByTestId('icon: CubeOutline')).toBeVisible();
	});

	test('the dropdown item of a dirty board shows the unsaved changes string', async () => {
		setupBoardStore('board-1', withDirtyStatus('board-2'));
		const { user, getByRoleWithIcon } = setup(<BoardContainer />);
		await user.click(getByRoleWithIcon('button', { icon: 'ChevronDown' }));
		const list = await screen.findByTestId('dropdown-popper-list');
		expect(within(list).getByText(`From ${mockedApps[0].display} - unsaved changes`)).toBeVisible();
		expect(within(list).getAllByText(`From ${mockedApps[0].display}`)).toHaveLength(2);
	});

	test('a board which is saving is still considered to have pending changes', async () => {
		setupBoardStore('board-1', withDirtyStatus('board-2'));
		const { user } = setup(<BoardContainer />);
		act(() => setBoardContentStatus('board-2', 'saving'));
		expect(
			within(screen.getByTestId('board-tab-board-2')).getByTestId('icon: Edit2Outline')
		).toBeVisible();
		await user.click(within(screen.getByTestId('board-tab-board-2')).getByTestId('icon: Close'));
		expect(await screen.findByText('Close title2?')).toBeVisible();
	});

	test('closing a clean board is immediate', async () => {
		setupBoardStore('board-1', withDirtyStatus('board-2'));
		const { user } = setup(<BoardContainer />);
		await user.click(within(screen.getByTestId('board-tab-board-1')).getByTestId('icon: Close'));
		expect(useBoardStore.getState().boards).not.toHaveProperty('board-1');
	});

	test('closing a dirty tab asks for confirmation, keep editing leaves the board open', async () => {
		setupBoardStore('board-1', withDirtyStatus('board-2'));
		const { user } = setup(<BoardContainer />);
		await user.click(within(screen.getByTestId('board-tab-board-2')).getByTestId('icon: Close'));
		expect(await screen.findByText('Close title2?')).toBeVisible();
		expect(
			screen.getByText('title2 has unsaved changes. If you close it now, the changes will be lost.')
		).toBeVisible();
		await user.click(screen.getByRole('button', { name: /keep editing/i }));
		expect(useBoardStore.getState().orderedBoards).toHaveLength(3);
	});

	test('closing a dirty tab and confirming closes it', async () => {
		setupBoardStore('board-1', withDirtyStatus('board-2'));
		const { user } = setup(<BoardContainer />);
		await user.click(within(screen.getByTestId('board-tab-board-2')).getByTestId('icon: Close'));
		await user.click(await screen.findByRole('button', { name: /close and discard/i }));
		expect(useBoardStore.getState().boards).not.toHaveProperty('board-2');
		expect(useBoardStore.getState().orderedBoards).toHaveLength(2);
	});

	test('closing the container with a dirty board shows the board modal listing the dirty boards, keep editing leaves all boards open', async () => {
		setupBoardStore('board-1', withDirtyStatus('board-2'));
		const { user, getByRoleWithIcon } = setup(<BoardContainer />);
		await user.click(getByRoleWithIcon('button', { icon: ICONS.closeBoard }));
		expect(await screen.findByText('Close the board?')).toBeVisible();
		expect(
			screen.getByText(
				'This item has unsaved changes. If you close the board now, the changes will be lost.'
			)
		).toBeVisible();
		const item = screen.getByTestId('unsaved-item-board-2');
		expect(within(item).getByText('title2')).toBeVisible();
		expect(within(item).getByText(`From ${mockedApps[0].display}`)).toBeVisible();
		expect(screen.queryByTestId('unsaved-item-board-1')).not.toBeInTheDocument();
		await user.click(screen.getByRole('button', { name: /keep editing/i }));
		expect(useBoardStore.getState().orderedBoards).toHaveLength(3);
	});

	test('closing the container with several dirty boards lists all of them and discarding closes all', async () => {
		setupBoardStore('board-1', withDirtyStatus('board-1', 'board-2'));
		const { user, getByRoleWithIcon } = setup(<BoardContainer />);
		await user.click(getByRoleWithIcon('button', { icon: ICONS.closeBoard }));
		expect(await screen.findByText('Close the board?')).toBeVisible();
		expect(
			screen.getByText(
				'These 2 items have unsaved changes. If you close the board now, the changes will be lost.'
			)
		).toBeVisible();
		expect(screen.getByTestId('unsaved-item-board-1')).toBeVisible();
		expect(screen.getByTestId('unsaved-item-board-2')).toBeVisible();
		expect(screen.queryByTestId('unsaved-item-board-3')).not.toBeInTheDocument();
		await user.click(screen.getByRole('button', { name: /close and discard/i }));
		expect(useBoardStore.getState().orderedBoards).toHaveLength(0);
	});

	test('the board modal lists the items in a focusable and scrollable list with an accessible name', async () => {
		setupBoardStore('board-1', withDirtyStatus('board-1', 'board-2'));
		const { user, getByRoleWithIcon } = setup(<BoardContainer />);
		await user.click(getByRoleWithIcon('button', { icon: ICONS.closeBoard }));
		const list = await screen.findByRole('list', { name: 'Items with unsaved changes' });
		expect(list).toHaveAttribute('tabindex', '0');
		expect(list).toHaveStyle({ 'overflow-y': 'auto', 'min-height': '80px' });
		expect(within(list).getAllByRole('listitem')).toHaveLength(2);
		await user.tab();
		await user.tab();
		await user.click(screen.getByRole('button', { name: /keep editing/i }));
		expect(useBoardStore.getState().orderedBoards).toHaveLength(3);
	});

	test('the board modal lists boards which are saving', async () => {
		setupBoardStore('board-1', withDirtyStatus('board-2'));
		const { user, getByRoleWithIcon } = setup(<BoardContainer />);
		act(() => setBoardContentStatus('board-2', 'saving'));
		await user.click(getByRoleWithIcon('button', { icon: ICONS.closeBoard }));
		expect(await screen.findByTestId('unsaved-item-board-2')).toBeVisible();
	});

	test('the initial focus of the confirmation modal is not on the destructive action', async () => {
		setupBoardStore('board-1', withDirtyStatus('board-2'));
		const { user, getByRoleWithIcon } = setup(<BoardContainer />);
		await user.click(getByRoleWithIcon('button', { icon: ICONS.closeBoard }));
		expect(await screen.findByRole('button', { name: 'Close and discard' })).not.toHaveFocus();
	});

	test('the beforeunload handler is registered only while a board is dirty', () => {
		const addSpy = vi.spyOn(window, 'addEventListener');
		const removeSpy = vi.spyOn(window, 'removeEventListener');
		const isBeforeUnload = (call: unknown[]): boolean => call[0] === 'beforeunload';
		setupBoardStore('board-1');
		setup(<BoardContainer />);
		expect(addSpy.mock.calls.filter(isBeforeUnload)).toHaveLength(0);
		act(() => setBoardContentStatus('board-1', 'dirty'));
		expect(addSpy.mock.calls.filter(isBeforeUnload)).toHaveLength(1);
		const event = new Event('beforeunload', { cancelable: true });
		window.dispatchEvent(event);
		expect(event.defaultPrevented).toBe(true);
		act(() => setBoardContentStatus('board-1', 'pristine'));
		expect(removeSpy.mock.calls.filter(isBeforeUnload)).toHaveLength(1);
	});

	test('the beforeunload handler is removed when the shell is about to exit', () => {
		setupBoardStore('board-1');
		setup(<BoardContainer />);
		act(() => setBoardContentStatus('board-1', 'dirty'));
		act(() => notifyBeforeShellExit());
		const event = new Event('beforeunload', { cancelable: true });
		window.dispatchEvent(event);
		expect(event.defaultPrevented).toBe(false);
	});

	test('the saving status keeps the dirty icon and the unsaved changes tooltip', async () => {
		setupBoardStore('board-1', withDirtyStatus('board-2'));
		const { user } = setup(<BoardContainer />);
		act(() => setBoardContentStatus('board-2', 'saving'));
		await user.hover(screen.getByText('title2'));
		expect(await screen.findByText('title2 (unsaved changes)')).toBeVisible();
	});

	test('the saved status restores the icon after saving', () => {
		setupBoardStore('board-1', withDirtyStatus('board-2'));
		setup(<BoardContainer />);
		act(() => setBoardContentStatus('board-2', 'saving'));
		act(() => setBoardContentStatus('board-2', 'saved'));
		expect(
			within(screen.getByTestId('board-tab-board-2')).getByTestId('icon: CubeOutline')
		).toBeVisible();
	});

	test('the beforeunload handler stays registered while saving and is removed once saved', () => {
		const removeSpy = vi.spyOn(window, 'removeEventListener');
		const isBeforeUnload = (call: unknown[]): boolean => call[0] === 'beforeunload';
		setupBoardStore('board-1');
		setup(<BoardContainer />);
		act(() => setBoardContentStatus('board-1', 'dirty'));
		act(() => setBoardContentStatus('board-1', 'saving'));
		expect(removeSpy.mock.calls.filter(isBeforeUnload)).toHaveLength(0);
		const event = new Event('beforeunload', { cancelable: true });
		window.dispatchEvent(event);
		expect(event.defaultPrevented).toBe(true);
		act(() => setBoardContentStatus('board-1', 'saved'));
		expect(removeSpy.mock.calls.filter(isBeforeUnload)).toHaveLength(1);
	});
});
