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

export function wrapRequest<T>(command: string, data: T, urn?: string | JsnsUrn): [string, ISoapRequest<T>] {
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
	return [`/service/soap/${command}Request`, req];
}

export function unwrapResponse<T extends ISoapResponseContent>(command: string, response: ISoapResponse<T>): [ T, Array<ISoapNotification> | undefined ] {
	return [
		response.Body[`${ command }Response`],
		response.Header.context.notify || undefined
	];
}
