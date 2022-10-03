import { MetaProperty } from '@babel/types';
import { BaseFolder, LinkFolderFields, SearchFolderFields } from '../misc';

/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

export type SoapHeader = {
	context: SoapContext;
};
export type SuccessSoapResponse<R> = {
	Body: Record<string, R>;
	Header: SoapHeader;
};
export type SoapFault = {
	Detail: {
		Error: {
			Code: string;
			Detail: string;
		};
	};
	Reason: {
		Text: string;
	};
};
export type ErrorSoapResponse = {
	Body: {
		Fault: SoapFault;
	};
	Header: SoapHeader;
};

export type SoapResponse<R> = SuccessSoapResponse<R> | ErrorSoapResponse;

export type SoapContext = {
	refresh?: SoapRefresh;
	notify?: Array<SoapNotify>;
	change?: { token: number };
	session?: { id: number; _content: number };
};

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

export type SoapNotify = {
	seq: number;
	created?: {
		m?: Array<unknown>;
		c?: Array<unknown>;
		folder?: Array<SoapFolder>;
		tag?: Array<Tag>;
	};
	modified?: {
		m?: Array<unknown>;
		c?: Array<unknown>;
		folder?: Array<Partial<SoapFolder>>;
		tag?: Array<Partial<Tag>>;
		mbx: [{ s: number }];
	};
	deleted: string[];
};
