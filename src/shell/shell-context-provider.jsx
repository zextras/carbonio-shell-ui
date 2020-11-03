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

import React, { useMemo } from 'react';
import { useScreenMode } from '@zextras/zapp-ui';
import ShellContext from './shell-context';
import { useFiberChannelFactory } from '../bootstrap/bootstrapper-context';

export default function ShellContextProvider({ children }) {
	const fiberChannelFactory = useFiberChannelFactory();
	const screenMode = useScreenMode();

	const value = useMemo(() => ({
		isMobile: screenMode === 'mobile',
		fiberChannelSink: fiberChannelFactory.getAppFiberChannelSink({
			name: PACKAGE_NAME,
			version: PACKAGE_VERSION
		}),
		fiberChannel: fiberChannelFactory.getAppFiberChannel({
			name: PACKAGE_NAME,
			version: PACKAGE_VERSION
		})
	}), [screenMode, fiberChannelFactory]);

	return (
		<ShellContext.Provider
			value={value}
		>
			{ children }
		</ShellContext.Provider>
	);
}
