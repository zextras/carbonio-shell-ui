/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
export enum JSNS {
	ACCOUNT = 'urn:zimbraAccount',
	ADMIN = 'urn:zimbraAdmin',
	MAIL = 'urn:zimbraMail',
	ALL = 'urn:zimbra',
	SYNC = 'urn:zimbraSync'
}

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
type SoapFolderAcl = {
	d: string;
	gt: string;
	zid: string;
	perm: string;
};

export type SoapFolder = {
	absFolderPath: string;
	acl?: { grant: SoapFolderAcl };
	activesyncdisabled: boolean;
	deletable: boolean;
	f?: string;
	folder?: Array<SoapFolder>;
	i4ms: number;
	i4next: number;
	id: string;
	l: string;
	link?: Array<SoapLink>;
	luuid: string;
	ms: number;
	n: number;
	name: string;
	rev: number;
	s: number;
	search?: Array<Partial<Folder>>;
	uuid: string;
	view: string;
	webOfflineSyncDays: number;
};

export type SoapLink = SoapFolder & {
	name: string;
	oname: string;
	owner: string;
	perm: string;
	reminder: boolean;
	rest: string;
};
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
		folder?: Array<unknown>;
		tag?: Array<Tag>;
	};
	modified?: {
		m?: Array<unknown>;
		c?: Array<unknown>;
		folder?: Array<unknown>;
		tag?: Array<Partial<Tag>>;
		mbx: [{ s: number }];
	};
	deleted: string[];
};
