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

import {
	CaseReducer, createAsyncThunk, createSlice, Draft, PayloadAction
} from '@reduxjs/toolkit';
import { filter, reduce, isEmpty, map } from 'lodash';
import {
	AppPkgDescription,
	AccountLoginData,
	ThemePkgDescription,
	Account
} from '../../types';
import { AuthResponse, GetInfoResponse, ZimletPkgDescription } from '../network/soap/types';
import { zimletToAppPkgDescription, zimletToThemePkgDescription } from '../network/soap/utils';

export type AccountsSlice = {
	status: 'idle' | 'working';
	error?: Error;
	accounts: Account[];
	credentials: { [id: string]: AccountLoginData };
};

type DoLoginArgs = {
	username: string;
	password: string;
};

type ModifyPrefsArgs = Record<string, string>;

type NormalizeAccountParams = {
	username: string;
	password: string;
};

export function selectAccounts({ accounts }: { accounts: AccountsSlice }): Account[] {
	return accounts.accounts;
}

export function selectCSRFToken({ accounts }: { accounts: AccountsSlice }): string | undefined {
	if (accounts.accounts.length > 0) {
		return accounts.credentials[accounts.accounts[0].id].csrfToken;
	}
	return undefined;
}

export function selectAuthToken({ accounts }: { accounts: AccountsSlice }): string | undefined {
	if (accounts.accounts.length > 0) {
		return accounts.credentials[accounts.accounts[0].id].t;
	}
	return undefined;
}

export function selectAuthCredentials({ accounts }: { accounts: AccountsSlice }): AccountLoginData | undefined {
	if (accounts.accounts.length > 0) {
		return accounts.credentials[accounts.accounts[0].id];
	}
	return undefined;
}

function normalizeAccount(
	{ username, password }: NormalizeAccountParams,
	{ csrfToken, authToken }: AuthResponse,
	{
		id, name, zimlets, attrs, prefs, identities, signatures
	}: GetInfoResponse
): [Account, AccountLoginData] {
	const settings = prefs._attrs;
	const apps = reduce<ZimletPkgDescription, AppPkgDescription[]>(
		filter<ZimletPkgDescription>(
			zimlets.zimlet,
			(z) => (z.zimlet[0].zapp === 'true' && typeof z.zimlet[0]['zapp-main'] !== 'undefined')
		),
		(r, z) => ([...r, zimletToAppPkgDescription(z)]),
		[]
	);
	const themes = reduce<ZimletPkgDescription, ThemePkgDescription[]>(
		filter(
			zimlets.zimlet,
			(z) => (z.zimlet[0].zapp === 'true' && typeof z.zimlet[0]['zapp-theme'] !== 'undefined')
		),
		(r, z) => ([...r, zimletToThemePkgDescription(z)]),
		[]
	);
	return [{
		id,
		name,
		displayName: attrs._attrs.displayName,
		apps,
		themes,
		settings,
		identities,
		signatures
	}, {
		t: authToken[0]._content,
		u: username,
		p: password,
		csrfToken: csrfToken._content,
	}];
}

async function getAccountInfo({ csrfToken }: { csrfToken: string }): Promise<GetInfoResponse> {
	const res = await fetch(
		'/service/soap/GetInfoRequest',
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				Header: {
					_jsns: 'urn:zimbra',
					context: {
						csrfToken
					}
				},
				Body: {
					GetInfoRequest: {
						_jsns: 'urn:zimbraAccount'
					}
				}
			})
		}
	);
	const response = await res.json();
	if (response.Body.Fault) throw new Error(response.Body.Fault.Reason.Text);
	return response.Body.GetInfoResponse;
}

export const doLogin = createAsyncThunk<[Account, AccountLoginData], DoLoginArgs>(
	'accounts/doLogin',
	async ({ username, password }, meta) => {
		const res = await fetch(
			'/service/soap/AuthRequest',
			{
				method: 'POST',
				// credentials: 'omit',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					Body: {
						AuthRequest: {
							_jsns: 'urn:zimbraAccount',
							csrfTokenSecured: '1',
							persistAuthTokenCookie: '1',
							// generateDeviceId: '1',
							account: {
								by: 'name',
								_content: username
							},
							password: {
								_content: password
							},
							prefs: [
								{ pref: { name: 'zimbraPrefMailPollingInterval' } },
							]
						}
					}
				})
			}
		);
		const response = await res.json();
		if (response.Body.Fault) {
			throw new Error(response.Body.Fault.Reason.Text);
		}
		const authResp = response.Body.AuthResponse;
		const getInfoResp = await getAccountInfo({ csrfToken: authResp.csrfToken._content });
		return normalizeAccount({ username, password }, authResp, getInfoResp);
	}
);

const doLoginPending: CaseReducer<AccountsSlice> = (state) => {
	state.status = 'working';
	if (!isEmpty(state.accounts)) state.accounts = [];
};

const doLoginFulfilled: CaseReducer<
	AccountsSlice,
	PayloadAction<[Account, AccountLoginData]>
> = (state: Draft<AccountsSlice>, { payload }) => {
	const [account, credentials] = payload;
	state.status = 'idle';
	state.accounts = [account];
	state.credentials[account.id] = credentials;
};

const doLoginRejected: CaseReducer<AccountsSlice> = (state: Draft<AccountsSlice>, { error }) => {
	state.status = 'idle';
	state.error = error.message;
};

export const doLogout = createAsyncThunk<void, void>(
	'accounts/doLogout',
	async (payload, { getState }) => {
		const csrfToken = selectCSRFToken(getState() as any);
		try {
			const res = await fetch(
				'/service/soap/EndSessionRequest',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						Header: {
							_jsns: 'urn:zimbra',
							context: {
								csrfToken
							}
						},
						Body: {
							EndSessionRequest: {
								_jsns: 'urn:zimbraAccount'
							}
						}
					})
				}
			);
			const response = await res.json();
			if (response.Body.Fault) throw new Error(response.Body.Fault.Reason.Text);
		}
		catch (err) {
			if (!/Unexpected end of JSON input/i.test(err.message)) {
				throw err;
			}
		}
	}
);

const doLogoutPending: CaseReducer<AccountsSlice> = (state) => {
	state.status = 'working';
};

const doLogoutFulfilled: CaseReducer<
	AccountsSlice, PayloadAction<void>
> = (state: Draft<AccountsSlice>) => {
	state.status = 'idle';
	state.accounts = [];
	state.credentials = {};
};

export const modifyPrefs = createAsyncThunk<any, ModifyPrefsArgs>(
	'accounts/modifyPrefs',
	async (mods, { getState }) => {
		console.log(mods);
		const csrfToken = selectCSRFToken(getState() as any);
		const res = await fetch(
			'/service/soap/ModifyPrefsRequest',
			{
				method: 'POST',
				// credentials: 'omit',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					Header: {
						_jsns: 'urn:zimbra',
						context: {
							csrfToken
						}
					},
					Body: {
						ModifyPrefsRequest: {
							_jsns: 'urn:zimbraAccount',
							prefs: map(mods, (mod, key) => ([
								{ pref: { name: key, _content: mod } },
							])
							)
						}
					}
				})
			}
		);
		const response = await res.json();
		if (response.Body.Fault) {
			throw new Error(response.Body.Fault.Reason.Text);
		}
		const modPrefResp = response.Body.ModifyPrefsResponse;
		console.log(modPrefResp)
		return 'hehe';
	}
);

const modifyPrefsPending = (...args: any[]): void => {
	console.log(args);
};

const modifyPrefsFulfilled = (...args: any[]): void => {
	console.log(args);
};

const modifyPrefsRejected = (...args: any[]): void => {
	console.log(args);
};

const accountsSlice = createSlice<AccountsSlice, any>({
	name: 'accounts',
	initialState: {
		status: 'idle',
		accounts: [],
		credentials: {},
	},
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(doLogin.pending, doLoginPending);
		builder.addCase(doLogin.fulfilled, doLoginFulfilled);
		builder.addCase(doLogin.rejected, doLoginRejected);
		builder.addCase(modifyPrefs.pending, modifyPrefsPending);
		builder.addCase(modifyPrefs.fulfilled, modifyPrefsFulfilled);
		builder.addCase(modifyPrefs.rejected, modifyPrefsRejected);
		builder.addCase(doLogout.pending, doLogoutPending);
		builder.addCase(doLogout.fulfilled, doLogoutFulfilled);
		builder.addCase(doLogout.rejected, doLoginRejected);
	}
});

export default accountsSlice.reducer;
