/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import type { BaseFolder, LinkFolderFields, SearchFolderFields } from '../misc';
import type { Tag } from '../tags';

export interface RawSoapHeader {
	context: RawSoapContext;
}

export interface SoapHeader {
	context: SoapContext;
}

export interface RawSuccessSoapResponse<R> {
	Body: R;
	Header: RawSoapHeader;
}
export interface SuccessSoapResponse<R> {
	Body: Record<string, R>;
	Header: SoapHeader;
}

export interface SoapFault {
	Detail: {
		Error: {
			Code: string;
			Detail: string;
		};
	};
	Reason: {
		Text: string;
	};
}

export type ErrorSoapBodyResponse = {
	Fault: SoapFault;
};

export interface RawErrorSoapResponse {
	Body: ErrorSoapBodyResponse;
	Header: RawSoapHeader;
}

export type ErrorSoapResponse = {
	Body: ErrorSoapBodyResponse;
	Header: SoapHeader;
};

export type RawSoapResponse<R extends Record<string, unknown>> =
	| RawSuccessSoapResponse<R>
	| RawErrorSoapResponse;
export type SoapResponse<R> = SuccessSoapResponse<R> | ErrorSoapResponse;

export interface RawSoapContext {
	refresh?: SoapRefresh;
	notify?: Array<RawSoapNotify>;
	change?: { token: number };
	session?: { id: number; _content: number };
}

export interface SoapContext extends RawSoapContext {
	notify?: Array<SoapNotify>;
}

export type SoapFolder = BaseFolder & {
	folder?: Array<SoapFolder>;
	link?: Array<SoapLink>;
	search?: Array<SoapSearchFolder>;
};

export type SoapSearchFolder = SoapFolder & SearchFolderFields;
export type SoapLink = SoapFolder & LinkFolderFields;
export type SoapRefresh = {
	seq?: number;
	version?: string;
	mbx?: [{ s: number }];
	folder?: SoapFolder[];
	tags?: { tag: Array<Tag> };
};

export type RawSoapNotify = {
	seq: number;
	created?: {
		m?: Array<unknown>;
		c?: Array<unknown>;
		folder?: Array<SoapFolder>;
		link?: Array<SoapLink>;
		tag?: Array<Tag>;
	};
	modified?: {
		m?: Array<unknown>;
		c?: Array<unknown>;
		folder?: Array<Partial<SoapFolder>>;
		link?: Array<Partial<SoapLink>>;
		tag?: Array<Partial<Tag>>;
		mbx: [{ s: number }];
	};
	deleted?: { id?: string };
};
export type SoapNotify = Omit<RawSoapNotify, 'deleted'> & {
	deleted: string[];
};
