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
export { useAppPkg, useFiberChannel } from '../app/app-context';

export { default as usePromise } from 'react-use-promise';

export {
	useUserAccounts,
	useCSRFToken,
	useSaveSettingsCallback,
	useCurrentSync, // eslint-disable-next-line @typescript-eslint/ban-ts-comment
	useFirstSync // @ts-ignore
} from '../store/shell-store-hooks';

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
