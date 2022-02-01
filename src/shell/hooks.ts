/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

/* eslint-disable react-hooks/rules-of-hooks */

import { useCallback, useContext, useState } from 'react';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import ShellContext from './shell-context';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { BoardSetterContext, BoardValueContext } from './boards/board-context';

export { useUserAccount, useUserAccounts, useUserSettings } from '../store/account';
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

export function useIsMobile(): boolean {
	const { isMobile } = useContext(ShellContext);
	return isMobile;
}

export function useLocalStorage<T>(key: string, initialValue: T): any {
	const [storedValue, setStoredValue] = useState<T>(() => {
		try {
			const item = window.localStorage.getItem(key);
			return item ? JSON.parse(item) : initialValue;
		} catch (error) {
			console.error(error);
			return initialValue;
		}
	});
	const setValue = (value: T | ((val: T) => T)): any => {
		try {
			const valueToStore = value instanceof Function ? value(storedValue) : value;
			setStoredValue(valueToStore);
			localStorage.setItem(key, JSON.stringify(valueToStore));
		} catch (error) {
			console.error(error);
		}
	};
	return [storedValue, setValue] as const;
}
