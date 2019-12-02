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

import React, { useState, useEffect, FC, useRef } from 'react';
import { Subscription } from 'rxjs';

import SessionContext from './SessionContext';
import { IStoredSessionData } from '../idb/IShellIdbSchema';
import { ISessionService } from './ISessionService';

interface ISessionContextProviderProps {
	sessionService: ISessionService;
}

const SessionContextProvider: FC<ISessionContextProviderProps> = ({ sessionService, children }) => {
	const [ isLoggedIn, setIsLoggedIn ] = useState(false);
	const isLoggedInSubRef = useRef<Subscription>();

	function handleSessionDataChange(sessionData: IStoredSessionData | undefined): void {
		if (sessionData)
			setIsLoggedIn(true);
		else
			setIsLoggedIn(false);
	}

	useEffect(() => {
		isLoggedInSubRef.current = sessionService.session.subscribe(handleSessionDataChange);

		return (): void => {
			if (isLoggedInSubRef.current) {
				isLoggedInSubRef.current.unsubscribe();
				isLoggedInSubRef.current = undefined;
			}
		};
	}, [ sessionService.session ]);

	return (
		<SessionContext.Provider
			value={ {
				isLoggedIn: isLoggedIn,
				doLogin: (u: string, p: string) => sessionService.doLogin(u, p, true),
				doLogout: () => sessionService.doLogout()
			} }
		>
			{ children }
		</SessionContext.Provider>
	);
};
export default SessionContextProvider;
