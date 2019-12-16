/*
 * *** BEGIN LICENSE BLOCK *****
 * Copyright (C) 2011-2019 ZeXtras
 *
 * The contents of this file are subject to the ZeXtras EULA;
 * you may not use this file except in compliance with the EULA.
 * You may obtain a copy of the EULA at
 * http://www.zextras.com/zextras-eula.html
 * *** END LICENSE BLOCK *****
 */

import { ISoapNotification } from './ISoapNotification';
import { ISoapRequest, ISoapResponse, ISoapResponseContent, JsnsUrn } from './ISoap';
import { IStoredSoapSessionData } from '../idb/IShellIdbSchema';

function getURN(command: string): JsnsUrn {
	switch (command) {
		case 'Batch':
			return 'urn:zimbra';
		case 'Auth':
		case 'EndSession':
		case 'GetInfo':
			return 'urn:zimbraAccount';
		case 'NoOp':
		case 'Sync':
			return 'urn:zimbraMail';
		default:
			throw new Error(`Command ${ command } not recognized`);
	}
}

export function wrapRequest<T>(command: string, data: T, sessionData: IStoredSoapSessionData, urn?: string | JsnsUrn): ISoapRequest<T> {
	const req: ISoapRequest<T> = {
		// _jsns: 'urn:zimbraSoap',
		Header: {
			_jsns: 'urn:zimbra',
			context: {
				session: {},
				notify: {},
				userAgent: {
					name: 'Iris',
					version: PACKAGE_VERSION
				}
			}
		},
		Body: {
			[`${ command }Request`]: {
				...data,
				_jsns: urn as JsnsUrn || getURN(command)
			}
		}
	};
	if (sessionData.notifySeq > -1) {
		req.Header.context.notify.seq = sessionData.notifySeq;
	}
	if (sessionData.id) {
		req.Header.context.session = {
			id: parseInt(sessionData.id, 10),
			_content: parseInt(sessionData.id, 10)
		};
	}
	if (sessionData.username) {
		req.Header.context.account = {
			by: 'name',
			_content: sessionData.username
		};
	}
	return req;
}

export function unwrapResponse<T extends ISoapResponseContent>(command: string, response: ISoapResponse<T>): [ T, Array<ISoapNotification> | undefined ] {
	return [
		response.Body[`${ command }Response`],
		response.Header.context.notify || undefined
	];
}
