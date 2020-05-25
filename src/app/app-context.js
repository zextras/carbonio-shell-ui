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

const AppContext = createContext({
	pkg: undefined,
});

export function useAppPkg() {
	const { pkg } = useContext(AppContext);
	return pkg;
}

export function useAppContext() {
	return useContext(AppContext);
}

export function useFiberChannel() {
	const { fiberChannelSink, fiberChannel } = useContext(AppContext);
	return { fiberChannelSink, fiberChannel };
}

export default AppContext;
