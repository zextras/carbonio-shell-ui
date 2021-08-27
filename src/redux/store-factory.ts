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

import { Store, configureStore, createSlice } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import { AppPkgDescription } from '../../types';

const _uselessSlice = createSlice({
	name: '_useless',
	initialState: {},
	reducers: {}
});

export default class StoreFactory {
	private _cache: { [pkgName: string]: Store<any> } = {};

	getStoreForApp(pkg: AppPkgDescription): Store<any> {
		if (this._cache[pkg.package]) return this._cache[pkg.package];
		const store = configureStore({
			devTools:
				FLAVOR === 'NPM'
					? {
							name: pkg.package
					  }
					: false,
			middleware:
				FLAVOR === 'NPM'
					? // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
					  (getDefaultMiddleware) => getDefaultMiddleware().concat(logger)
					: // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
					  (getDefaultMiddleware) => getDefaultMiddleware(),
			reducer: {
				_useless: _uselessSlice.reducer
			}
		});
		this._cache[pkg.package] = store;
		return store;
	}
}
