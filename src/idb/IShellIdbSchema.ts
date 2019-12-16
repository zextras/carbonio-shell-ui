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

import { DBSchema } from 'idb';
import { IFolderSchm, IFolderSchmV1 } from '../sync/IFolderSchm';
import { ISyncOperationSchm } from '../sync/ISyncService';

export type IShellIdbSchema = DBSchema & {
	soapSessions: {
		key: string;
		value: IStoredSoapSessionData;
		indexes: {
			id: string;
			accountId: string;
		};
	};
	sessions: {
		key: string;
		value: IStoredSessionData;
		indexes: {
			id: string;
		};
	};
	sync: {
		key: string;
		value: ISyncData;
		indexes: {
			sessionId: string;
		};
	};
	'sync-operations': ISyncOperationSchm;
	auth: {
		key: string;
		value: IStoredAccountData;
		indexes: {
			id: string;
		};
	};
};

export type ISyncData = {
	sessionId: string;
	token?: number;
	folders: Array<string>;
};

export type IStoredSessionData = {
	id: string;
	authToken: string;
	username: string;
};

export type IStoredAccountData = {
	id: string;
	u: string;
	p: string;
};

export type IIDBFolderSchm = DBSchema & {
	folders: {
		key: string;
		value: IFolderSchm;
		indexes: {
			id: string;
			parent: string;
		};
	};
};

export type IIDBFolderSchmV1 = IIDBFolderSchm & {
	folders: {
		key: string;
		value: IFolderSchmV1;
		indexes: {
			id: string;
			parent: string;
			path: string;
		};
	};
};

export type IStoredSoapSessionData = {
	id: string;
	authToken: string;
	notifySeq: number;
	username?: string;
	accountId?: string;
	zimbraPrefMailPollingInterval?: number;
};
