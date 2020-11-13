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
import fetch from 'node-fetch';

function soapFetch(api, body) {
	const request = {
		Body: {
			[`${ api }Request`]: body,
		},
	};
	// if (this._csrfToken) {
	// 	request.Header = {
	// 		_jsns: 'urn:zimbra',
	// 		context: {
	// 			csrfToken: this._csrfToken
	// 		}
	// 	};
	// }
	return fetch(
		new URL(`/service/soap/${ api }Request`, 'http://localhost'),
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(request),
		},
	)
		.then((r) => r.json())
		.then((resp) => {
			if (resp.Body.Fault) {
				throw new Error(resp.Body.Fault.Reason.Text);
			}
			return resp.Body[`${ api }Response`];
		});
}

export const network = {
	soapFetch,
};

export const fiberChannel = jest.fn();
export const fiberChannelSink = jest.fn();
