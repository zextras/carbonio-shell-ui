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

import React from 'react';
import RouterContext from './RouterContext';

const RouterContextProvider = ({ routerService, children }) => {
	// const [isLoggedIn, setIsLoggedIn] = useState(false);
	//
	// let sessionDataSub;
	//
	// function handleSessionDataChange(sessionData) {
	//     if (sessionData)
	//         setIsLoggedIn(true);
	//     else
	//         setIsLoggedIn(false);
	// }
	//
	// useEffect(() => {
	//     if (!sessionDataSub) sessionDataSub = sessionService.session.subscribe(handleSessionDataChange);
	//
	//     return () => {
	//         sessionDataSub.unsubscribe();
	//         sessionDataSub = undefined;
	//     }
	// });

	return (
		<RouterContext.Provider
			value={ {
				routes: routerService.routes,
				mainMenuItems: routerService.mainMenuItems,
				createMenuItems: routerService.createMenuItems,
				currentRoute: routerService.currentRoute
			} }
		>
			{ children }
		</RouterContext.Provider>
	);
};
export default RouterContextProvider;
