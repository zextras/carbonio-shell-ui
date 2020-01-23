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

import { ISoapResponseContent, JsnsUrn } from './ISoap';

export interface INetworkService {
	sendSOAPRequest<REQ, RESP extends ISoapResponseContent>(command: string, data: REQ, urn?: JsnsUrn | string): Promise<RESP>;
}

export type ISoapSessionData = {
	id?: string;
	username?: string;
	authToken?: string;
	sessionId?: number;
	notifySeq?: number;
}
