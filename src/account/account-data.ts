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

import { BehaviorSubject } from 'rxjs';
import { omit } from 'lodash';

export type AccountData = {
	token: string;
	name: string;
	id: string;
}

export type AppAccountData = {
	name: string;
	id: string;
}

export default class AccountDataService {
	constructor() {
		this._accountData = {
			token: '',
			name: '',
			id: ''
		};
		this.accountData = new BehaviorSubject<AccountData>(this._accountData);
		this._appAccountData = {
			name: '',
			id: ''
		};
		this.appAccountData = new BehaviorSubject<AppAccountData>(this._appAccountData);
	}

	public accountData: BehaviorSubject<AccountData>;

	private _accountData: AccountData;

	public appAccountData: BehaviorSubject<AppAccountData>;

	private _appAccountData: AppAccountData;

	public updateAccountData(newData: Partial<AccountData>): void {
		this._accountData = { ...this._accountData, ...newData };
		this.accountData.next(this._accountData);
		this._appAccountData = { ...this._appAccountData, ...omit(newData, 'token') };
		this.appAccountData.next(this._appAccountData);
	}

	public getAccountData(): AccountData {
		return { ...this._accountData };
	}

	public getAppAccountData(): AppAccountData {
		return { ...this._appAccountData };
	}
}
