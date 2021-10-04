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
import { selectAccounts, selectAuthToken, doLogin, selectAuthCredentials } from './accounts-slice';

type SessionState = 'init' | 'verifying' | 'verified' | 'error';

type SessionSlice = {
	currentAccountId?: string;
	status: SessionState;
	error?: Error;
};

export const verifySession = createAsyncThunk(
	'session/verifySession',
	async (args, { getState, dispatch }) => {
		const [account] = selectAccounts(getState() as any);
		const authToken = selectAuthToken(getState() as any);
		try {
			const res = await fetch('/service/soap/AuthRequest', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					Header: {
						_jsns: 'urn:zimbra'
					},
					Body: {
						AuthRequest: {
							_jsns: 'urn:zimbraAccount',
							persistAuthTokenCookie: '1',
							account: {
								by: 'id',
								_content: account.id
							},
							authToken: {
								verifyAccount: '1',
								_content: authToken
							}
						}
					}
				})
			});
			const response = await res.json();
			if (response.Body.Fault) throw new Error(response.Body.Fault.Reason.Text);
		} catch (e) {
			if (/expired/i.test(e.message)) {
				const credentials = selectAuthCredentials(getState() as any);
				if (credentials) {
					const { u: username, p: password } = credentials;
					dispatch(doLogin({ username, password }));
				}
			}
			return {
				error: e
			};
		}
		return {};
	}
);

const verifySessionPending: CaseReducer<SessionSlice> = (state) => {
	state.status = 'verifying';
};

const verifySessionFulfilled: CaseReducer<SessionSlice> = (state, { payload }) => {
	const { error } = payload;
	if (!error) {
		state.status = 'verified';
	} else {
		state.status = 'error';
		state.error = error.message;
	}
};

const verifySessionRejected: CaseReducer<SessionSlice> = (state, { error }) => {
	state.status = 'error';
	state.error = error.message;
};

const sessionSlice = createSlice<SessionSlice, any>({
	name: 'session',
	initialState: {
		status: 'init'
	},
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(verifySession.pending, verifySessionPending);
		builder.addCase(verifySession.fulfilled, verifySessionFulfilled);
		builder.addCase(verifySession.rejected, verifySessionRejected);
	}
});

export default sessionSlice.reducer;

export function selectSessionState({ session }: { session: SessionSlice }): SessionState {
	return session.status;
}
