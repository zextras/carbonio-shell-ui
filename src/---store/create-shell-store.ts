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

import { configureStore, Store, combineReducers } from '@reduxjs/toolkit';
import { Reducer } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import { Persistor } from 'redux-persist/es/types';
import storage from 'redux-persist/lib/storage';
import logger from 'redux-logger';
import accountsReducer, { AccountsSlice } from './accounts-slice';
import sessionReducer from './session-slice';
import syncReducer from './sync-slice';

type ShellState = {
	accounts: AccountsSlice;
};

export type ShellStore = Store<ShellState>;

export default function createShellStore(
	persist: boolean
): { shellStore: ShellStore; shellStorePersistor?: Persistor } {
	const combinedReducer = persist
		? combineReducers({
				accounts: persistReducer(
					{
						key: 'store:com_zextras_zapp_shell',
						storage,
						blacklist: ['session']
					},
					accountsReducer
				),
				session: sessionReducer,
				sync: syncReducer
		  })
		: combineReducers({
				accounts: accountsReducer,
				session: sessionReducer,
				sync: syncReducer
		  });

	const shellStore = configureStore({
		devTools: FLAVOR === 'NPM' ? { name: 'com_zextras_zapp_shell' } : false,
		middleware:
			FLAVOR === 'NPM'
				? // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
				  (getDefaultMiddleware) => getDefaultMiddleware().concat(logger)
				: // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
				  (getDefaultMiddleware) => getDefaultMiddleware(),
		reducer: combinedReducer as Reducer
	});
	let shellStorePersistor;
	if (persist) shellStorePersistor = persistStore(shellStore);
	return {
		shellStore,
		shellStorePersistor
	};
}
