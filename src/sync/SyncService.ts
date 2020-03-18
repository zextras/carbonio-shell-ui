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

import { BehaviorSubject, Subject } from 'rxjs';
import {
	ISyncService,
	ISyncOperation,
	ISyncOpRequest,
	ISyncOpQueue
} from './ISyncService';
import { IFiberChannelService } from '../fc/IFiberChannelService';
import { IFCEvent, IFCSink } from '../fc/IFiberChannel';
import { IIdbInternalService } from '../idb/IIdbInternalService';
import { filter } from 'rxjs/operators';
import { IDBPCursorWithValue } from 'idb/build/esm/entry';
import { IShellIdbSchema } from '../idb/IShellIdbSchema';

export class SyncService implements ISyncService {
	public syncOperations = new BehaviorSubject<ISyncOpQueue>([]);

	private _isSyncing = new Subject<boolean>();
	public isSyncing = new BehaviorSubject<boolean>(false);

	private _fcSink: IFCSink;

	constructor(
		private _fcSrvc: IFiberChannelService,
		private _idbSrvc: IIdbInternalService,
	) {
		this._fcSink = _fcSrvc.getInternalFCSink();
		// Handle the sync operation once arrive
		_fcSrvc.getInternalFC()
			.pipe<IFCEvent<ISyncOperation<unknown, ISyncOpRequest<unknown>>>>(filter(({ event }) => event === 'sync:operation:push'))
			.subscribe((ev) => {
				this._handleIncomingSyncOperation(ev)
					.then(() => undefined);
			});

		_fcSrvc.getInternalFC()
			.pipe<IFCEvent<string>>(filter(({ event }) => event === 'sync:operation:cancel'))
			.subscribe((ev) => {
				this._handleCancelSyncOperation(ev)
					.then(() => undefined);
			});

		_fcSrvc.getInternalFC()
			.pipe<IFCEvent<string>>(filter(({ event }) => event === 'sync:operation:completed' || event === 'sync:operation:error'))
			.subscribe((ev) => {
				this._updateOperationQueue()
					.then(() => undefined);
			});
	}

	private _handleIncomingSyncOperation(ev: IFCEvent<ISyncOperation<unknown, ISyncOpRequest<unknown>>>): Promise<void> {
		return this._idbSrvc.openDb()
			.then((db) =>
				db.put<'sync-operations'>('sync-operations', {
					app: {
						package: ev.from,
						version: ev.version
					},
					operation: ev.data
				})
			)
			.then(() => this._updateOperationQueue())
			.then(() => {
				this._fcSrvc.getInternalFCSink()('sync:consume-operation-queue');
			});
	}

	private _handleCancelSyncOperation(ev: IFCEvent<string>): Promise<void> {
		return this._idbSrvc.openDb()
			.then((db) => db.delete<'sync-operations'>('sync-operations', ev.data))
			.then(() => this._updateOperationQueue());
	}

	private _updateOperationQueue(): Promise<void> {
		return this._idbSrvc.openDb()
			.then((db) => db.transaction('sync-operations').store.openCursor())
			.then((cursor) => this._getAllOperations(cursor))
			.then((operations) => this.syncOperations.next(operations));
	}

	private _getAllOperations(cursor: IDBPCursorWithValue<IShellIdbSchema, ['sync-operations'], 'sync-operations'>|null): Promise<ISyncOpQueue> {
		if (!cursor) {
			return Promise.resolve([]);
		}
		return cursor.continue()
			.then((c) => this._getAllOperations(c))
			.then((ops: ISyncOpQueue) => [
				{
					app: {
						...cursor.value.app
					},
					operation: {
						...cursor.value.operation,
						id: cursor.key as unknown as number
					}
				},
				...ops
			]);
	}
}
