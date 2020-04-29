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

import Dexie from 'dexie';
import 'dexie-observable';
import 'dexie-syncable';
import { ISyncProtocol } from 'dexie-syncable/api';
import { Subject } from 'rxjs';

export abstract class Database extends Dexie {

	public registerSyncProtocol(name: string, protocol: ISyncProtocol): void {
		Dexie.Syncable.registerSyncProtocol(name, protocol);
	}

	public observe(comparator: () => Promise<any>): Subject<any> {
		// TODO: Optimize the observable!
		const subject = new Subject();
		comparator().then((r) => subject.next(r));
		this.on('changes', (changes: any) => {
			comparator().then((r) => subject.next(r));
		});
		return subject;
	}

}
