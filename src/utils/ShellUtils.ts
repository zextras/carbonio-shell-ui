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

import { ISoapFolderObj } from '../network/ISoap';
import { IFolderSchm, IFolderSchmV1 } from '../sync/IFolderSchm';
import { IDBPDatabase } from 'idb';
import { IIDBFolderSchm } from '../idb/IShellIdbSchema';
import { flattenDeep, map } from 'lodash';

export function normalizeFolder<T extends IFolderSchm>(version: number, f: ISoapFolderObj): Array<T> {
	if (version === 1) {
		const parent: IFolderSchmV1 = {
			id: f.id,
			path: f.absFolderPath,
			name: f.name,
			parent: f.l,
			itemsCount: f.n,
			unreadCount: f.u || 0,
			size: f.s
		};
		const folders = [];
		if (f.folder) {
			folders.push(
				map(
					f.folder,
					(c) => normalizeFolder<IFolderSchmV1>(version, c)
				)
			);
		}
		return flattenDeep<any>([ parent, folders ]);
	}
	else return [];
}

export function createFolderIdb<T extends IIDBFolderSchm>(version: number, db: IDBPDatabase<T>): void {
	if (version === 1) {
		const foldersStore = (db as unknown as IDBPDatabase<IFolderSchmV1>).createObjectStore('folders', { keyPath: 'id' });
		foldersStore.createIndex('parent', 'parent', { unique: false });
		foldersStore.createIndex('path', 'path', { unique: true });
	}
}
