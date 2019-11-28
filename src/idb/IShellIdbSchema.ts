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

export interface IShellIdbSchema extends DBSchema {
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
}

export interface ISyncData {
	sessionId: string;
	token?: number;
	folders: Array<string>;
}

export interface IStoredSessionData {
	id: string;
	authToken: string;
	username: string;
}

export interface IStoredAccountData {
	id: string;
	u: string;
	p: string;
}

export interface IIDBFolderSchm extends DBSchema {
	folders: {
		key: string;
		value: IFolderSchm;
		indexes: {
			id: string;
			parent: string;
		};
	};
}

export interface IIDBFolderSchmV1 extends IIDBFolderSchm {
	folders: {
		key: string;
		value: IFolderSchmV1;
		indexes: {
			id: string;
			parent: string;
			path: string;
		};
	};
}
