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

	syncFolderById(folderId: string): void;
	registerSyncItemParser(tagName: string, parser: ISyncItemParser<any>): string;
	registerSyncFolderParser(tagName: string, parser: ISyncFolderParser<any>): string;
	unregisterSyncParserById(id: string): void;
}

export interface ISyncItemParser<T extends {}> {
	(mod: Array<T>): Promise<void>;
}

export interface ISyncFolderParser<T extends {}> {
	(mod: Array<T>): Promise<void>;
}
