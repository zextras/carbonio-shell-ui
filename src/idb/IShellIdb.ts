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

import { IDBPDatabase, IDBPTransaction } from 'idb';
import { IShellIdbSchema } from './IShellIdbSchema';

export const schemaVersion = 1;

function createDb(database: IDBPDatabase<IShellIdbSchema>): void {
	const sessionsStore = database.createObjectStore<'sessions'>('sessions', {
		keyPath: 'id'
	});
	sessionsStore.createIndex('id', 'id');
	const authStore = database.createObjectStore<'auth'>('auth', {
		keyPath: 'id'
	});
	authStore.createIndex('id', 'id');
	const syncStore = database.createObjectStore<'sync'>('sync', {
		keyPath: 'accountId'
	});
	const syncOperationsStore = database.createObjectStore<'sync-operations'>('sync-operations', {
		keyPath: 'id',
		autoIncrement: true
	});
	syncOperationsStore.createIndex('app', 'app.package');
}

export function upgradeFn(database: IDBPDatabase<IShellIdbSchema>, oldVersion: number, newVersion: number | null, transaction: IDBPTransaction<IShellIdbSchema>): void {
	if (oldVersion < 1) {
		createDb(database);
	} else {
		switch (oldVersion) {
			case 1: {
				// Upgrade from version 1
			}
		}
	}
}
