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
/* eslint-env serviceworker */
/* eslint-disable @typescript-eslint/camelcase */

import { omit, map } from 'lodash';
import { IIdbInternalService } from '../idb/IIdbInternalService';
import { IFiberChannelService } from '../fc/IFiberChannelService';
import { ISyncOperation, ISyncOpRequest, ISyncOpSoapRequest } from '../sync/ISyncService';

function _executeSoapOperation(op: ISyncOperation<any, ISyncOpSoapRequest<any>>): Promise<void> {
	return fetch(
			`/service/soap/${op.request.command}Request`,
			{
				method: 'POST',
				body: JSON.stringify({
					Body: {
						[`${op.request.command}Request`]: {
							...op.request.data,
							_jsns: op.request.urn
						}
					}
				})
			}
		)
			.then(response => response.json());
}

function _tryToConsumeOperation(
	opKey: string,
	idbSrvc: IIdbInternalService,
	ifcSrvc: IFiberChannelService
): Promise<void> {
	return new Promise(((resolve, reject) => {
		idbSrvc.openDb()
			.then((db) => db.get<'sync-operations'>('sync-operations', opKey))
			.then((op) => {
				if (op) {
					switch (op.operation.opType) {
						case 'soap': {
							_executeSoapOperation(op.operation as ISyncOperation<any, ISyncOpSoapRequest<any>>)
								.then((result) => {
									return idbSrvc.openDb()
										.then((db) => db.delete('sync-operations', opKey))
										.then(() => ifcSrvc.getFiberChannelSinkForExtension(op.app.package, op.app.version)(
											'sync:operation:completed',
											{
												operation: op.operation,
												result: result
											}));
								})
								.then(() => resolve())
								.catch((e) => {
									ifcSrvc.getFiberChannelSinkForExtension(op.app.package, op.app.version)(
										'sync:operation:error',
										{
											operation: op.operation,
											error: e
										});
									reject(e);
								});
							break;
						}
						default:
							throw new Error(`Operation type '${ op.operation.opType }' cannot be handled.`);
					}
				}
				else
					throw new Error(`Operation '${opKey}' not found`);
			})
			.catch((e) => reject(e));
	}));
}

export function doExecuteSyncOperations(
	idbSrvc: IIdbInternalService,
	fcSrvc: IFiberChannelService,
) {
	return idbSrvc.openDb()
		.then((db) => db.getAllKeys('sync-operations'))
		.then((operationsKeys) => Promise.all(
			map(
				operationsKeys,
				(opKey) => _tryToConsumeOperation(opKey, idbSrvc, fcSrvc)
			)
		));
}

function _storeSOAPSyncToken(
	accountId: string,
	syncResponse: any,
	idbSrvc: IIdbInternalService
) {
	const syncResp = syncResponse.Body.SyncResponse;
	return idbSrvc.openDb()
		.then((db) => db.put(
			'sync',
			{
				accountId: accountId,
				token: typeof syncResp.token === 'string' ? parseInt(syncResp.token, 10) : syncResp.token,
				modifyDate: syncResp.md
			}
		));
}

function _propagateSOAPNotifications(response: any, fcSrvc: IFiberChannelService) {
	const data = { ...response.Body.SyncResponse };
	fcSrvc.getInternalFCSink()(
		'SOAP:notification:handle',
		omit(data, ['token'])
	);
}

function _executeSOAPSync(
	syncData: any | undefined,
	fcSrvc: IFiberChannelService,
	idbSrvc: IIdbInternalService
): Promise<void> {
	return new Promise((resolve, reject) => {
		const syncReq = {
			Body: {
				SyncRequest: {
					_jsns: 'urn:zimbraMail',
					typed: true
				}
			}
		};
		if (syncData) {
			syncReq.Body.SyncRequest.token = syncData.token;
			fetch(
				'/service/soap/SyncRequest',
				{
					method: 'POST',
					body: JSON.stringify(syncReq)
				}
			)
				.then(response => response.json())
				.then((syncResponse) => Promise.all([
					_storeSOAPSyncToken(
						syncData.accountId,
						syncResponse,
						idbSrvc
					),
					_propagateSOAPNotifications(syncResponse, fcSrvc)
				]))
				.then(() => resolve())
				.catch((err) => reject(err));
		}
		else {
			const getInfoReq = {
				Body: {
					GetInfoRequest: {
						_jsns: 'urn:zimbraAccount',
					}
				}
			};
			Promise.all([
				fetch(
					'/service/soap/GetInfoRequest',
					{
						method: 'POST',
						body: JSON.stringify(getInfoReq)
					}
				)
					.then(response => response.json()),
				fetch(
					'/service/soap/SyncRequest',
					{
						method: 'POST',
						body: JSON.stringify(syncReq)
					}
				)
					.then(response => response.json())
			])
				.then(([getInfoResponse, syncResponse]) => Promise.all([
					_storeSOAPSyncToken(
						getInfoResponse.Body.GetInfoResponse.id,
						syncResponse,
						idbSrvc
					),
					_propagateSOAPNotifications(syncResponse, fcSrvc)
				]))
				.then(() => resolve())
				.catch((err) => reject(err));
		}

	});
}

export function doSOAPSync(
	idbSrvc: IIdbInternalService,
	fcSrvc: IFiberChannelService
): Promise<void> {
	return idbSrvc.openDb()
		.then((db) => db.getAll('sync', undefined, 1))
		.then((syncDatas) => {
			if (syncDatas.length < 1) {
				// Is the first sync
				return _executeSOAPSync(
					undefined,
					fcSrvc,
					idbSrvc
				);
			}
			else if (syncDatas.length === 1) {
				// There is something to sync
				return _executeSOAPSync(
					syncDatas[0],
					fcSrvc,
					idbSrvc
				);
			}
			else {
				// Data must be nuked! Perhaps, it should not happen as the query is limited.
				return idbSrvc.openDb()
						.then((db) => db.clear('sync'));
			}
		});
}
