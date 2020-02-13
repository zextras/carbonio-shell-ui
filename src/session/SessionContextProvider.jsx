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

import React, { useState, useEffect, useRef } from 'react';
import SessionContext from './SessionContext';

const SessionContextProvider = ({ sessionService, children }) => {
	const [ isLoggedIn, setIsLoggedIn ] = useState(false);
	const isLoggedInSubRef = useRef();

	function handleSessionDataChange(sessionData) {
		if (sessionData)
			setIsLoggedIn(true);
		else
			setIsLoggedIn(false);
	}

	useEffect(() => {
		isLoggedInSubRef.current = sessionService.session.subscribe(handleSessionDataChange);

		return () => {
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
				doLogin: (u, p) => sessionService.doLogin(u, p, true),
				doLogout: () => sessionService.doLogout()
			} }
		>
			{ children }
		</SessionContext.Provider>
	);
};
export default SessionContextProvider;
