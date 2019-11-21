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

export type JsnsUrn = 'urn:zimbra' | 'urn:zimbraAccount' | 'urn:zimbraMail';

export interface ISoapRequestContext {
	change?: {
		token: number;
	};
	account?: {
		by: 'name';
		_content: string;
	};
	session: {
		id?: number;
		_content?: number;
	};
	notify: {
		seq?: number;
	};
	userAgent: {
		name: string;
		version: string;
	};
}

export interface ISoapRequest<T> {
	_jsns: "urn:zimbraSoap";
	Header: {
		_jsns: "urn:zimbra";
		context: ISoapRequestContext;
	};
	Body: {
		[name: string]: T & {
			_jsns: JsnsUrn;
		};
	};
}

export interface ISoapResponse<T extends ISoapResponseContent> {
	Header: {
		context: {
			notify?: Array<ISoapNotification>;
			session: {
				id: string;
				_content: string;
			};
		};
	};
	Body: {
		[name: string]: T;
	};
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ISoapResponseContent {}

export interface IAuthRequest {
	account: {
		by: 'name'|'id';
		_content: string;
	};
	password?: {
		_content: string;
	};
	prefs?: Array<IAuthRequestPref>;
}

interface IAuthRequestPref {
	pref: {
		name: 'zimbraPrefMailPollingInterval';
	};
}

export interface IAuthResponse extends ISoapResponseContent {
	authToken: Array<{ _content: string }>;
}

export interface IGetInfoRequest {
	sections?: string;
}

export interface IGetInfoResponse extends ISoapResponseContent {
	name: string;
	id: string;
	zimlets: {
		zimlet: Array<{
			zimlet: Array<{
				name: string;
				label: string;
				description: string;
				version: string;
				/* Property related to Zextras */ zapp?: "true";
				/* Property related to Zextras */ 'zapp-main'?: string;
				/* Property related to Zextras */ 'zapp-style'?: string;
				/* Property related to Zextras */ 'zapp-theme'?: string;
			}>;
			zimletContext: Array<{
				baseUrl: string;
				presence: "enabled";
				priority: number;
			}>;
		}>;
	};
}

export interface INoOpRequest {
	limitToOneBlocked?: 1;
	wait?: /* Enable for instant notifications */ 1;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface INoOpResponse extends ISoapResponseContent {}

export type IBatchRequest<REQ_NAME extends string, T extends {}> = {
	[key in REQ_NAME]: Array<T>;
} & {
	// _jsns: 'urn:zimbra';
	onerror?: 'continue';
};

export type IBatchResponse<RESP_NAME extends string, T extends {}> = {
	[key in RESP_NAME]: Array<T>;
} & {
	_jsns: 'urn:zimbra';
};

export interface ISoapSyncRequest{
	// _jsns: 'urn:zimbraMail';
	token?: number;
	/** folder root id */ l?: string;
	typed?: 1|0;
	/** milliseconds */ calCutOff?: number;
	/** seconds */ msgCutOff?: number;
	deleteLimit?: number;
	changeLimit?: number;
}

export type ISoapSyncDeletedMap = {
	folder?: { ids: string };
	search?: { ids: string };
	link?: { ids: string };
	tag?: { ids: string };
	c?: { ids: string };
	chat?: { ids: string };
	m?: { ids: string };
	cn?: { ids: string };
	appt?: { ids: string };
	task?: { ids: string };
	notes?: { ids: string };
	w?: { ids: string };
	doc?: { ids: string };
};
export type ISoapSyncDeletedArray = Array<{ ids: string }>;

export type ISoapSyncResponse<T extends {}, DEL extends ISoapSyncDeletedMap | ISoapSyncDeletedArray | void> = {
	md: number;
	token: number;
	s: number;
	deleted?: DEL;
	folder: Array<ISoapSyncFolderObj<T>>;
} & {
	[k: string]: Array<T>;
};

export type IFolderView = 'contact';

export type ISoapSyncFolderObj<T extends {}> = {
	absFolderPath: string;
	acl: {};
	activesyncdisabled: boolean;
	color: number;
	deletable: boolean;
	f: string;
	i4ms: number;
	i4next: number;
	id: string;
	l: string;
	luuid: string;
	md: number;
	mdver: number;
	meta: Array<{}>;
	ms: number;
	n: number;
	name: string;
	retentionPolicy: Array<{}>;
	rev: number;
	s: number;
	u: number;
	url: string;
	uuid: string;
	view: IFolderView;
	webOfflineSyncDays: number;
} & {
	[k: string]: T;
};
