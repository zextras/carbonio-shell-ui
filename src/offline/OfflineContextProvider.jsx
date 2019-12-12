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

import React, { useEffect, useRef, useState } from 'react';
import OfflineContext from './OfflineContext';

const OfflineContextProvider = ({ offlineService, children }) => {
	const [ isOnline, setIsOnline ] = useState(false);
	const isOnlineSubRef = useRef();

	useEffect(() => {
		isOnlineSubRef.current = offlineService.online.subscribe(setIsOnline);

		return () => {
			if (isOnlineSubRef.current) {
				isOnlineSubRef.current.unsubscribe();
				isOnlineSubRef.current = undefined;
			}
		};
	}, [ offlineService.online ]);

	return (
		<OfflineContext.Provider
			value={ {
				isOnline: isOnline
			} }
		>
			{ children }
		</OfflineContext.Provider>
	);
};
export default OfflineContextProvider;
