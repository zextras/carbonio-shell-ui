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

import { BehaviorSubject } from 'rxjs';

export interface ISyncService {
	isSyncing: BehaviorSubject<boolean>;
	syncOperations: BehaviorSubject<Array<{
		app: {
			package: string;
			version: string;
		};
		operation: ISyncOperation<unknown, ISyncOpRequest<unknown>>;
	}>>;
}

export interface ISyncItemParser<T extends {}> {
	(mod: Array<T>): Promise<void>;
}

export interface ISyncFolderParser<T extends {}> {
	(folderId: string, mod: Array<T>): Promise<void>;
}

export interface ISyncOperation<T, REQ extends ISyncOpRequest<any>> {
	/** Auto increment, assinged by the system */ id?: number;
	opType: 'soap';
	opData: T;
	request: REQ;
	description: string;
}

export interface ISyncOperationSchm {
	key: string;
	value: {
		id?: string;
		app: {
			package: string;
			version: string;
		};
		operation: ISyncOperation<unknown, ISyncOpRequest<unknown>>;
	};
	indexes: {
		app: string;
	};
}

export interface ISyncOpRequest<T> {
	data: T;
}

export interface ISyncOpSoapRequest<T> extends ISyncOpRequest<T> {
	command: string;
	urn: string;
}

export interface ISyncOpCompletedEv<T> {
	operation: ISyncOperation<unknown, ISyncOpRequest<unknown>>;
	result: T;
}

export interface ISyncOpErrorEv {
	operation: ISyncOperation<unknown, ISyncOpRequest<unknown>>;
	error: Error;
}

export type ISyncOpQueue = Array<{
	app: {
		package: string;
		version: string;
	};
	operation: ISyncOperation<unknown, ISyncOpRequest<unknown>>;
}>;
