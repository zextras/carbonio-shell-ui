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

// eslint-disable-next-line max-classes-per-file
import { AppPkgDescription, SoapFetch } from '../../types';
import { IFiberChannelFactory } from '../fiberchannel/fiber-channel-types';
import { ShellStore } from '../store/create-shell-store';
import { selectCSRFToken } from '../store/accounts-slice';

export class SoapError extends Error {
	details: any;

	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
	constructor(message: string, details: any) {
		super(message);
		this.details = details;
	}
}

export default class ShellNetworkService {
	private _fetch = fetch.bind(window);

	private _csrfToken?: string;

	constructor(private _store: ShellStore, private _FCFactory: IFiberChannelFactory) {
		this._csrfToken = selectCSRFToken(_store.getState());
		_store.subscribe(() => {
			this._csrfToken = selectCSRFToken(_store.getState());
		});
	}

	private _getAppFetch(
		appPackageDescription: AppPkgDescription
	): (input: RequestInfo, init?: RequestInit) => Promise<Response> {
		return (input: RequestInfo, init?: RequestInit): Promise<Response> => this._fetch(input, init);
	}

	public getAppSoapFetch(appPackageDescription: AppPkgDescription): SoapFetch {
		const appSink = this._FCFactory.getAppFiberChannelSink(appPackageDescription);
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
			return _fetch(`/service/soap/${api}Request`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(request)
			})
				.then((r) => r.json())
				.then((resp) => {
					if (resp.Body.Fault) {
						throw new SoapError(resp.Body.Fault.Reason.Text, resp.Body.Fault.Detail.Error);
					}
					return resp.Body[`${api}Response`];
				});
		};
	}
}
