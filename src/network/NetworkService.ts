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

/* eslint-disable @typescript-eslint/no-explicit-any */

import {
	unwrapResponse,
	wrapRequest
} from './Soap';
import {
	ISoapResponse,
	ISoapResponseContent,
	JsnsUrn
} from './ISoap';
import { INetworkService } from './INetworkService';
import { IFCSink } from '../fc/IFiberChannel';
import { IIdbInternalService } from '../idb/IIdbInternalService';

export default class NetworkService implements INetworkService {

	constructor(
		private _fcSink: IFCSink,
		private _idbSrvc: IIdbInternalService
	) {}

	public async sendSOAPRequest<REQ, RESP extends ISoapResponseContent>(command: string, data: REQ, urn?: string | JsnsUrn): Promise<RESP> {
		const [url, req] = wrapRequest(command, data, urn);
		const response = await fetch(
			url,
			{
				method: 'POST',
				body: JSON.stringify(req)
			}
		);
		if (!response.ok) {
			if (response.status === 500) {
				throw new Error('Authentication Error');
			} else {
				throw new Error('HTTP Error');
			}
		} else {
			const resp: ISoapResponse<RESP> = await response.json();
			const [ data, notifications ] = unwrapResponse<RESP>(command, resp);
			return data;
		}
	}

}
