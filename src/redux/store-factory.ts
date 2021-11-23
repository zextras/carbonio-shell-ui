/*
 * SPDX-FileCopyrightText: 2021 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Store, configureStore, createSlice } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import { ZextrasModule } from '../../types';

const _uselessSlice = createSlice({
	name: '_useless',
	initialState: {},
	reducers: {}
});

export default class StoreFactory {
	private _cache: { [pkgName: string]: Store<any> } = {};

	getStoreForApp(pkg: ZextrasModule): Store<any> {
		if (this._cache[pkg.name]) return this._cache[pkg?.name];
		const store = configureStore({
			devTools:
				FLAVOR === 'NPM'
					? {
							name: pkg.name
					  }
					: false,
			middleware:
				FLAVOR === 'NPM'
					? // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
					  (getDefaultMiddleware) => getDefaultMiddleware().concat(logger)
					: // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
					  (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
			reducer: {
				_useless: _uselessSlice.reducer
			}
		});
		this._cache[pkg?.name] = store;
		return store;
	}
}
