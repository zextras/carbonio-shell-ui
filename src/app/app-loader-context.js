/*
 * *** BEGIN LICENSE BLOCK *****
 * Copyright (C) 2011-2020 Zextras
 *
 *  The contents of this file are subject to the Zextras EULA;
 * you may not use this file except in compliance with the EULA.
 * You may obtain a copy of the EULA at
 * http://www.zextras.com/zextras-eula.html
 * *** END LICENSE BLOCK *****
 */

import { createContext, useContext } from 'react';

const AppLoaderContext = createContext({
	apps: { cache: {}, loaded: false },
	themes: { cache: {}, loaded: false },
});

export function useAppsCache() {
	const { apps } = useContext(AppLoaderContext);
	return apps;
}

export function useThemesCache() {
	const { themes } = useContext(AppLoaderContext);
	return themes;
}

export default AppLoaderContext;
