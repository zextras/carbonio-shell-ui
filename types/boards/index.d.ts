/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
export type Board<T = unknown> = {
	id: string;
	url: string;
	app: string;
	icon: string;
	title: string;
	context?: T;
	onClose?: (board: Board<T>) => void;
	onGoToPanel?: (board: Board<T>) => void;
};

export type BoardState = {
	boards: Record<string, Board<any>>;
	expanded: boolean;
	minimized: boolean;
	current?: string;
};

export type BoardHooksContext = {
	closeBoard: () => void;
	updateBoard: (b: Partial<Board>) => void;
	setCurrentBoard: () => void;
	getBoardContext: <T>() => T;
	getBoard: <T>() => Board<T>;
};
