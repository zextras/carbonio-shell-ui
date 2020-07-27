/*
 * *** BEGIN LICENSE BLOCK *****
 * Copyright (C) 2011-2020 ZeXtras
 *
 * The contents of this file are subject to the ZeXtras EULA;
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

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import ShellContext from './shell-context';
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import AppContext from '../app/app-context';

export { useObserveDb } from '../db/useObserveDb';
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
export { useAppPkg, useAppContext, useFiberChannel } from '../app/app-context';
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
export { useTranslation } from '../i18n/hooks';

export function useAddBoardCallback(path: string): () => void {
	const { addBoard } = useContext(ShellContext);
	const { pkg } = useContext(AppContext);
	return useCallback(() => {
		addBoard(`/${pkg.package}${path}`);
	}, [addBoard, path, pkg]);
}

export function usePushHistoryCallback(): (location: LocationDescriptor) => void {
	const { pkg } = useContext(AppContext);
	const history = useHistory();
	return useCallback((location: LocationDescriptor) => {
		if (typeof location === 'string') {
			history.push(`/${pkg.package}${location}`);
		}
		else {
			history.push({...location, pathname: `/${pkg.package}${location.pathname}` });
		}
	}, [pkg, history]);
}

export function useGoBackHistoryCallback(): () => void {
	const history = useHistory();
	return useCallback(
		() => history.goBack(),
		[history]
	);
}

export function useReplaceHistoryCallback(): (location: LocationDescriptor) => void {
	const { pkg } = useContext(AppContext);
	const history = useHistory();
	return useCallback((location: LocationDescriptor) => {
		if (typeof location === 'string') {
			history.replace(`/${pkg.package}${location}`);
		}
		else {
			history.replace({...location, pathname: `/${pkg.package}${location.pathname}` });
		}
	}, [pkg, history]);
}

export function useBehaviorSubject<T>(observable: BehaviorSubject<T>): T {
	const [value, setValue] = useState(observable.getValue());
	useEffect(() => {
		let canSet = true;
		const sub = observable.pipe(skip(1)).subscribe((v) => {
			if (canSet) setValue(v);
		});
		return () => {
			canSet = false;
			sub.unsubscribe();
		}
	}, [observable, setValue]);
	return value;
}
