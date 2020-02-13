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

const { map } = self.__ZAPP_SHARED_LIBRARIES__['lodash'];

function _executeSoapOperation(op) {
	return new Promise((resolve, reject) => {
		const soapReq = op.request;
		fetch(
			`/service/soap/${soapReq.command}Request`,
			{
				method: 'POST',
				body: JSON.stringify({
					Body: {
						[`${soapReq.command}Request`]: {
							...soapReq.data,
							_jsns: soapReq.urn
						}
					}
				})
			}
		)
			.then(response => response.json())
			.then(response => resolve(response))
			.catch(err => reject(err))
	});
}

function _tryToConsumeOperation(opKey) {
	return new Promise(((resolve, reject) => {
		self._idbSrvc.openDb()
			.then((db) => db.get('sync-operations', opKey))
			.then((op) => {
				if (op) {
					switch (op.operation.opType) {
						case 'soap': {
							_executeSoapOperation(op.operation)
								.then((result) => {
									return self._idbSrvc.openDb()
										.then((db) => db.delete('sync-operations', opKey))
										.then(() => self._sharedBC.postMessage({
											action: 'sync:operation:completed',
											data: {
												to: op.app.package,
												data: {
													operation: op.operation,
													result: result
												}
											}
										}));
								})
								.then(() => resolve())
								.catch((e) => {
									self._sharedBC.postMessage({
										action: 'sync:operation:error',
										data: {
											to: op.app.package,
											data: {
												operation: op.operation,
												error: e
											}
										}
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

function _doExecuteSyncOperations() {
	return self._idbSrvc.openDb()
		.then((db) => db.getAllKeys('sync-operations'))
		.then((operationsKeys) => Promise.all(
			map(
				operationsKeys,
				(opKey) => _tryToConsumeOperation(opKey)
			)
		));
}

function _storeSOAPSyncToken(accountId, syncResponse) {
	const syncResp = syncResponse.Body.SyncResponse;
	return self._idbSrvc.openDb()
		.then((db) => db.put(
			'sync',
			{
				accountId: accountId,
				token: typeof syncResp.token === 'string' ? parseInt(syncResp.token, 10) : syncResp.token,
				modifyDate: syncResp.md
			}
		));
}

function _propagateSOAPNotifications(response) {
	const data = { ...response.Body.SyncResponse };
	delete data.token;
	self._sharedBC.postMessage({
		action: 'SOAP:notification:handle',
		data
	});
}

function _executeSOAPSync(syncData) {
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
					_storeSOAPSyncToken(syncData.accountId, syncResponse),
					_propagateSOAPNotifications(syncResponse)
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
					_storeSOAPSyncToken(getInfoResponse.Body.GetInfoResponse.id, syncResponse),
					_propagateSOAPNotifications(syncResponse)
				]))
				.then(() => resolve())
				.catch((err) => reject(err));
		}

	});
}

function _doSOAPSync() {
	return self._idbSrvc.openDb()
		.then((db) => db.getAll('sync', null, 1))
		.then((syncDatas) => {
			if (syncDatas.length < 1) {
				// Is the first sync
				return _executeSOAPSync();
			}
			else if (syncDatas.length === 1) {
				// There is something to sync
				return _executeSOAPSync(syncDatas[0]);
			}
			else {
				// Data must be nuked! Perhaps, it should not happen as the query is limited.
				return new Promise((resolve, reject) => {
					self._idbSrvc.openDb()
						.then((db) => db.clear('sync'))
						.then((r) => resolve())
						.catch((e) => reject(e))
				});
			}
		});
}

self._doSOAPSync = _doSOAPSync;
self._doExecuteSyncOperations = _doExecuteSyncOperations;
