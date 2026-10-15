/*
 * SPDX-FileCopyrightText: 2025 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import type { Board } from '../../types/boards';

/**
 * A board has pending changes while its content status is 'dirty' or 'saving'.
 * A board without content status is considered 'pristine'.
 */
export const hasPendingChanges = (board: Pick<Board, 'contentStatus'> | undefined): boolean =>
	board?.contentStatus === 'dirty' || board?.contentStatus === 'saving';

/**
 * Return the icon to show for the board: the dirty icon (if provided by the app)
 * while the board has unsaved changes, the standard icon otherwise.
 */
export const getBoardIcon = (board: Pick<Board, 'icon' | 'dirtyIcon' | 'contentStatus'>): string =>
	hasPendingChanges(board) && board.dirtyIcon ? board.dirtyIcon : board.icon;
