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

export type ISoapRequestContext = {
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
};

export type ISoapRequest<T> = {
	// _jsns: 'urn:zimbraSoap';
	Header: {
		_jsns: 'urn:zimbra';
		context: ISoapRequestContext;
	};
	Body: {
		[name: string]: T & {
			_jsns: JsnsUrn;
		};
	};
};

export type ISoapResponse<T extends ISoapResponseContent> = {
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
};

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export type ISoapResponseContent = {};

export type IAuthRequest = {
	account: {
		by: 'name' | 'id';
		_content: string;
	};
	password?: {
		_content: string;
	};
	prefs?: Array<
		IAuthRequestPref<'zimbraPrefMailPollingInterval'> // 31536000 means 'disabled'
	>;
	// attrs?: Array<>;
};

type IAuthRequestPref<T> = {
	pref: {
		name: T;
	};
};

type IAuthRequestAttr<T> = {
	attr: {
		name: T;
	};
};

type ZimbraSkinName = 'bare'|'beach'|'bones'|'carbon'|'harmony'
	|'hotrod'|'lake'|'lavender'|'lemongrass'|'oasis'|'pebble'
	|'sand'|'serenity'|'sky'|'smoke'|'steel'|'tree'|'twilight'|'waves';

export type IAuthResponse = ISoapResponseContent & {
	authToken: Array<{ _content: string }>;
	lifetime: number;
	session: {
		id: string;
		_content: string;
	};
	prefs?: {
		_attrs: {
			zimbraPrefMailPollingInterval?: string;
		};
	};
	skin: Array<{
		_content: ZimbraSkinName;
	}>;
};

export type IGetInfoRequest = {
	sections?: string;
}

export type IGetInfoResponse = ISoapResponseContent & {
	name: string;
	id: string;
	zimlets: {
		zimlet: Array<{
			zimlet: Array<{
				name: string;
				label: string;
				description: string;
				version: string;
				/* Property related to Zextras */ zapp?: 'true';
				/* Property related to Zextras */ 'zapp-main'?: string;
				/* Property related to Zextras */ 'zapp-style'?: string;
				/* Property related to Zextras */ 'zapp-theme'?: string;
				/* Property related to Zextras */ 'zapp-serviceworker-extension'?: string;
			}>;
			zimletContext: Array<{
				baseUrl: string;
				presence: 'enabled';
				priority: number;
			}>;
		}>;
	};
};

export type INoOpRequest = {
	limitToOneBlocked?: 1;
	wait?: /* Enable for instant notifications */ 1;
};

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export type INoOpResponse = ISoapResponseContent & {
	waitDisallowed?: boolean;
};

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

export type ISoapSyncRequest = {
	// _jsns: 'urn:zimbraMail';
	token?: number;
	/** folder root id */ l?: string;
	typed?: 1 | 0;
	/** milliseconds */ calCutOff?: number;
	/** seconds */ msgCutOff?: number;
	deleteLimit?: number;
	changeLimit?: number;
};

export type ISoapSyncDeletedMap = Array<{
	ids: string;
	folder?: ISoapSyncDeletedArray;
	search?: ISoapSyncDeletedArray;
	link?: ISoapSyncDeletedArray;
	tag?: ISoapSyncDeletedArray;
	c?: ISoapSyncDeletedArray;
	chat?: ISoapSyncDeletedArray;
	m?: ISoapSyncDeletedArray;
	cn?: ISoapSyncDeletedArray;
	appt?: ISoapSyncDeletedArray;
	task?: ISoapSyncDeletedArray;
	notes?: ISoapSyncDeletedArray;
	w?: ISoapSyncDeletedArray;
	doc?: ISoapSyncDeletedArray;
}>;
export type ISoapSyncDeletedArray = Array<{ ids: string }>;

export type ISoapSyncResponse<DEL extends ISoapSyncDeletedMap | ISoapSyncDeletedArray | void, FOLDER extends ISoapSyncFolderObj> = {
	md: number;
	token: number;
	s: number;
	deleted?: DEL;
	folder: Array<FOLDER>;
};

export type IFolderView =
	'search folder'
	| 'tag'
	| 'conversation'
	| 'message'
	| 'contact'
	| 'document'
	| 'appointment'
	| 'virtual conversation'
	| 'remote folder'
	| 'wiki'
	| 'task'
	| 'chat';

export type ISoapSyncFolderObj = {
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
};

export type ISoapFolderModifiedNotificationObj = {
	absFolderPath: string;
	deletable: boolean;
	id: string;
	/** Present if the name is changed */ name?: string;
	/** Present if the parent is changed */ l?: string;
	/** Present if the parent is changed */ luuid?: string;
	uuid: string;
};

export type ISoapFolderCreatedNotificationObj = ISoapFolderModifiedNotificationObj & {
	// absFolderPath: string;
	activesyncdisabled: boolean;
	// deletable: boolean;
	i4ms: number;
	i4next: number;
	// id: string;
	l: string;
	luuid: string;
	ms: number;
	n: number;
	name: string;
	rev: number;
	s: number;
	uuid: string;
	view: IFolderView;
	webOfflineSyncDays: string;
};

export type ISoapFolderObj = {
	absFolderPath: string;
	activesyncdisabled: boolean;
	deletable: boolean;
	folder?: Array<ISoapFolderObj>;
	i4ms: number;
	i4next: number;
	id: string;
	/** Parent ID */ l: string;
	luuid: string;
	ms: number;
	/** Count of non-folder items */ n: number;
	name: string;
	rev: number;
	/** Size */ s: number;
	/** Count of unread messages */ u?: number;
	uuid: string;
	view: IFolderView;
	webOfflineSyncDays: number;
}

export type IGetFolderReq = {
	depth?: number;
	view?: IFolderView;
	folder: {
		l?: string;
		path?: string;
	};
};

export type IGetFolderRes = ISoapResponseContent & {
	folder: Array<ISoapFolderObj>;
};
