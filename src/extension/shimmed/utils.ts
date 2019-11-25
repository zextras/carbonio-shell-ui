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

import { ISoapFolderObj } from '../../network/ISoap';
import { IFolderSchm } from '../../sync/IFolderSchm';
import { IDBPDatabase } from 'idb';
import { IIDBFolderSchm } from '../../idb/IShellIdbSchema';

export declare function normalizeFolder<T extends IFolderSchm>(version: number, f: ISoapFolderObj): Array<T>;
export declare function createFolderIdb<T extends IIDBFolderSchm>(version: number, db: IDBPDatabase<T>): void;
