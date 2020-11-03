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

import { AppPkgDescription, SoapFetch, Account } from '../../types';
import { IFiberChannelFactory } from '../fiberchannel/fiber-channel-types';
import { ShellStore } from '../store/create-shell-store';
import { doLogin, doLogout, selectCSRFToken } from '../store/accounts-slice';

export default class ShellNetworkService {
	private _fetch = fetch.bind(window);

	private _csrfToken?: string;

	constructor(
		private _store: ShellStore,
		private _FCFactory: IFiberChannelFactory
	) {
		this._csrfToken = selectCSRFToken(_store.getState());
		_store.subscribe(() => {
			this._csrfToken = selectCSRFToken(_store.getState());
		});
	}

	private _getAppFetch(
		appPackageDescription: AppPkgDescription
	): (input: RequestInfo, init?: RequestInit) => Promise<Response> {
		return (input: RequestInfo, init?: RequestInit): Promise<Response> => this._fetch(
			input,
			init
		);
	}

	public getAppSoapFetch(appPackageDescription: AppPkgDescription): SoapFetch {
		const appSink = this._FCFactory.getAppFiberChannelSink(appPackageDescription);
		console.log(appSink);
		const _fetch = this._getAppFetch(appPackageDescription);
		return (api, body): Promise<any> => {
			const request: { Header?: any; Body: any } = {
				Body: {
					[`${api}Request`]: body
				}
			};
			if (this._csrfToken) {
				request.Header = {
					_jsns: 'urn:zimbra',
					context: {
						csrfToken: this._csrfToken
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
					if (resp.Body.Fault) {
						appSink({ event: 'report-exception', data: { exception: new Error(resp.Body.Fault.Reason.Text) } });
						throw new Error(resp.Body.Fault.Reason.Text);
					}
					return resp.Body[`${api}Response`];
				})
				.catch((err) => {
					appSink({ event: 'report-exception', data: { exception: err } });
				});
		};
	}

	public doLogin(username: string, password: string): Promise<Account> {
		return this._store.dispatch(
			// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
			// @ts-ignore
			doLogin({
				username,
				password
			})
		);
	}

	public doLogout(): Promise<void> {
		return this._store.dispatch(
			// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
			// @ts-ignore
			doLogout()
		);
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
