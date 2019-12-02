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

import { IAuthRequest, IAuthResponse, ISoapResponseContent } from '../network/ISoap';

export interface IValidateSessionRequest extends IAuthRequest {
	account: {
		by: 'id';
		_content: string;
	};
	authToken: {
		verifyAccount: '1';
		_content: string;
	};
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IValidateSessionResponse extends IAuthResponse {
}

export interface IEndSessionRequest {
	logoff: '1' | '0';
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IEndSessionResponse extends ISoapResponseContent {
}
