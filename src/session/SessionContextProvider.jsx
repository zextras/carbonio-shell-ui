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

import React, { useState, useEffect, useRef, useMemo } from 'react';
import SessionContext from './SessionContext';



const SessionContextProvider = ({ sessionService, children }) => {
	const [ isLoggedIn, setIsLoggedIn ] = useState(false);
	const isLoggedInSubRef = useRef();

	const doLogin = useMemo(() => (u, p) => sessionService.doLogin(u, p, true), [sessionService]);
	const doLogout = useMemo(() => () => sessionService.doLogout(), [sessionService]);

	const handleSessionDataChange = useMemo(() => (sessionData) => {
		if (sessionData)
			setIsLoggedIn(true);
		else
			setIsLoggedIn(false);
	}, [setIsLoggedIn]);

	useEffect(() => {
		isLoggedInSubRef.current = sessionService.session.subscribe(handleSessionDataChange);

		return () => {
			if (isLoggedInSubRef.current) {
				isLoggedInSubRef.current.unsubscribe();
				isLoggedInSubRef.current = undefined;
			}
		};
	}, [sessionService.session, handleSessionDataChange]);

	return (
		<SessionContext.Provider
			value={{
				isLoggedIn,
				doLogin,
				doLogout
			}}
		>
			{ children }
		</SessionContext.Provider>
	);
};
export default SessionContextProvider;
