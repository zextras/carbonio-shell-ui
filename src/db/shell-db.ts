/*
 * *** BEGIN LICENSE BLOCK *****
 * Copyright (C) 2011-2020 ZeXtras
 *
 * The contents of this file are subject to the ZeXtras EULA;
 * you may not use this file except in compliance with the EULA.
 * You may obtain a copy of the EULA at
 * http://www.zextras.com/zextras-eula.html
 * *** END LICENSE BLOCK *****
 */


import Account, { IAccount } from './account';
import { Database } from './database';
import Dexie from 'dexie';

export default class ShellDb extends Database {
	public accounts: Dexie.Table<IAccount, string>;

	constructor () {
		super(PACKAGE_NAME);
		this.version(1).stores({
			accounts: '$$_id',
		});
		this.accounts = this.table('accounts');
		this.accounts.mapToClass(Account);
	}

}
