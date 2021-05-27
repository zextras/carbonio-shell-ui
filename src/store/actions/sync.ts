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

import { createAsyncThunk } from '@reduxjs/toolkit';
import { selectCSRFToken } from '../accounts-slice';

export const sync = createAsyncThunk(
	'shell/sync',
	async (arg, { getState }: any) => {
		const { token } = getState().sync;
		const csrfToken = selectCSRFToken(getState() as any);

		console.log('Perform a Sync!');
		const data = {
			Body: {
				SyncRequest: {
					_jsns: 'urn:zimbraMail',
					typed: 1,
					token
				}
			},
			Header: {
				context: {
					csrfToken
				},
				_jsns: 'urn:zimbra'
			}
		};
		const res = await fetch('/service/soap/SyncRequest', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		})
			.then((r) => r.json())
			.then((resp) => {
				if (resp.Body.Fault) {
					throw new Error(resp.Body.Fault.Reason.Text);
				}
				return resp;
			});
		return {
			token: `${res.Body.SyncResponse.token}`,
			sync: res.Body.SyncResponse
		};
	},
	{
		condition: (arg: void, { getState }: any) => !(getState().sync.status === 'syncing')
	}
);
