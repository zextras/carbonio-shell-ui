/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
export type Board<T = unknown> = {
	id: string;
	boardViewId: string;
	app: string;
	icon: string;
	title: string;
	context?: T;
	onClose?: (board: Board<T>) => void;
	onGoToPanel?: (board: Board<T>) => void;
};
