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

import { INotificationParser } from '../../network/INetworkService';
import { ISoapResponseContent, JsnsUrn } from '../../network/ISoap';

export declare function sendSOAPRequest<REQ, RESP extends ISoapResponseContent>(command: string, data: REQ, urn?: string | JsnsUrn): Promise<RESP>;
export declare function registerNotificationParser(tagName: string, parser: INotificationParser<any, any>): void;
