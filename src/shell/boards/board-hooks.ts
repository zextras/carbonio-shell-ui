/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { useContext, useCallback } from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { BoardSetterContext, BoardValueContext } from './board-context';

export const getUseAddBoardCallback =
	(appId: string) => (): ((path: string, context?: unknown | { app: string }) => void) => {
		const { addBoard } = useContext(BoardSetterContext);
		const callback = useCallback(
			(path: string, context?: unknown | { app: string }) => {
				addBoard(`/${(context as { app: string; title: string })?.app ?? appId}${path}`, context);
			},
			[addBoard]
		);
		return callback;
	};

export function useUpdateCurrentBoard(): (url: string, title: string) => void {
	const { updateCurrentBoard } = useContext(BoardSetterContext);
	return updateCurrentBoard;
}

export function useRemoveCurrentBoard(): () => void {
	const { removeCurrentBoard } = useContext(BoardSetterContext);
	return removeCurrentBoard;
}

export function useBoardConfig(): unknown {
	const context: any = useContext(BoardValueContext);
	if (context) {
		return context.boards?.[context.currentBoard]?.context;
	}
	return undefined;
}
