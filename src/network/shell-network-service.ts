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

import Account, { AppPkgDescription, ThemePkgDescription } from '../db/account';
import ShellDb from '../db/shell-db';
import { GetInfoResponse, ZimletPkgDescription } from './soap/types';
import { filter, reduce } from 'lodash';
import { zimletToAppPkgDescription, zimletToThemePkgDescription } from './soap/utils';

export default class ShellNetworkService {

	constructor(private _shellDb: ShellDb) {}

	public getAccountInfo(): Promise<GetInfoResponse> {
		return fetch(
			'/service/soap/GetInfoRequest',
			{
				method: 'POST',
				body: JSON.stringify({
					Body: {
						GetInfoRequest: {
							_jsns: 'urn:zimbraAccount'
						}
					}
				})
			}
		)
			.then((resp) => resp.json())
			.then((response) => {
				if (response.Body.Fault) throw new Error(response.Body.Fault.Reason.Text);
				return response;
			})
			.then((response) => response.Body.GetInfoResponse);
	}

	public doLogin(username: string, password: string): Promise<Account> {
		return fetch(
			'/service/soap/AuthRequest',
			{
				method: 'POST',
				body: JSON.stringify({
					Body: {
						AuthRequest: {
							_jsns: 'urn:zimbraAccount',
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
		)
			.then((resp) => resp.json())
			.then((response) => {
				if (response.Body.Fault) throw new Error(response.Body.Fault.Reason.Text);
				return response;
			})
			.then((authResp) => authResp.Body.AuthResponse)
			.then((authResp) => {
				return this.getAccountInfo()
					.then((getInfoResp) => (new Account(
						getInfoResp.id,
						getInfoResp.name,
						{
							t: authResp.authToken[0]._content,
							u: username,
							p: password
						},
						reduce<ZimletPkgDescription, AppPkgDescription[]>(
							filter<ZimletPkgDescription>(
								getInfoResp.zimlets.zimlet,
								(z) => (z.zimlet[0].zapp === 'true' && typeof z.zimlet[0]['zapp-main'] !== 'undefined')
							),
							(r, z) => ([...r, zimletToAppPkgDescription(z)]),
							[]
						),
						reduce<ZimletPkgDescription, ThemePkgDescription[]>(
							filter(
								getInfoResp.zimlets.zimlet,
								(z) => (z.zimlet[0].zapp === 'true' && typeof z.zimlet[0]['zapp-theme'] !== 'undefined')
							),
							(r, z) => ([...r, zimletToThemePkgDescription(z)]),
							[]
						),
					)));
			});
	}

	public doLogout(): Promise<void> {
		return fetch(
			'/service/soap/EndSessionRequest',
			{
				method: 'POST',
				body: JSON.stringify({
					Body: {
						EndSessionRequest: {
							_jsns: 'urn:zimbraAccount',
							logoff: '1'
						}
					}
				})
			}
		)
			.then((resp) => resp.json())
			.then((response) => {
				if (response.Body.Fault) throw new Error(response.Body.Fault.Reason.Text);
				return response;
			})
	}

	/*
	public validateSession(sessionData: IStoredSessionData): Promise<IStoredSessionData> {
		return fetch(
			'/service/soap/AuthRequest',
			{
				method: 'POST',
				body: JSON.stringify({
					Body: {
						AuthRequest: {
							_jsns: 'urn:zimbraAccount',
							account: {
								by: 'id',
								_content: sessionData.id
							},
							authToken: {
								verifyAccount: '1',
								_content: sessionData.authToken
							},
							prefs: [
								{ pref: { name: 'zimbraPrefMailPollingInterval' } },
							]
						}
					}
				})
			}
		)
			.then((resp) => resp.json())
			.then((response) => {
				if (response.Body.Fault) throw new Error(response.Body.Fault.Reason.Text);
				return sessionData;
			})
	}
 */

}
