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

import { createContext, useContext } from 'react';

const BootstrapperContext = createContext({
	// shellNetworkService,
	// shellDb,
	// fiberChannelFactory,
	accountLoaded: false,
	accounts: []
});

export function useShellNetworkService() {
	const { shellNetworkService } = useContext(BootstrapperContext);
	return shellNetworkService;
}

export function useShellDb() {
	const { shellDb } = useContext(BootstrapperContext);
	return shellDb;
}

export function useFiberChannelFactory() {
	const { fiberChannelFactory } = useContext(BootstrapperContext);
	return fiberChannelFactory;
}

export function useUserAccounts() {
	const { accounts, accountLoaded } = useContext(BootstrapperContext);
	return { accounts, accountLoaded };
}

export default BootstrapperContext;
