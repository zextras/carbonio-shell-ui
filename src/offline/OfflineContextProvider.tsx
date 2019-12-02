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

import React, { FC, useEffect, useRef, useState } from 'react';
import { Subscription } from 'rxjs';

import OfflineContext from './OfflineContext';
import OfflineService from './OfflineService';

interface IOfflineContextProviderProps {
	offlineService: OfflineService;
}

const OfflineContextProvider: FC<IOfflineContextProviderProps> = ({ offlineService, children }) => {
	const [ isOnline, setIsOnline ] = useState(false);
	const isOnlineSubRef = useRef<Subscription>();

	useEffect(() => {
		isOnlineSubRef.current = offlineService.online.subscribe(setIsOnline);

		return (): void => {
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
