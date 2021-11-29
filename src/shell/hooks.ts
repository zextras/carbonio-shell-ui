/*
 * SPDX-FileCopyrightText: 2021 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

/* eslint-disable react-hooks/rules-of-hooks */

import { useCallback, useContext, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { LocationDescriptor } from 'history';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import ShellContext from './shell-context';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { BoardSetterContext, BoardValueContext } from './boards/board-context';
import { SEARCH_APP_ID } from '../constants';

export { useUserAccount, useUserAccounts, useUserSettings } from '../store/account/hooks';
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

export const getUsePushHistoryCallback =
	(appId: string) => (): ((location: LocationDescriptor) => void) => {
		const history = useHistory();
		const loc = useLocation();
		return useCallback(
			(location: LocationDescriptor) => {
				if (loc.pathname.includes(`/${SEARCH_APP_ID}/`)) {
					if (typeof location === 'string') {
						history.push(`/${SEARCH_APP_ID}/${appId}${location}`);
					} else {
						history.push({
							...location,
							pathname: `/${SEARCH_APP_ID}/${appId}${location.pathname}`
						});
					}
				} else if (typeof location === 'string') {
					history.push(`/${appId}${location}`);
				} else {
					history.push({ ...location, pathname: `/${appId}${location.pathname}` });
				}
			},
			[history, loc.pathname]
		);
	};

export function useGoBackHistoryCallback(): () => void {
	const history = useHistory();
	return useCallback(() => history.goBack(), [history]);
}

export const getUseReplaceHistoryCallback =
	(appId: string) => (): ((location: LocationDescriptor) => void) => {
		const history = useHistory();
		const loc = useLocation();
		return useCallback(
			(location: LocationDescriptor) => {
				if (loc.pathname.includes(`/${SEARCH_APP_ID}/`)) {
					if (typeof location === 'string') {
						history.replace(`/${SEARCH_APP_ID}/${appId}${location}`);
					} else {
						history.replace({
							...location,
							pathname: `/${SEARCH_APP_ID}/${appId}${location.pathname}`
						});
					}
				} else if (typeof location === 'string') {
					history.replace(`/${appId}${location}`);
				} else {
					history.replace({ ...location, pathname: `/${appId}${location.pathname}` });
				}
			},
			[history, loc.pathname]
		);
	};

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
