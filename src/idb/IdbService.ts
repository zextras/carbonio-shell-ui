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

import { IIdbInternalService } from './IIdbInternalService';
import { IIdbExtensionService } from './IIdbExtensionService';
import { IdbExtensionService } from './IdbExtensionService';
import { IDBPDatabase, IDBPTransaction, openDB } from 'idb';
import { IShellIdbSchema } from './IShellIdbSchema';
import { upgradeFn, schemaVersion } from './IShellIdb';

export default class IdbService implements IIdbInternalService {

	private static _SHELL_IDB_NAME = 'com_zextras_zapp_shell';

	public createIdbService(pkgName: string): IIdbExtensionService<any> {
		return new IdbExtensionService(pkgName);
	}

	public openDb(): Promise<IDBPDatabase<IShellIdbSchema>> {
		return openDB<IShellIdbSchema>(
			IdbService._SHELL_IDB_NAME,
			schemaVersion,
			{
				upgrade: upgradeFn
			}
		);
	}

	/**
	 * @deprecated
	 */
	// eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/no-unused-vars
	public setUpgradeFcn(schemaVersion: number, fcn: (database: IDBPDatabase<IShellIdbSchema>, oldVersion: number, newVersion: (number | null), transaction: IDBPTransaction<IShellIdbSchema>) => void): void {}

}
