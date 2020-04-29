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

import React, { useContext, useMemo } from 'react';
import BootstrapperContext from './bootstrapper-context';
import { useObserveDb } from '../db/useObserveDb';

export function useShellNetworkService() {
	const { shellNetworkService } = useContext(BootstrapperContext);
	return shellNetworkService;
}

export function useShellDb() {
	const { shellDb } = useContext(BootstrapperContext);
	return shellDb;
}

export function useUserAccounts() {
	const { accounts, accountLoaded } = useContext(BootstrapperContext);
	return { accounts, accountLoaded };
}

export default function BootstrapperContextProvider({ children, shellNetworkService, shellDb }) {
	const query = useMemo(() => () => shellDb.accounts.limit(1).toArray(), [shellDb]);
	const [accounts, accountLoaded] = useObserveDb(query, shellDb);

	const value = useMemo(() => ({
		shellNetworkService,
		shellDb,
		accounts,
		accountLoaded
	}), [
		shellNetworkService,
		shellDb,
		accounts,
		accountLoaded
	]);

	return (
		<BootstrapperContext.Provider
			value={value}
		>
			{ children }
		</BootstrapperContext.Provider>
	);
}
