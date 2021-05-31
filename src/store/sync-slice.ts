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

import { CaseReducer, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { sync as syncer } from './actions/sync';

export type SyncSlice = {
	status: 'idle' | 'init' | 'stopped' | 'syncing';
	token: string | undefined;
	intervalId: number;
	firstSync: any;
	syncResponse: any;
};

const performSyncPending: CaseReducer<SyncSlice> = (state) => {
	if (state.status === 'idle' || state.status === 'init') {
		state.status = 'syncing';
	}
};

const performSyncFulfilled: CaseReducer<SyncSlice> = (state, { payload }: any) => {
	const { token } = payload;
	if (!state.token) {
		state.firstSync = payload.sync;
	}
	if (Object.keys(payload?.sync)?.length > 3 || Object.keys(state?.syncResponse)?.length > 3) {
		state.syncResponse = payload.sync;
	}
	state.token = token;
	state.status = state.intervalId > 0 ? 'idle' : 'stopped';
};

const performSyncRejected: CaseReducer<SyncSlice> = () => {
	console.warn('performSyncRejected');
};

const startSyncFulfilled: CaseReducer<SyncSlice> = (state, { payload }: any) => {
	const { status, intervalId } = payload;
	state.status = status;
	state.intervalId = intervalId;
};

export const startSync = createAsyncThunk(
	'sync/start',
	async (arg, { getState, dispatch }: any) => {
		const { status, intervalId } = getState().sync;
		if (status === 'init' || status === 'stopped') {
			await dispatch(syncer());
			const interval = setInterval(
				(_dispatch) => {
					_dispatch(syncer());
				},
				5000,
				dispatch
			);
			return {
				status: 'idle',
				intervalId: interval
			};
		}
		return {
			status,
			intervalId
		};
	}
);

const syncSlice = createSlice<SyncSlice, any>({
	name: 'syncer',
	initialState: {
		status: 'init',
		intervalId: -1,
		firstSync: undefined,
		token: undefined,
		syncResponse: {}
	},
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(syncer.pending, performSyncPending);
		builder.addCase(syncer.fulfilled, performSyncFulfilled);
		builder.addCase(syncer.rejected, performSyncRejected);
		builder.addCase(startSync.fulfilled, startSyncFulfilled);
	}
});

export default syncSlice.reducer;

export function selectSyncResponse({ sync }: { sync: SyncSlice }): any {
	if (sync.syncResponse) {
		return sync.syncResponse;
	}
	return undefined;
}

export function selectFirstSync({ sync }: { sync: SyncSlice }): any {
	if (sync.firstSync) {
		return sync.firstSync;
	}
	return undefined;
}
