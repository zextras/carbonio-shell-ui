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

import { BehaviorSubject } from 'rxjs';

import { INetworkService } from '../network/INetworkService';
import { IAuthRequest, IAuthResponse, IGetInfoRequest, IGetInfoResponse } from '../network/ISoap';
import { IEndSessionRequest, IEndSessionResponse, IValidateSessionRequest, IValidateSessionResponse } from './ISoap';
import { IIdbInternalService } from '../idb/IIdbInternalService';
import { IStoredAccountData, IStoredSessionData } from '../idb/IShellIdbSchema';
import { ISessionService } from './ISessionService';

export default class SessionService implements ISessionService {

	public session: BehaviorSubject<IStoredSessionData | undefined>;
	private _currentSession?: string;

	constructor(
		private _networkSrvc: INetworkService,
		private _idbSrvc: IIdbInternalService
	) {
		this.session = new BehaviorSubject<IStoredSessionData | undefined>(undefined);
		this.session.subscribe((s) => {
			if (s && !this._currentSession) {
				this._currentSession = s.id;
				// this._networkSrvc.openNotificationChannel();
			} else if (!s && this._currentSession) {
				// this._networkSrvc.closeNotificationChannel();
				delete this._currentSession;
			}
		});
	}

	async init(): Promise<void> {
		const db = await this._idbSrvc.openDb();
		const storedSessions: Array<IStoredSessionData> = await db.getAllFromIndex('sessions', 'id');
		if (storedSessions.length >= 1) {
			await this._validateSession(storedSessions[0]);
		}
	}

	async doLogin(username: string, password: string, storeLoginData: boolean): Promise<IStoredSessionData> {
		const db = await this._idbSrvc.openDb();
		const authResp = await this._networkSrvc.sendSOAPRequest<IAuthRequest, IAuthResponse>(
			'Auth',
			{
				account: {
					by: 'name',
					_content: username
				},
				password: {
					_content: password
				},
				prefs: [
					{ pref: { name: 'zimbraPrefMailPollingInterval' } },
				]
			}
		);
		const getInfoResp = await this._networkSrvc.sendSOAPRequest<IGetInfoRequest, IGetInfoResponse>(
			'GetInfo',
			{}
		);
		const sessionData: IStoredSessionData = {
			id: getInfoResp.id,
			authToken: authResp.authToken[0]._content,
			username: getInfoResp.name
		};
		const accountData: IStoredAccountData = {
			id: getInfoResp.id,
			u: username,
			p: password
		};
		this.session.next({
			...sessionData,
			authToken: ''
		});
		if (storeLoginData) {
			const tx = db.transaction([ 'sessions', 'auth' ], 'readwrite');
			{
				const store = tx.objectStore('sessions');
				await store.put(sessionData);
			}
			{
				const store = tx.objectStore('auth');
				await store.put(accountData);
			}
			await tx.done;
		}
		console.debug('Login PASS');
		return sessionData;
	}

	async doLogout(): Promise<void> {
		const db = await this._idbSrvc.openDb();
		const tx = db.transaction([ 'sessions', 'auth', 'sync', 'sync-operations' ], 'readwrite');
		{
			const store = tx.objectStore('sessions');
			await store.clear();
		}
		{
			const store = tx.objectStore('auth');
			await store.clear();
		}
		{
			const store = tx.objectStore('sync');
			await store.clear();
		}
		{
			const store = tx.objectStore('sync-operations');
			await store.clear();
		}
		await tx.done;
		try {
			await this._networkSrvc.sendSOAPRequest<IEndSessionRequest, IEndSessionResponse>(
				'EndSession',
				{
					logoff: '1'
				}
			);
		} catch (err) {
			console.debug('Unable to perform logout', err);
		} finally {
			delete this._currentSession;
			this.session.next(undefined);
		}
	}

	async _validateSession(sessionData: IStoredSessionData): Promise<IStoredSessionData | undefined> {
		try {
			await this._networkSrvc.sendSOAPRequest<IValidateSessionRequest, IValidateSessionResponse>(
				'Auth',
				{
					account: {
						by: 'id',
						_content: sessionData.id
					},
					authToken: {
						verifyAccount: '1',
						_content: sessionData.authToken
					},
					prefs: [
						{ pref: { name: 'zimbraPrefMailPollingInterval' } },
					]
				}
			);
			console.debug('Session validation PASS');
			this.session.next({
				...sessionData,
				authToken: ''
			});
			return sessionData;
		} catch (err) {
			console.debug('Session validation FAIL', err);
			return this._tryToLoginWithSavedCredentials(sessionData.id);
		}
	}

	async _tryToLoginWithSavedCredentials(id: string): Promise<IStoredSessionData | undefined> {
		console.debug('Login RETRY');
		const db = await this._idbSrvc.openDb();
		const tx = db.transaction('auth', 'readwrite');
		const val: IStoredAccountData | undefined = await tx.store.get(id);
		await tx.done;

		if (!val) {
			return;
		}
		try {
			return this.doLogin(val.u, val.p, true);
		} catch (err) {
			console.debug('Login RETRY error', err);
			const tx = db.transaction([ 'sessions', 'auth' ], 'readwrite');
			{
				const store = tx.objectStore('sessions');
				await store.clear();
			}
			{
				const store = tx.objectStore('auth');
				await store.clear();
			}
			await tx.done;
		}
	}

}
