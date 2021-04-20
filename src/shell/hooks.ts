/*
 * *** BEGIN LICENSE BLOCK *****
 * Copyright (C) 2011-2020 Zextras
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
import { BoardSetterContext } from './boards/board-context';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import AppContext from '../app/app-context';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export { useAppPkg, useAppContext, useFiberChannel } from '../app/app-context';

export { default as usePromise } from 'react-use-promise';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export { useUserAccounts, useCSRFToken, useSaveSettingsCallback } from '../store/shell-store-hooks';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export { useSharedComponent } from '../shared-ui-components/use-shared-component';

export function useAddBoardCallback(path: string): () => void {
	const { addBoard } = useContext(BoardSetterContext);
	const { pkg } = useContext(AppContext);
	return useCallback(() => {
		addBoard(`/${pkg.package}${path}`);
	}, [addBoard, path, pkg]);
}

export function useUpdateCurrentBoard(): (url: string, title: string) => void {
	const { updateCurrentBoard } = useContext(BoardSetterContext);
	return updateCurrentBoard;
}

export function useRemoveCurrentBoard(): () => void {
	const { removeCurrentBoard } = useContext(BoardSetterContext);
	return removeCurrentBoard;
}

export function usePushHistoryCallback(): (location: LocationDescriptor) => void {
	const { pkg } = useContext(AppContext);
	const history = useHistory();
	return useCallback(
		(location: LocationDescriptor) => {
			if (typeof location === 'string') {
				history.push(`/${pkg.package}${location}`);
			} else {
				history.push({ ...location, pathname: `/${pkg.package}${location.pathname}` });
			}
		},
		[pkg, history]
	);
}

export function useGoBackHistoryCallback(): () => void {
	const history = useHistory();
	return useCallback(() => history.goBack(), [history]);
}

export function useReplaceHistoryCallback(): (location: LocationDescriptor) => void {
	const { pkg } = useContext(AppContext);
	const history = useHistory();
	return useCallback(
		(location: LocationDescriptor) => {
			if (typeof location === 'string') {
				history.replace(`/${pkg.package}${location}`);
			} else {
				history.replace({ ...location, pathname: `/${pkg.package}${location.pathname}` });
			}
		},
		[pkg, history]
	);
}

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
