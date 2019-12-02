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

import { find, forOwn, filter as loFilter, map } from 'lodash';
import { BehaviorSubject, Subject, zip, combineLatest } from 'rxjs';
import { buffer, filter, first, withLatestFrom } from 'rxjs/operators';
import {
	ISyncItemParser,
	ISyncFolderParser,
	ISyncService,
	ISyncOperation,
	ISyncOpErrorEv,
	ISyncOpCompletedEv, ISyncOpSoapRequest, ISyncOpRequest, ISyncOpQueue
} from './ISyncService';
import { INetworkService } from '../network/INetworkService';
import { ISessionService } from '../session/ISessionService';
import {
	IBatchRequest,
	IBatchResponse,
	ISoapSyncDeletedArray,
	ISoapSyncRequest,
	ISoapSyncResponse
} from '../network/ISoap';
import { IStoredSessionData, ISyncData } from '../idb/IShellIdbSchema';
import { IFiberChannelService } from '../fc/IFiberChannelService';
import { IFCEvent, IFCSink } from '../fc/IFiberChannel';
import { IOfflineService } from '../offline/IOfflineService';
import { IIdbInternalService } from '../idb/IIdbInternalService';

type ParserItemContainer = { id: string; parser: ISyncItemParser<any> };
type ParserFolderContainer = { id: string; parser: ISyncFolderParser<any> };

export class SyncService implements ISyncService {
	public syncOperations = new BehaviorSubject<ISyncOpQueue>([]);

	private _isSyncing = new Subject<boolean>();
	public isSyncing = new BehaviorSubject<boolean>(false);

	private _syncData: Subject<ISyncData> = new Subject<ISyncData>();
	private _folderRequested: Subject<string> = new Subject<string>();
	private _fcSink: IFCSink;
	private _syncItemParsers: { [tag: string]: Array<ParserItemContainer> } = {};
	private _syncFolderParsers: { [tag: string]: Array<ParserFolderContainer> } = {};
	private _parserId = 0;

	constructor(
		private _networkSrvc: INetworkService,
		private _sessionSrvc: ISessionService,
		private _fcSrvc: IFiberChannelService,
		private _idbSrvc: IIdbInternalService,
		offlineSrvc: IOfflineService
	) {
		this._fcSink = _fcSrvc.getInternalFCSink();

		combineLatest([
			this._isSyncing,
			this.syncOperations
		]).subscribe(([ syncing, ops ]) => this.isSyncing.next(syncing || ops.length > 0));

		this._updateOperationQueue().then(() => undefined);

		// Wait for session and all apps loaded to load the Sync Data
		zip(
			_sessionSrvc.session
				.pipe<IStoredSessionData | undefined>(filter((session) => typeof session !== 'undefined'))
				.pipe(first()),
			_fcSrvc.getInternalFC()
				.pipe(filter(({ event }) => event === 'app:all-loaded'))
		)
			.subscribe(([ session, appsLoaded ]) => {
				this._loadSyncData(session!.id)
					.then(() => undefined);
			});
		// Wait for the first Sync Data
		// if has not a token or the synced folders are less than 1 the sync is completed else request for the Sync.
		this._syncData
			.pipe(first())
			.subscribe((syncData) => {
				this._syncAllFolders(syncData)
					.then(() => undefined);
			});
		// Detect when the client return online, with the latest sync data
		offlineSrvc.online
			.pipe<boolean>(filter((o) => o))
			.pipe(withLatestFrom(this._syncData))
			.subscribe(([ online, syncData ]) => {
				this._syncAllFolders(syncData)
					.then(() => undefined);
			});
		// Buffer the ids of the synced folders if the sync data is not yet loaded
		this._folderRequested
			.pipe(buffer(this._syncData))
			.pipe(withLatestFrom(this._syncData))
			.pipe(first())
			.subscribe(([ bufferedIds, syncData ]) => {
				Promise.all(
					map(bufferedIds, (folderId) => this._syncFolderById(folderId, syncData))
				)
					.then(() => undefined);
			});
		// If the sync data is loaded, request the folder sync
		this._folderRequested
			.pipe(withLatestFrom(this._syncData))
			.subscribe(([ folderId, syncData ]) => {
				this._syncFolderById(folderId, syncData)
					.then(() => undefined);
			});

		// Consume the sync operations as the apps are loaded
		_fcSrvc.getInternalFC()
			.pipe(filter(({ event }) => event === 'app:all-loaded'))
			.subscribe(() => {
				console.log('All loaded, consume');
				this._consumeSyncOperations()
					.then(() => undefined);
			});

		// Consume the sync operations when the client goes online
		offlineSrvc.online
			.pipe<boolean>(filter((o) => o))
			.subscribe(() => {
				console.log('online, consume');
				this._consumeSyncOperations()
					.then(() => undefined);
			});

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
	}

	private async _loadSyncData(sessionId: string): Promise<void> {
		const db = await this._idbSrvc.openDb();
		const syncData = await db.get<'sync'>('sync', sessionId);
		if (syncData) {
			this._syncData.next(syncData);
		} else {
			this._syncData.next({
				sessionId: sessionId,
				folders: []
			});
		}
	}

	private async _syncAllFolders(syncData: ISyncData): Promise<void> {
		if (!syncData.token || syncData.folders.length < 1) {
			// Always sync the root folder to get the sync token
			await this._syncRoot(syncData);
			this._fcSink('sync:completed');
			return;
		}
		this._isSyncing.next(true);
		// Delta sync for each synced folders
		const resp = await this._networkSrvc.sendSOAPRequest<ISoapSyncRequest, ISoapSyncResponse<{}, ISoapSyncDeletedArray>>(
			'Sync',
			{
				token: syncData.token
			}
		);
		// In this context, the sync token returned is a string
		const newToken = parseInt(resp.token as unknown as string, 10);
		const newSyncData: ISyncData = {
			...syncData,
			token: newToken
		};
		const db = await this._idbSrvc.openDb();
		await db.put<'sync'>('sync', newSyncData);
		this._syncData.next(newSyncData);
		let promises: Array<Promise<void>> = [];
		if (resp.deleted) {
			map(
				resp.deleted[0].ids.split(','),
				(id) => this._fcSink<string>('notification:item-deleted', id)
			);
		}
		promises = promises.concat(
			map(
				this._syncItemParsers,
				async (v, k): Promise<void> => {
					if (k in resp) {
						await Promise.all(
							map(
								v,
								(p) => p.parser(resp[k])
							)
						);
					}
				}
			)
		);
		await Promise.all(promises);
		this._isSyncing.next(false);
		this._fcSink('sync:completed');
	}

	private async _syncRoot(syncData: ISyncData): Promise<void> {
		this._isSyncing.next(true);
		// First sync for the requested folder, if needed
		const batchResponse = await this._networkSrvc.sendSOAPRequest<IBatchRequest<'SyncRequest', ISoapSyncRequest>,
			IBatchResponse<'SyncResponse', ISoapSyncResponse<Array<{ [k: string]: any }>, void>>>(
			'Batch',
			{
				onerror: 'continue',
				SyncRequest: [ {
					_jsns: 'urn:zimbraMail',
					l: '1',
					calCutOff: Date.now(),
					msgCutOff: Date.now()
				} ]
			}
		);
		const [ response ] = batchResponse.SyncResponse;
		const newSyncData: ISyncData = {
			...syncData,
			token: response.token,
			folders: [ ...syncData.folders, '1' ]
		};
		const db = await this._idbSrvc.openDb();
		await db.put<'sync'>('sync', newSyncData);
		this._syncData.next(newSyncData);
		this._isSyncing.next(false);
	}

	private async _syncFolderById(folderId: string, syncData: ISyncData): Promise<void> {
		this._isSyncing.next(true);
		if (!find(syncData.folders, (i) => i === folderId)) {
			// First sync for the requested folder, if needed
			const batchResponse = await this._networkSrvc.sendSOAPRequest<IBatchRequest<'SyncRequest', ISoapSyncRequest>,
				IBatchResponse<'SyncResponse', ISoapSyncResponse<Array<{ [k: string]: any }>, void>>>(
				'Batch',
				{
					onerror: 'continue',
					SyncRequest: [ {
						_jsns: 'urn:zimbraMail',
						l: folderId
					} ]
				}
			);
			const [ response ] = batchResponse.SyncResponse;
			const newSyncData: ISyncData = {
				...syncData,
				token: response.token,
				folders: [ ...syncData.folders, folderId ]
			};
			const db = await this._idbSrvc.openDb();
			await db.put<'sync'>('sync', newSyncData);
			this._syncData.next(newSyncData);
			let promises: Array<Promise<void>> = [];
			promises = promises.concat(
				map(
					this._syncFolderParsers,
					async (v, k): Promise<void> => {
						if (k in response.folder[0]) {
							await Promise.all(
								map(
									v,
									(p) => p.parser(folderId, response.folder[0][k])
								)
							);
						}
					}
				)
			);
			await Promise.all(promises);
			this._fcSink<string>('sync:completed:folder', folderId);
		}
		this._isSyncing.next(false);
	}

	public syncFolderById(folderId: string): void {
		this._folderRequested.next(folderId);
	}

	public registerSyncItemParser(tagName: string, parser: ISyncItemParser<any>): string {
		const parserId = `${ ++this._parserId }`;
		if (!this._syncItemParsers[tagName]) {
			this._syncItemParsers[tagName] = [];
		}
		this._syncItemParsers[tagName].push({ id: parserId, parser });
		return parserId;
	}

	public registerSyncFolderParser(tagName: string, parser: ISyncFolderParser<any>): string {
		const parserId = `${ ++this._parserId }`;
		if (!this._syncFolderParsers[tagName]) {
			this._syncFolderParsers[tagName] = [];
		}
		this._syncFolderParsers[tagName].push({ id: parserId, parser });
		return parserId;
	}

	public unregisterSyncParserById(id: string): void {
		forOwn(
			this._syncItemParsers,
			(v, k) => this._syncItemParsers[k] = loFilter(v, (o: ParserItemContainer) => o.id !== id)
		);
		forOwn(
			this._syncFolderParsers,
			(v, k) => this._syncFolderParsers[k] = loFilter(v, (o: ParserFolderContainer) => o.id !== id)
		);
	}

	private async _handleIncomingSyncOperation(ev: IFCEvent<ISyncOperation<unknown, ISyncOpRequest<unknown>>>): Promise<void> {
		const db = await this._idbSrvc.openDb();
		await db.put<'sync-operations'>('sync-operations', {
			app: {
				package: ev.from,
				version: ev.version
			},
			operation: ev.data
		});
		await this._updateOperationQueue();
		await this._consumeSyncOperations();
	}

	private async _handleCancelSyncOperation(ev: IFCEvent<string>): Promise<void> {
		const db = await this._idbSrvc.openDb();
		await db.delete<'sync-operations'>('sync-operations', ev.data);
		await this._updateOperationQueue();
	}

	private async _consumeSyncOperations(): Promise<void> {
		const db = await this._idbSrvc.openDb();
		const operationsKeys = await db.getAllKeys('sync-operations');
		await Promise.all(
			map(
				operationsKeys,
				(opKey) => this._tryToConsumeOperation(opKey)
			)
		);
		await this._updateOperationQueue();
	}

	private async _tryToConsumeOperation(opKey: string): Promise<void> {
		const db = await this._idbSrvc.openDb();
		const op = await db.get<'sync-operations'>('sync-operations', opKey);
		if (op) {
			switch (op.operation.opType) {
				case 'soap': {
					try {
						const result = await this._executeSoapOperation(op.operation);
						await db.delete<'sync-operations'>('sync-operations', opKey);
						this._fcSink<ISyncOpCompletedEv<unknown>>({
							event: 'sync:operation:completed',
							to: op.app.package,
							data: {
								operation: op.operation,
								result: result
							}
						});
					} catch (e) {
						this._fcSink<ISyncOpErrorEv>({
							event: 'sync:operation:error',
							to: op.app.package,
							data: {
								operation: op.operation,
								error: e
							}
						});
					}
					break;
				}
				default:
					throw new Error(`Operation type '${ op.operation.opType }' cannot be handled.`);
			}
		}
	}

	private async _executeSoapOperation(op: ISyncOperation<unknown, ISyncOpRequest<unknown>>): Promise<any> {
		const soapReq = op.request as ISyncOpSoapRequest<unknown>;
		return this._networkSrvc.sendSOAPRequest(
			soapReq.command,
			soapReq.data,
			soapReq.urn
		);
	}

	private async _updateOperationQueue(): Promise<void> {
		const db = await this._idbSrvc.openDb();
		let cursor = await db.transaction('sync-operations').store.openCursor();
		const consumedOps: ISyncOpQueue = [];
		while (cursor) {
			consumedOps.push({
				app: {
					...cursor.value.app
				},
				operation: {
					...cursor.value.operation,
					id: cursor.key as unknown as number
				}
			});
			cursor = await cursor.continue();
		}
		this.syncOperations.next(consumedOps);
	}
}
