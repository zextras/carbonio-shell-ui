/*
 * *** BEGIN LICENSE BLOCK *****
 * Copyright (C) 2011-2021 Zextras
 *
 *  The contents of this file are subject to the Zextras EULA;
 * you may not use this file except in compliance with the EULA.
 * You may obtain a copy of the EULA at
 * http://www.zextras.com/zextras-eula.html
 * *** END LICENSE BLOCK *****
 */

import { createContext, useContext } from 'react';

const BootstrapperContext = createContext({
	// i18nFactory,
	// shellNetworkService,
	// storeFactory
});

export function useI18nFactory() {
	const { i18nFactory } = useContext(BootstrapperContext);
	return i18nFactory;
}

export function useStoreFactory() {
	const { storeFactory } = useContext(BootstrapperContext);
	return storeFactory;
}

export default BootstrapperContext;
