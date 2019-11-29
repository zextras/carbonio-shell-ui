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

import { IStoredSessionData } from '../idb/IShellIdbSchema';

export interface ISessionContext {
	isLoggedIn: boolean;
	doLogin: DoLoginFn;
	doLogout: () => Promise<void>;
}

export type DoLoginFn = (username: string, password: string) => Promise<IStoredSessionData>;
