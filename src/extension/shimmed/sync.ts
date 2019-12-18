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

import {
	ISyncFolderParser,
	ISyncItemParser,
	ISyncOperation,
	ISyncOpRequest
} from '../../sync/ISyncService';
import { BehaviorSubject } from 'rxjs';

export declare function registerSyncItemParser(tagName: string, parser: ISyncItemParser<any>): void;

export declare function registerSyncFolderParser(tagName: string, parser: ISyncFolderParser<any>): void;

export declare function syncFolderById(folderId: string): void;

export declare const syncOperations: BehaviorSubject<Array<ISyncOperation<unknown, ISyncOpRequest<unknown>>>>;
