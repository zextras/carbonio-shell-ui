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
import { BehaviorSubject, Subject, zip } from 'rxjs';
import { buffer, distinct, filter, first, withLatestFrom } from 'rxjs/operators';
import { ISyncItemParser, ISyncFolderParser, ISyncService } from './ISyncService';
import { INetworkService } from '../network/INetworkService';
import { ISessionService } from '../session/ISessionService';
import {
	IBatchRequest,
	IBatchResponse,
	ISoapSyncDeletedArray,
	ISoapSyncRequest,
	ISoapSyncResponse
} from '../network/ISoap';
import { ISyncData } from '../idb/IShellIdbSchema';
import { IFiberChannelService } from '../fc/IFiberChannelService';
import { IFCSink } from '../fc/IFiberChannel';
import { IOfflineService } from '../offline/IOfflineService';
import { IIdbInternalService } from '../idb/IIdbInternalService';

type ParserItemContainer = { id: string; parser: ISyncItemParser<unknown> };
type ParserFolderContainer = { id: string; parser: ISyncFolderParser<unknown> };

export class SyncService implements ISyncService {
	public isSyncing = new BehaviorSubject<boolean>(false);

	private _syncData: Subject<ISyncData> = new Subject<ISyncData>();
	private _folderRequested: Subject<string> = new Subject<string>();
	private _fcSink: IFCSink;
	private _syncItemParsers: {[tag: string]: Array<ParserItemContainer>} = {};
	private _syncFolderParsers: {[tag: string]: Array<ParserFolderContainer>} = {};
	private _parserId = 0;

	constructor(
		private _networkSrvc: INetworkService,
		private _sessionSrvc: ISessionService,
		private _fcSrvc: IFiberChannelService,
		private _idbSrvc: IIdbInternalService,
		offlineSrvc: IOfflineService
	) {
		this._fcSink = _fcSrvc.getInternalFCSink();
		// Wait for session and all apps loaded to load the Sync Data
		zip(
			_sessionSrvc.session
				.pipe(filter((session) => typeof session !== 'undefined'))
				.pipe(first()),
			_fcSrvc.getInternalFC()
				.pipe(filter(({ event }) => event === 'app:all-loaded'))
		)
			.subscribe(([session, appsLoaded]) => {
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
			.pipe(filter((o) => o))
			.pipe(withLatestFrom(this._syncData))
			.subscribe(([online, syncData]) => {
				this._syncAllFolders(syncData)
					.then(() => undefined);
			});
		// Buffer the ids of the synced folders if the sync data is not yet loaded
		this._folderRequested
			.pipe(buffer(this._syncData))
			.pipe(withLatestFrom(this._syncData))
			.pipe(first())
			.subscribe(([bufferedIds, syncData]) => {
				Promise.all(
					map(bufferedIds, (folderId) => this._syncFolderById(folderId, syncData))
				)
					.then(() => undefined);
			});
		// If the sync data is loaded, request the folder sync
		this._folderRequested
			.pipe(withLatestFrom(this._syncData))
			.subscribe(([folderId, syncData]) => {
				this._syncFolderById(folderId, syncData).then(() => undefined)
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
				folders: [],
			});
		}
	}

	private async _syncAllFolders(syncData: ISyncData): Promise<void> {
		if (!syncData.token || syncData.folders.length < 1) {
			this._fcSink('sync:completed');
			return;
		}
		this.isSyncing.next(true);
		// Delta sync for each synced folders
		const resp = await this._networkSrvc.sendSOAPRequest<ISoapSyncRequest, ISoapSyncResponse<unknown, ISoapSyncDeletedArray>>(
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
				(id) => this._fcSink('notification:item-deleted', id)
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
		this.isSyncing.next(false);
		this._fcSink('sync:completed');
	}

	private async _syncFolderById(folderId: string, syncData: ISyncData): Promise<void> {
		this.isSyncing.next(true);
		if (!find(syncData.folders, (i) => i === folderId)) {
			// First sync for the requested folder, if needed
			const batchResponse = await this._networkSrvc.sendSOAPRequest<IBatchRequest<'SyncRequest', ISoapSyncRequest>, IBatchResponse<'SyncResponse', ISoapSyncResponse<unknown, void>>>(
				'Batch',
				{
					onerror: 'continue',
					SyncRequest: [{
						_jsns: 'urn:zimbraMail',
						l: folderId
					}]
				}
			);
			const [response] = batchResponse.SyncResponse;
			const newSyncData: ISyncData = {
				...syncData,
				token: response.token,
				folders: [...syncData.folders, folderId]
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
									(p) => p.parser(response.folder[0][k])
								)
							);
						}
					}
				)
			);
			await Promise.all(promises);
			this._fcSink('sync:completed:folder', folderId);
		}
		this.isSyncing.next(false);
	}

	public syncFolderById(folderId: string): void {
		this._folderRequested.next(folderId);
	}

	public registerSyncItemParser(tagName: string, parser: ISyncItemParser<unknown>): string {
		const parserId = `${++this._parserId}`;
		if (!this._syncItemParsers[tagName]) {
			this._syncItemParsers[tagName] = [];
		}
		this._syncItemParsers[tagName].push({ id: parserId, parser });
		return parserId;
	}

	public registerSyncFolderParser(tagName: string, parser: ISyncFolderParser<unknown>): string {
		const parserId = `${++this._parserId}`;
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
			(v, k) => this._syncFolderParsers[k] = loFilter(v, (o: ParserItemContainer) => o.id !== id)
		);
	}
}
