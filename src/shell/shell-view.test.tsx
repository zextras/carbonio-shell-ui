/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React, { FC } from 'react';
import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import 'jest-styled-components';
import { useHistory } from 'react-router-dom';
import { setup } from '../test/utils';
import ShellView from './shell-view';
import { Board } from '../../types';
import { useAppStore } from '../store/app';
import { useBridge } from '../store/context-bridge';
import { Border } from './hooks/useResize';
import { ICONS, TESTID_SELECTORS } from '../test/constants';
import {
	buildBoardSizeAndPosition,
	buildMousePosition,
	setupBoardSizes,
	setupBoardStore
} from '../test/test-board-utils';
import { LOCAL_STORAGE_BOARD_SIZE } from '../constants';
import { BOARD_DEFAULT_POSITION } from './boards/board-container';
import { SizeAndPosition } from '../utils/utils';

const ContextBridge: FC = () => {
	const history = useHistory();
	useBridge({
		functions: {
			getHistory: () => history
		}
	});
	return null;
};

const Dummy: FC = () => null;

jest.mock('../utility-bar/bar', () => ({
	ShellUtilityBar: Dummy
}));

jest.mock('./shell-header', () => Dummy);

function setupAppStore(): void {
	useAppStore.getState().setters.addApps([
		{
			commit: '',
			description: 'Mails module',
			display: 'Mails',
			icon: 'MailModOutline',
			js_entrypoint: '',
			name: 'carbonio-mails-ui',
			priority: 1,
			type: 'carbonio',
			version: '0.0.1'
		}
	]);
	useAppStore.getState().setters.addRoute({
		id: 'mails',
		route: 'mails',
		position: 1,
		visible: true,
		label: 'Mails',
		primaryBar: 'MailModOutline',
		appView: () => <div></div>,
		badge: { show: false },
		app: 'carbonio-mails-ui'
	});
}

describe('Shell view', () => {
	test('When resizing under mobile breakpoint, board does not disappear', () => {
		setupAppStore();
		const boards: Record<string, Board> = {
			'board-1': { id: 'board-1', url: '/url', app: 'app', title: 'title1', icon: 'CubeOutline' }
		};
		setupBoardStore('board-1', boards);

		setup(
			<>
				<ContextBridge />
				<ShellView />
			</>
		);

		expect(screen.getByText('title1')).toBeVisible();
		act(() => {
			window.resizeTo(500, 300);
		});
		expect(screen.getByText('title1')).toBeVisible();
	});

	test('Collapse board toggler toggle visibility of the board', async () => {
		setupAppStore();
		const boards: Record<string, Board> = {
			'board-1': { id: 'board-1', url: '/url', app: 'app', title: 'title1', icon: 'CubeOutline' }
		};
		setupBoardStore('board-1', boards);

		const { getByRoleWithIcon, user } = setup(
			<>
				<ContextBridge />
				<ShellView />
			</>
		);
		expect(screen.getByText('title1')).toBeVisible();
		await user.click(getByRoleWithIcon('button', { icon: ICONS.collapseBoard }));
		expect(screen.getByText('title1')).toBeInTheDocument();
		expect(screen.queryByText('title1')).not.toBeVisible();
		await user.click(getByRoleWithIcon('button', { icon: ICONS.unCollapseBoard }));
		expect(screen.getByText('title1')).toBeVisible();
	});

	test('Board keeps resized size and position when re-opened after being collapsed', async () => {
		setupAppStore();
		const boards: Record<string, Board> = {
			'board-1': { id: 'board-1', url: '/url', app: 'app', title: 'title1', icon: 'CubeOutline' }
		};
		setupBoardStore('board-1', boards);

		const { getByRoleWithIcon, user } = setup(
			<>
				<ContextBridge />
				<ShellView />
			</>
		);

		const border: Border = 'n';
		const board = screen.getByTestId(TESTID_SELECTORS.board);
		const boardInitialSizeAndPos = buildBoardSizeAndPosition();
		const mouseInitialPos = buildMousePosition(border, boardInitialSizeAndPos);
		const deltaY = -50;
		setupBoardSizes(board, boardInitialSizeAndPos);
		const topBorder = screen.getByTestId(TESTID_SELECTORS.resizableBorder(border));
		fireEvent.mouseDown(topBorder);
		fireEvent.mouseMove(document.body, { clientX: 0, clientY: mouseInitialPos.clientY + deltaY });
		fireEvent.mouseUp(document.body);
		const boardNewSizeAndPos: SizeAndPosition = {
			height: boardInitialSizeAndPos.height - deltaY,
			width: boardInitialSizeAndPos.width,
			top: boardInitialSizeAndPos.top + deltaY,
			left: boardInitialSizeAndPos.left
		};
		const localStorageSavedData = window.localStorage.getItem(LOCAL_STORAGE_BOARD_SIZE) || '';
		await waitFor(() => expect(JSON.parse(localStorageSavedData)).toEqual(boardNewSizeAndPos));
		await user.click(getByRoleWithIcon('button', { icon: ICONS.collapseBoard }));
		await user.click(getByRoleWithIcon('button', { icon: ICONS.unCollapseBoard }));
		expect(board).toHaveStyle({
			height: `${boardInitialSizeAndPos.height - deltaY}px`,
			width: `${boardInitialSizeAndPos.width}px`,
			top: `${boardInitialSizeAndPos.top + deltaY}px`,
			left: `${boardInitialSizeAndPos.left}px`
		});
		expect(board).not.toHaveStyleRule('height', '70vh');
		expect(board).not.toHaveStyleRule('width', 'auto');
	});

	test('Board keeps resized size but reset position when re-opened after being close definitively', async () => {
		setupAppStore();
		const boards: Record<string, Board> = {
			'board-1': { id: 'board-1', url: '/url', app: 'app', title: 'title1', icon: 'CubeOutline' }
		};
		setupBoardStore('board-1', boards);

		const { getAllByRoleWithIcon, user } = setup(
			<>
				<ContextBridge />
				<ShellView />
			</>
		);

		const border: Border = 'n';
		const boardElement = screen.getByTestId(TESTID_SELECTORS.board);
		const boardInitialSizeAndPos = buildBoardSizeAndPosition();
		const mouseInitialPos = buildMousePosition(border, boardInitialSizeAndPos);
		const deltaY = -50;
		setupBoardSizes(boardElement, boardInitialSizeAndPos);
		const topBorder = screen.getByTestId(TESTID_SELECTORS.resizableBorder(border));
		fireEvent.mouseDown(topBorder);
		fireEvent.mouseMove(document.body, { clientX: 0, clientY: mouseInitialPos.clientY + deltaY });
		fireEvent.mouseUp(document.body);
		const boardNewSizeAndPos: SizeAndPosition = {
			height: boardInitialSizeAndPos.height - deltaY,
			width: boardInitialSizeAndPos.width,
			top: boardInitialSizeAndPos.top + deltaY,
			left: boardInitialSizeAndPos.left
		};
		const localStorageSavedData = window.localStorage.getItem(LOCAL_STORAGE_BOARD_SIZE) || '';
		await waitFor(() => expect(JSON.parse(localStorageSavedData)).toEqual(boardNewSizeAndPos));
		await user.click(getAllByRoleWithIcon('button', { icon: ICONS.close })[0]);
		// update state to open a new board
		const boards2: Record<string, Board> = {
			'board-2': { id: 'board-2', url: '/url', app: 'app', title: 'title2', icon: 'CubeOutline' }
		};
		act(() => {
			setupBoardStore('board-2', boards2);
		});
		await screen.findByText('title2');
		const board2Element = screen.getByTestId(TESTID_SELECTORS.board);
		expect(board2Element).toHaveStyle({
			...BOARD_DEFAULT_POSITION,
			height: `${boardInitialSizeAndPos.height - deltaY}px`,
			width: `${boardInitialSizeAndPos.width}px`
		});
		expect(board2Element).not.toHaveStyleRule('height', '70vh');
		expect(board2Element).not.toHaveStyleRule('width', 'auto');
	});
});
