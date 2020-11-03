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

import { useContext } from 'react';
import { createDispatchHook, createSelectorHook, createStoreHook } from 'react-redux';
import ShellStoreContext from './shell-store-context';
import { selectAccounts } from './accounts-slice';
import { selectSessionState } from './session-slice';

export function useReduxContext() {
	const contextValue = useContext(ShellStoreContext);

	if (process.env.NODE_ENV !== 'production' && !contextValue) {
		throw new Error(
			'could not find react-redux context value; please ensure the component is wrapped in a <Provider>'
		);
	}

	return contextValue;
}
export const useDispatch = createDispatchHook(ShellStoreContext);
export const useSelector = createSelectorHook(ShellStoreContext);
export const useStore = createStoreHook(ShellStoreContext);

export function useUserAccounts() {
	return useSelector(selectAccounts);
}

export function useSessionState() {
	return useSelector(selectSessionState);
}
