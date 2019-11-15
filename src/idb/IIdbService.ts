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

import { DBSchema, IDBPDatabase, IDBPTransaction } from 'idb';

export interface IIdbService<T extends DBSchema | unknown> {
	setUpgradeFcn(schemaVersion: number, fcn: IUpgradeFcn<T>): void;
	openDb(): Promise<IDBPDatabase<T>>;
}

export type IUpgradeFcn<T extends DBSchema | unknown> = (database: IDBPDatabase<T>, oldVersion: number, newVersion: (number | null), transaction: IDBPTransaction<T>) => void;
