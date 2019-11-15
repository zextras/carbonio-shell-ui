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

/* eslint-disable @typescript-eslint/no-unused-vars */

import { createContext, Context } from 'react';
import { ISessionContext } from './ISessionContext';
import { IStoredSessionData } from '../idb/IShellIdbSchema';

function immediateReject<T>(): Promise<T> {
  return new Promise(
    (resolve, reject) => reject(new Error('SessionContext not initialized'))
  );
}

const context: Context<ISessionContext> = createContext<ISessionContext>({
  isLoggedIn: false,
  doLogin: (u, p) => immediateReject<IStoredSessionData>(),
  doLogout: () => immediateReject<void>()
});
export default context;
