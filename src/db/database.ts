/*
 * *** BEGIN LICENSE BLOCK *****
 * Copyright (C) 2011-2020 Zextras
 *
 *  The contents of this file are subject to the Zextras EULA;
 * you may not use this file except in compliance with the EULA.
 * You may obtain a copy of the EULA at
 * http://www.zextras.com/zextras-eula.html
 * *** END LICENSE BLOCK *****
 */

import Dexie from 'dexie';
import observable from 'dexie-observable';
import syncable from 'dexie-syncable';
import { ISyncProtocol } from 'dexie-syncable/api';
import { Subject } from 'rxjs';
import { IDatabase } from '../../types';

export abstract class Database extends Dexie implements IDatabase {
	constructor(dbname: string, options?: any) {
		super(
			dbname,
			{
				...(options || {}),
				addons: [observable, syncable, ...((options && options.addons) ? options.addons : [])]
			}
		);
	}

	// eslint-disable-next-line class-methods-use-this
	public createUUID(): string {
		return observable.createUUID();
	}

	// eslint-disable-next-line class-methods-use-this
	public registerSyncProtocol(name: string, protocol: ISyncProtocol): void {
		syncable.registerSyncProtocol(name, protocol);
	}

	public observe(comparator: () => Promise<any>): Subject<any> {
		// TODO: Optimize the observable!
		const subject = new Subject();
		comparator().then((r) => subject.next(r));
		// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
		// @ts-ignore
		this.on('changes', (changes: any) => {
			comparator().then((r) => subject.next(r));
		});
		return subject;
	}
}
