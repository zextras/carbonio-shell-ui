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

import { filter, reduce } from 'lodash';
import Account, { ThemePkgDescription } from '../db/account';
import ShellDb from '../db/shell-db';
import { GetInfoResponse, ZimletPkgDescription } from './soap/types';
import { zimletToAppPkgDescription, zimletToThemePkgDescription } from './soap/utils';
import { AppPkgDescription } from '../../types';

export default class ShellNetworkService {
	private _fetch = fetch.bind(window);
	private _account: Account;

	// eslint-disable-next-line no-useless-constructor
	constructor(private _shellDb: ShellDb) {
		_shellDb.observe(() => _shellDb.accounts.toCollection().limit(1).toArray())
			.subscribe((a) => {
				this._account = a;
			});
	}

	private _getAppFetch(appPackageDescription: AppPkgDescription): (input: RequestInfo, init?: RequestInit) => Promise<Response> {
		return (input: RequestInfo, init?: RequestInit) => {
			return this._fetch(
				input,
				init
			);
		};
	}

	public getAppSoapFetch(appPackageDescription: AppPkgDescription): <REQ extends {}, RESP extends {}>(api: string, body: {[apiRequest: string]: REQ}) => Promise<RESP> {
		const _fetch = this._getAppFetch(appPackageDescription);
		return (api, body) => {
			const request: { Header?: any; Body: any } = {
				Body: {
					[`${api}Request`]: body
				}
			};
			if (this._account) {
				request.Header = {
					_jsns: 'urn:zimbra',
					context: {
						csrfToken: this._account.csrfToken
					}
				};
			}
			return _fetch(
				`/service/soap/${api}Request`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(request)
				}
			)
				.then((r) => r.json())
				.then((resp) => {
					if (resp.Body.Fault) throw new Error(resp.Body.Fault.Reason.Text);
					return resp.Body[`${api}Response`];
				});
		};
	}

	private _getAccountInfo(csrfToken: string): Promise<GetInfoResponse> {
		return fetch(
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
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					Body: {
						AuthRequest: {
							_jsns: 'urn:zimbraAccount',
							csrfTokenSecured: '1',
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
		)
			.then((resp) => resp.json())
			.then((response) => {
				if (response.Body.Fault) throw new Error(response.Body.Fault.Reason.Text);
				return response;
			})
			.then((authResp) => authResp.Body.AuthResponse)// eslint-disable-next-line
			.then((authResp) => {
				return this._getAccountInfo(authResp.csrfToken._content)
					.then((getInfoResp) => (new Account(
						getInfoResp.id,
						getInfoResp.name,
						authResp.csrfToken._content,
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
		// TODO: Add the csrf token
		return fetch(
			'/service/soap/EndSessionRequest',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
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
			});
	}

	/*
	public validateSession(sessionData: IStoredSessionData): Promise<IStoredSessionData> {
		return fetch(
			'/service/soap/AuthRequest',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
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
								csrfTokenSecured: '1',
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
