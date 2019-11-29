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

import React, { FC, useEffect, useState, useRef } from 'react';
import { Subscription } from 'rxjs';

import { ISyncService } from './ISyncService';
import SyncContext from './SyncContext';

interface ISyncContextProviderProps {
	syncService: ISyncService;
}

const SyncContextProvider: FC<ISyncContextProviderProps> = ({ syncService, children }) => {
	const [ isSyncing, setIsSyncing ] = useState(false);
	const isSyncingSubRef = useRef<Subscription>();

	useEffect(() => {
		isSyncingSubRef.current = syncService.isSyncing.subscribe(setIsSyncing);

		return (): void => {
			if (isSyncingSubRef.current) {
				isSyncingSubRef.current.unsubscribe();
				isSyncingSubRef.current = undefined;
			}
		};
	}, [ syncService.isSyncing ]);

	return (
		<SyncContext.Provider value={ {
			isSyncing: isSyncing
		} }>
			{ children }
		</SyncContext.Provider>
	);
};
export default SyncContextProvider;
