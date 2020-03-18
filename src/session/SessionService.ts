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

import { IIdbInternalService } from '../idb/IIdbInternalService';
import { IStoredSessionData } from '../idb/IShellIdbSchema';
import { ISessionService } from './ISessionService';
import { IFiberChannelService } from '../fc/IFiberChannelService';
import { IShellNetworkService } from '../network/IShellNetworkService';

export default class SessionService implements ISessionService {

	public session: BehaviorSubject<IStoredSessionData | undefined>;
	private _currentSession?: string;

	constructor(
		private _networkSrvc: IShellNetworkService,
		private _idbSrvc: IIdbInternalService,
		private _ifcSrvc: IFiberChannelService
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

	public init(): Promise<void> {
		return this._idbSrvc.openDb()
			.then((db) => db.getAllFromIndex('sessions', 'id'))
			.then((storedSessions) => {
				if (storedSessions.length >= 1) {
					return this._validateSession(storedSessions[0]).then();
				}
			});
	}

	public doLogin(username: string, password: string, storeLoginData: boolean): Promise<IStoredSessionData> {
		return this._idbSrvc.openDb()
			.then((db) => {
				return this._networkSrvc.doLogin(username, password)
					.then(([sessionData, accountData]) => {
						this.session.next({
							...sessionData,
							authToken: ''
						});
						this._ifcSrvc.getInternalFCSink()('session:login:logged-in');
						if (storeLoginData) {
							const tx = db.transaction([ 'sessions', 'auth' ], 'readwrite');
							const s1 = tx.objectStore('sessions');
							return s1.put(sessionData)
								.then(() => {
									const s2 = tx.objectStore('auth');
									return s2.put(accountData)
								})
								.then(() => tx.done)
								.then(() => sessionData);
						}
						return sessionData;
					});
			});
	}

	public doLogout(): Promise<void> {
		return this._idbSrvc.openDb()
			.then((db) => {
				const tx = db.transaction([ 'sessions', 'auth', 'sync', 'sync-operations' ], 'readwrite');
					const store = tx.objectStore('sessions');
					return store.clear()
						.then(() => {
							const store = tx.objectStore('auth');
							return store.clear();
						})
						.then(() => {
							const store = tx.objectStore('sync');
							return store.clear();
						})
						.then(() => {
							const store = tx.objectStore('sync-operations');
							return store.clear();
						})
						.then(() => tx.done);
				})
			.then(() => {
				return this._networkSrvc.doLogout()
					.catch((e) => console.error('Unable to perform logout', e))
					.finally(() => {
						delete this._currentSession;
						this.session.next(undefined);
						this._ifcSrvc.getInternalFCSink()('session:login:logged-out');
					})
			});
	}

	private _validateSession(sessionData: IStoredSessionData): Promise<IStoredSessionData> {
		return this._networkSrvc.validateSession(sessionData)
			.then(() => {
				this.session.next({
					...sessionData,
					authToken: ''
				});
				this._ifcSrvc.getInternalFCSink()('session:login:logged-in');
				return sessionData;
			})
			.catch(() => this._tryToLoginWithSavedCredentials(sessionData.id));
	}

	private _tryToLoginWithSavedCredentials(id: string): Promise<IStoredSessionData> {
		return this._idbSrvc.openDb()
			.then((db) => {
				const tx = db.transaction('auth', 'readwrite');
				return tx.store.get(id)
					.then((sessionData) => {
						if (!sessionData) throw new Error(`Auth data not found with id: ${id}`);
						return tx.done.then(() => sessionData);
					});
			})
			.then((sessionData) => {
				return this.doLogin(sessionData.u, sessionData.p, true)
					.catch((e) => {
						return this.doLogout()
							.then(() => { throw new Error(`Login error`); })
					})
			});
	}

}
