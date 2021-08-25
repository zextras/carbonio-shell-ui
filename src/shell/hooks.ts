/* eslint-disable react-hooks/rules-of-hooks */
/*
 * *** BEGIN LICENSE BLOCK *****
 * Copyright (C) 2011-2021 Zextras
 *
 *  The contents of this file are subject to the Zextras EULA;
 * you may not use this file except in compliance with the EULA.
 * You may obtain a copy of the EULA at
 * http://www.zextras.com/zextras-eula.html
 * *** END LICENSE BLOCK *****
 */

import { useCallback, useContext, useEffect, useState } from 'react';
import { skip } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { useHistory } from 'react-router-dom';
import { LocationDescriptor } from 'history';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import ShellContext from './shell-context';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { BoardSetterContext, BoardValueContext } from './boards/board-context';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export { useAppPkg } from '../app/app-context';

export { default as usePromise } from 'react-use-promise';

export { useUserAccount, useUserAccounts, useUserSettings } from '../account/hooks';
export const getUseAddBoardCallback = (appId: string) => (): ((
	path: string,
	context?: unknown | { app: string }
) => void) => {
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

export const getUsePushHistoryCallback = (appId: string) => (): ((
	location: LocationDescriptor
) => void) => {
	const history = useHistory();
	return useCallback(
		(location: LocationDescriptor) => {
			if (typeof location === 'string') {
				history.push(`/${appId}${location}`);
			} else {
				history.push({ ...location, pathname: `/${appId}${location.pathname}` });
			}
		},
		[history]
	);
};

export function useGoBackHistoryCallback(): () => void {
	const history = useHistory();
	return useCallback(() => history.goBack(), [history]);
}

export const getUseReplaceHistoryCallback = (appId: string) => (): ((
	location: LocationDescriptor
) => void) => {
	const history = useHistory();
	return useCallback(
		(location: LocationDescriptor) => {
			if (typeof location === 'string') {
				history.replace(`/${appId}${location}`);
			} else {
				history.replace({ ...location, pathname: `/${appId}${location.pathname}` });
			}
		},
		[history]
	);
};

export function useBehaviorSubject<T>(observable: BehaviorSubject<T>): T {
	const [value, setValue] = useState(observable.getValue());
	useEffect(() => {
		let canSet = true;
		const sub = observable.pipe(skip(1)).subscribe((v) => {
			if (canSet) setValue(v);
		});
		return (): void => {
			canSet = false;
			sub.unsubscribe();
		};
	}, [observable, setValue]);
	return value;
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
