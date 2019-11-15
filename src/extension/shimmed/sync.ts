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

import { ISyncFolderParser, ISyncItemParser } from '../../sync/ISyncService';

export declare function registerSyncItemParser(tagName: string, parser: ISyncItemParser<unknown>): void;
export declare function registerSyncFolderParser(tagName: string, parser: ISyncFolderParser<unknown>): void;
export declare function syncFolderById(folderId: string): Promise<void>;
