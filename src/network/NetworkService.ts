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

/* eslint-disable @typescript-eslint/no-explicit-any */

import { ISoapNotification } from './ISoapNotification';
import {
	unwrapResponse,
	wrapRequest
} from './Soap';
import {
	IAuthResponse,
	IGetInfoResponse,
	ISoapResponse,
	ISoapResponseContent,
	JsnsUrn
} from './ISoap';
import { INetworkService, INotificationParser } from './INetworkService';
import { sortBy, map, forOwn, filter, flattenDeep, compact } from 'lodash';
import { IFCSink } from '../fc/IFiberChannel';
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import NoopWorker from './Noop.worker.js';
import { IIdbInternalService } from '../idb/IIdbInternalService';
import { IStoredSoapSessionData } from '../idb/IShellIdbSchema';

type ParserContainer = { id: string; parser: INotificationParser<any> };

export default class NetworkService implements INetworkService {

	private _modParsers: { [tag: string]: Array<ParserContainer> } = {};
	private _parserId = 0;
	private _noopWorker = new NoopWorker();
	private _soapSessionId = '';

	constructor(
		private _fcSink: IFCSink,
		private _idbSrvc: IIdbInternalService
	) {
		this._noopWorker.addEventListener('message', this._onNoopWorkerMessage)
	}

	public openNotificationChannel(): void {
		this._noopWorker.postMessage({ action: 'start' });
	}

	public closeNotificationChannel(): void {
		this._noopWorker.postMessage({ action: 'stop' });
	}

	public registerNotificationParser(tagName: string, parser: INotificationParser<any>): string {
		const parserId = `${ ++this._parserId }`;
		if (!this._modParsers[tagName]) {
			this._modParsers[tagName] = [];
		}
		this._modParsers[tagName].push({ id: parserId, parser });
		return parserId;
	}

	public unregisterNotificationParserById(id: string): void {
		forOwn(
			this._modParsers,
			(v, k) => this._modParsers[k] = filter(v, (o) => o.id !== id)
		);
	}

	public async sendSOAPRequest<REQ, RESP extends ISoapResponseContent>(command: string, data: REQ, urn?: string | JsnsUrn): Promise<RESP> {
		let sessionData: IStoredSoapSessionData = {
			id: '',
			notifySeq: -1,
			authToken: ''
		};
		const db = await this._idbSrvc.openDb();
		const idbSessionData = await db.get<'soapSessions'>('soapSessions', this._soapSessionId);
		if (idbSessionData) {
			sessionData = idbSessionData;
		}
		const response = await fetch(
			`/service/soap/${ command }Request`,
			{
				method: 'POST',
				body: JSON.stringify(
					wrapRequest(command, data, sessionData, urn)
				)
			}
		);
		if (!response.ok) {
			if (response.status === 500) {
				throw new Error('Authentication Error');
			} else {
				throw new Error('HTTP Error');
			}
		} else {
			const resp: ISoapResponse<RESP> = await response.json();
			if (command === 'EndSession') {
				// The end session request has no response, so the unwrapping will fail.
				await db.clear('soapSessions');
				this._soapSessionId = '';
				this.closeNotificationChannel();
				this._noopWorker.postMessage({ action: 'set-session-id', sessionId: '' });
				return {} as unknown as RESP;
			}
			const [ data, notifications ] = unwrapResponse<RESP>(command, resp);
			/* Intercept Auth-related data */
			if (command === 'Auth') {
				this._soapSessionId = `${resp.Header.context.session.id}`;
				await db.clear('soapSessions');
				await db.put<'soapSessions'>('soapSessions', {
					id: this._soapSessionId,
					notifySeq: -1,
					authToken: (data as unknown as IAuthResponse).authToken[0]._content,
					zimbraPrefMailPollingInterval: parseInt(
						// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
						(data as unknown as IAuthResponse).prefs!._attrs['zimbraPrefMailPollingInterval'] || '500',
						10
					)
				});
				this._noopWorker.postMessage({ action: 'set-session-id', sessionId: this._soapSessionId });
			}
			if (command === 'GetInfo') {
				const storedAccountData = await db.get<'soapSessions'>('soapSessions', this._soapSessionId);
				if (storedAccountData) {
					await db.put<'soapSessions'>('soapSessions', {
						...storedAccountData,
						username: (data as unknown as IGetInfoResponse).name,
						accountId: (data as unknown as IGetInfoResponse).id
					});
				}
			}

			/* Then handle the notifications and return the response */
			if (notifications) {
				this._handleNotifications(notifications);
			}
			return data;
		}
	}

	private _onNoopWorkerMessage: (e: MessageEvent) => void = (e) => {
		switch (e.data.action) {
			case 'started':
				console.log('Noop Worker Started');
				break;
			case 'stopped':
				console.log('Noop Worker Stopped');
				break;
			case 'notifications':
				console.log('notifications', e.data.notifications);
				break;
		}
	};

	private _handleNotifications(notifications: Array<ISoapNotification>): void {
		map(sortBy(notifications, [ 'seq' ]), (n) => this._handleNotification(n));
	}

	private _handleNotification({ created, deleted, modified }: ISoapNotification): void {
		if (created) {
			Promise.all(
				compact(
					flattenDeep(
						map(created, (mods, tag) => {
							if (this._modParsers[tag]) {
								return map(
									this._modParsers[tag],
									(p) => map(mods, (m) => p.parser('created', m))
								);
							}
						})
					)
				)
			).then(() => undefined);
		}
		if (modified) {
			Promise.all(
				compact(
					flattenDeep(
						map(modified, (mods, tag) => {
							if (this._modParsers[tag]) {
								return map(
									this._modParsers[tag],
									(p) => map(mods, (m) => p.parser('modified', m))
								);
							}
						})
					)
				)
			).then(() => undefined);
		}
		if (deleted) {
			map(
				deleted.id.split(','),
				(id) => this._fcSink<string>('notification:item:deleted', id)
			);
		}
	}

}
