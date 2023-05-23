/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React from 'react';
import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import { reduce, size } from 'lodash';
import 'jest-styled-components';
import { setup } from '../../test/utils';
import { BOARD_DEFAULT_POSITION, BoardContainer } from './board-container';
import { ICONS, TESTID_SELECTORS } from '../../test/constants';
import { Border } from '../hooks/useResize';
import { LOCAL_STORAGE_BOARD_SIZE } from '../../constants';
import ShellPrimaryBar from '../shell-primary-bar';
import {
	buildBoardSizeAndPosition,
	buildMousePosition,
	INITIAL_SIZE_AND_POS,
	setupBoardStore,
	setupBoardSizes
} from '../../test/test-board-utils';
import { SizeAndPosition } from '../../utils/utils';
import { Board } from '../../../types';
import { useBoardStore } from '../../store/boards';
import { mockedApps, setupAppStore } from '../../test/test-app-utils';

beforeEach(() => {
	setupAppStore();
});

describe('Board container', () => {
	describe('Tabs', () => {
		const boards = reduce<unknown, Record<string, Board>>(
			Array<never>(10),
			(accumulator, value, index) => {
				const boardId = `board-${index + 1}`;
				accumulator[boardId] = {
					id: boardId,
					url: '/url',
					app: mockedApps[0].name,
					title: `title${index + 1}`,
					icon: 'CubeOutline'
				};
				return accumulator;
			},
			{}
		);

		test('If a lot of tabs are opened, they are all visible and available in the dropdown', async () => {
			setupBoardStore('board-1', boards);
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
			setupBoardStore('board-1', boards);
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

	describe('Resize a board', () => {
		describe('within the resizable area of the document', () => {
			describe.each([-10, 0, 10])('with offset %d', (offset) => {
				describe.each([25, -25, 0])('moving mouse on x-axis of %d', (deltaX) => {
					describe.each([25, -25, 0])('moving mouse on y-axis of %d', (deltaY) => {
						test.each<{ border: Border; expectedUpdates: Partial<SizeAndPosition> }>([
							{
								border: 'n',
								expectedUpdates: {
									height: -deltaY,
									top: deltaY
								}
							},
							{
								border: 's',
								expectedUpdates: {
									height: deltaY
								}
							},
							{
								border: 'e',
								expectedUpdates: {
									width: deltaX
								}
							},
							{
								border: 'w',
								expectedUpdates: {
									width: -deltaX,
									left: deltaX
								}
							},
							{
								border: 'sw',
								expectedUpdates: {
									height: deltaY,
									width: -deltaX,
									left: deltaX
								}
							},
							{
								border: 'se',
								expectedUpdates: {
									height: deltaY,
									width: deltaX
								}
							},
							{
								border: 'nw',
								expectedUpdates: {
									height: -deltaY,
									top: deltaY,
									width: -deltaX,
									left: deltaX
								}
							},
							{
								border: 'ne',
								expectedUpdates: {
									height: -deltaY,
									top: deltaY,
									width: deltaX
								}
							}
						])(
							'with the border $border, updates the size and position of the board',
							async ({ border, expectedUpdates }) => {
								setupBoardStore();
								setup(<BoardContainer />);
								const boardInitialSizeAndPos = buildBoardSizeAndPosition(
									INITIAL_SIZE_AND_POS,
									offset
								);
								const mouseInitialPos = buildMousePosition(border, boardInitialSizeAndPos);
								const board = screen.getByTestId(TESTID_SELECTORS.board);
								const resizableBorder = screen.getByTestId(
									TESTID_SELECTORS.resizableBorder(border)
								);
								setupBoardSizes(board, boardInitialSizeAndPos);
								fireEvent.mouseDown(resizableBorder);
								fireEvent.mouseMove(document.body, {
									clientX: mouseInitialPos.clientX + deltaX,
									clientY: mouseInitialPos.clientY + deltaY
								});
								fireEvent.mouseUp(document.body);
								const expectedSizeAndPos: SizeAndPosition = {
									width: boardInitialSizeAndPos.width + (expectedUpdates.width ?? 0),
									height: boardInitialSizeAndPos.height + (expectedUpdates.height ?? 0),
									top: boardInitialSizeAndPos.top + (expectedUpdates.top ?? 0),
									left: boardInitialSizeAndPos.left + (expectedUpdates.left ?? 0)
								};
								const localStorageSavedData =
									window.localStorage.getItem(LOCAL_STORAGE_BOARD_SIZE) || '{}';
								await waitFor(() =>
									expect(JSON.parse(localStorageSavedData)).toEqual(expectedSizeAndPos)
								);
								expect(board).toHaveStyle({
									width: `${expectedSizeAndPos.width}px`,
									height: `${expectedSizeAndPos.height}px`,
									top: `${expectedSizeAndPos.top}px`,
									left: `${expectedSizeAndPos.left}px`
								});
							}
						);
					});
				});
			});
		});

		test('outside the resizable area of the document, does not update sizes', async () => {
			setupBoardStore();
			setup(<BoardContainer />);
			const border: Border = 'nw';
			const board = screen.getByTestId(TESTID_SELECTORS.board);
			const boardInitialSizeAndPos = buildBoardSizeAndPosition();
			const mouseInitialPos = buildMousePosition(border, boardInitialSizeAndPos);
			// last accepted resize, should set offsetLeft and offsetTop of the element to 0
			const deltaY = boardInitialSizeAndPos.top * -1;
			const deltaX = boardInitialSizeAndPos.left * -1;
			setupBoardSizes(board, boardInitialSizeAndPos);
			const resizableBorder = screen.getByTestId(TESTID_SELECTORS.resizableBorder(border));
			fireEvent.mouseDown(resizableBorder);
			fireEvent.mouseMove(document.body, {
				clientX: mouseInitialPos.clientX + deltaX,
				clientY: mouseInitialPos.clientY + deltaY
			});
			fireEvent.mouseUp(document.body);
			const boardNewSizeAndPos: SizeAndPosition = {
				height: boardInitialSizeAndPos.height - deltaY,
				width: boardInitialSizeAndPos.width - deltaX,
				top: boardInitialSizeAndPos.top + deltaY,
				left: boardInitialSizeAndPos.left + deltaX
			};
			const mouseNewPos = {
				clientX: mouseInitialPos.clientX + deltaX,
				clientY: mouseInitialPos.clientY + deltaY
			};
			let localStorageSavedData = window.localStorage.getItem(LOCAL_STORAGE_BOARD_SIZE) || '';
			await waitFor(() => expect(JSON.parse(localStorageSavedData)).toEqual(boardNewSizeAndPos));
			expect(board).toHaveStyle({
				height: `${boardNewSizeAndPos.height}px`,
				width: `${boardNewSizeAndPos.width}px`,
				top: `${boardNewSizeAndPos.top}px`,
				left: `${boardNewSizeAndPos.left}px`
			});
			// do another resize moving the mouse outside the area where the resize is accepted
			setupBoardSizes(board, buildBoardSizeAndPosition(boardNewSizeAndPos));
			fireEvent.mouseDown(resizableBorder);
			fireEvent.mouseMove(document.body, {
				clientX: mouseNewPos.clientX - 1,
				clientY: mouseNewPos.clientY - 1
			});
			fireEvent.mouseUp(document.body);
			// board keeps last sizes
			expect(board).toHaveStyle({
				height: `${boardNewSizeAndPos.height}px`,
				width: `${boardNewSizeAndPos.width}px`,
				top: `${boardNewSizeAndPos.top}px`,
				left: `${boardNewSizeAndPos.left}px`
			});
			localStorageSavedData = window.localStorage.getItem(LOCAL_STORAGE_BOARD_SIZE) || '';
			await waitFor(() => expect(JSON.parse(localStorageSavedData)).toEqual(boardNewSizeAndPos));
		});
	});

	test('Enlarge default board set board to fill board area', async () => {
		setupBoardStore();
		const { getByRoleWithIcon, user } = setup(<BoardContainer />);
		const board = screen.getByTestId(TESTID_SELECTORS.board);
		setupBoardSizes(board, buildBoardSizeAndPosition());
		expect(board).toHaveStyleRule('height', '70vh');
		await user.click(getByRoleWithIcon('button', { icon: ICONS.enlargeBoard }));
		expect(board).toHaveStyleRule('height', 'calc(100% - 1.5rem) !important');
		expect(board).toHaveStyleRule('width', 'calc(100% - 3rem) !important');
		expect(board).toHaveStyleRule('top', '1.5rem !important');
		expect(board).toHaveStyleRule('left', '1.5rem !important');
	});

	test('Enlarge resized board set board to fill board area', async () => {
		setupBoardStore();
		const { getByRoleWithIcon, user } = setup(<BoardContainer />);
		const board = screen.getByTestId(TESTID_SELECTORS.board);
		setupBoardSizes(board, buildBoardSizeAndPosition());
		const border: Border = 'n';
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
		await user.click(getByRoleWithIcon('button', { icon: ICONS.enlargeBoard }));
		expect(board).toHaveStyleRule('height', 'calc(100% - 1.5rem) !important');
		expect(board).toHaveStyleRule('width', 'calc(100% - 3rem) !important');
		expect(board).toHaveStyleRule('top', '1.5rem !important');
		expect(board).toHaveStyleRule('left', '1.5rem !important');
	});

	test('Reduce default board set board to default size', async () => {
		setupBoardStore();
		const { getByRoleWithIcon, user } = setup(<BoardContainer />);
		const board = screen.getByTestId(TESTID_SELECTORS.board);
		setupBoardSizes(board, buildBoardSizeAndPosition());
		await user.click(getByRoleWithIcon('button', { icon: ICONS.enlargeBoard }));
		await user.click(getByRoleWithIcon('button', { icon: ICONS.reduceBoard }));
		expect(board).toHaveStyleRule('height', '70vh');
		expect(board).toHaveStyleRule('width', 'auto');
		expect(board).toHaveStyleRule('bottom', '0');
		expect(board).toHaveStyleRule('left', '1.5rem');
	});

	test('Reduce resized board set board to resized size', async () => {
		setupBoardStore();
		const { getByRoleWithIcon, user } = setup(<BoardContainer />);
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
		await user.click(getByRoleWithIcon('button', { icon: ICONS.enlargeBoard }));
		await user.click(getByRoleWithIcon('button', { icon: ICONS.reduceBoard }));
		expect(board).toHaveStyle({
			height: `${boardNewSizeAndPos.height}px`,
			width: `${boardNewSizeAndPos.width}px`,
			top: `${boardNewSizeAndPos.top}px`,
			left: `${boardNewSizeAndPos.left}px`
		});
		expect(board).not.toHaveStyleRule('height', '70vh');
		expect(board).not.toHaveStyleRule('width', 'auto');
	});

	test('Collapse and un-collapse of a resized board set board to resized size', async () => {
		setupBoardStore();
		const { getByRoleWithIcon, user } = setup(
			<>
				<ShellPrimaryBar />
				<BoardContainer />
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
		await user.click(getByRoleWithIcon('button', { icon: ICONS.enlargeBoard }));
		await user.click(getByRoleWithIcon('button', { icon: ICONS.reduceBoard }));
		expect(board).toHaveStyle({
			height: `${boardNewSizeAndPos.height}px`,
			width: `${boardNewSizeAndPos.width}px`,
			top: `${boardNewSizeAndPos.top}px`,
			left: `${boardNewSizeAndPos.left}px`
		});
		expect(board).not.toHaveStyleRule('height', '70vh');
		expect(board).not.toHaveStyleRule('width', 'auto');
	});

	test('Reset size action is disabled if board is at default size', async () => {
		setupBoardStore();
		const { getByRoleWithIcon } = setup(
			<>
				<ShellPrimaryBar />
				<BoardContainer />
			</>
		);
		const board = screen.getByTestId(TESTID_SELECTORS.board);
		const boardInitialSizeAndPos = buildBoardSizeAndPosition();
		setupBoardSizes(board, boardInitialSizeAndPos);
		expect(getByRoleWithIcon('button', { icon: ICONS.resetBoardSize })).toBeDisabled();
	});

	test('Reset size action is enabled if board is not at default size', async () => {
		setupBoardStore();
		const { getByRoleWithIcon } = setup(
			<>
				<ShellPrimaryBar />
				<BoardContainer />
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
		expect(getByRoleWithIcon('button', { icon: ICONS.resetBoardSize })).toBeEnabled();
	});

	test('Reset size action reset board sizes to default', async () => {
		setupBoardStore();
		const { getByRoleWithIcon, user } = setup(
			<>
				<ShellPrimaryBar />
				<BoardContainer />
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
		await user.click(getByRoleWithIcon('button', { icon: ICONS.resetBoardSize }));
		expect(board).toHaveStyle({
			height: '70vh',
			width: 'auto',
			left: BOARD_DEFAULT_POSITION.left,
			bottom: BOARD_DEFAULT_POSITION.bottom
		});
	});
});
