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
	INoOpRequest,
	INoOpResponse,
	ISoapResponse,
	ISoapResponseContent,
	JsnsUrn
} from './ISoap';
import { INetworkService, INotificationParser, ISoapSessionData } from './INetworkService';
import { sortBy, reduce, map, forOwn, filter, flattenDeep, compact } from 'lodash';
import { IFCSink } from '../fc/IFiberChannel';

type ParserContainer = { id: string; parser: INotificationParser<any> };

export default class NetworkService implements INetworkService {

	private _soapSessionData: ISoapSessionData = {};
	private _notifySeq = -1;
	private _modParsers: {[tag: string]: Array<ParserContainer>} = {};
	private _parserId = 0;
	private _latestNoop = Date.now();
	private _noopFails = 0;

	constructor(
		private _fcSink: IFCSink,
	) {}

	public openNotificationChannel(): void {
		setTimeout(
			this._sendNoop,
			1
		);
	}

	public closeNotificationChannel(): void {
		// TODO: Implement me!
		this._notifySeq = -1;
	}

	public registerNotificationParser(tagName: string, parser: INotificationParser<any>): string {
		const parserId = `${++this._parserId}`;
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
		const response = await fetch(
			`/service/soap/${ command }Request`,
			{
				method: 'POST',
				body: JSON.stringify(
					wrapRequest(command, data, this._soapSessionData, this._notifySeq, urn)
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
				delete this._soapSessionData.id;
				delete this._soapSessionData.authToken;
				delete this._soapSessionData.username;
				delete this._soapSessionData.sessionId;
				delete this._soapSessionData.notifySeq;
				return {} as unknown as RESP;
			}
			const [ data, notifications ] = unwrapResponse<RESP>(command, resp);
			/* Intercept Auth-related data */
			if (command === 'Auth') {
				this._soapSessionData.authToken = (data as unknown as IAuthResponse).authToken[0]._content;
				this._soapSessionData.sessionId = typeof resp.Header.context.session.id === 'string' ?
					parseInt(resp.Header.context.session.id, 10)
					:
					resp.Header.context.session.id;
			}
			if (command === 'GetInfo') {
				this._soapSessionData.username = (data as unknown as IGetInfoResponse).name;
				this._soapSessionData.id = (data as unknown as IGetInfoResponse).id;
			}

			/* Then handle the notifications and return the response */
			this._handleNotifications(notifications);
			return data;
		}
	}

	private _sendNoop: () => void = () => {
		if (this._noopFails >= 5) {
			return;
		}
		if (Date.now() - this._latestNoop < 500) {
			this._noopFails++;
			setTimeout(
				this._sendNoop,
				500
			);
			return;
		}
		this._latestNoop = Date.now();
		this.sendSOAPRequest<INoOpRequest, INoOpResponse>(
			'NoOp',
			{
				limitToOneBlocked: 1,
				wait: 1 // Enable for instant notifications
			}
		)
			.then(
				() => {
					this._noopFails = 0;
					setTimeout(
						this._sendNoop,
						1
					)
				}
			)
			.catch(
				() => {
					if (Date.now() - this._latestNoop < 100) this._noopFails++;
					setTimeout(
						this._sendNoop,
						1
					)
				}
			);
	};

	private _handleNotifications(notifications?: Array<ISoapNotification>): void {
		if (!notifications) return;
		this._notifySeq = reduce(notifications, (max, { seq }) => (max < seq) ? seq : max, this._notifySeq);
		map(sortBy(notifications, ['seq']), (n) => this._handleNotification(n))
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
