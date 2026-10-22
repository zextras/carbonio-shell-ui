/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
/**
 * Persistence status of the content of a board:
 * - dirty: the board has changes which have not been saved yet
 * - saving: the changes are being saved
 * - saved: the changes have just been saved, there are no pending changes
 * - pristine: the board has no pending changes since its creation or its changes have been reverted
 */
export type BoardContentStatus = 'dirty' | 'saving' | 'saved' | 'pristine';

export type Board<T = unknown> = {
	id: string;
	boardViewId: string;
	app: string;
	icon: string;
	/** Icon shown in place of `icon` while the board has pending changes (contentStatus is 'dirty' or 'saving') */
	dirtyIcon?: string;
	/** Content status of the board. Updated by the app responsible for the board. Missing means 'pristine' */
	contentStatus?: BoardContentStatus;
	title: string;
	context?: T;
	onClose?: (board: Board<T>) => void;
	onGoToPanel?: (board: Board<T>) => void;
};
