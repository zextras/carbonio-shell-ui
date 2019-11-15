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

import { IIdbExtensionService } from './IIdbExtensionService';
import { IUpgradeFcn } from './IIdbService';
import { IDBPDatabase, openDB } from 'idb';

export class IdbExtensionService implements IIdbExtensionService {

	private _upgradeFcn?: IUpgradeFcn<unknown>;
	private _schemaVersion?: number;

	constructor(
		private _pkName: string
	) {}

	public openDb = (): Promise<IDBPDatabase<unknown>> => {
		return new Promise((resolve, reject) => {
			if (!this._upgradeFcn || !this._schemaVersion) {
				reject(new Error(`DB Schema not initialized for ${this._pkName}`));
				return;
			}
			openDB<unknown>(
				this._pkName,
				this._schemaVersion,
				{
					upgrade: this._upgradeFcn
				}
			)
				.then(resolve)
				.catch(reject);
		});
	};

	public setUpgradeFcn = (schemaVersion: number, fcn: IUpgradeFcn<unknown>): void => {
		this._upgradeFcn = fcn;
		this._schemaVersion = schemaVersion;
	}

}
