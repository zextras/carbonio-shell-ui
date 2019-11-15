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

import { DBSchema, IDBPDatabase } from 'idb';
import { IUpgradeFcn } from '../../idb/IIdbService';

export declare function setUpgradeFcn<T extends DBSchema | unknown>(schemaVersion: number, fcn: IUpgradeFcn<T>): void;
export declare function openDb<T extends DBSchema | unknown>(): Promise<IDBPDatabase<T>>;
