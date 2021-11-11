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

import React, { useMemo } from 'react';
import { useScreenMode } from '@zextras/zapp-ui';
import ShellContext from './shell-context';

export default function ShellContextProvider({ children }) {
	const screenMode = useScreenMode();

	const value = useMemo(
		() => ({
			isMobile: screenMode === 'mobile'
		}),
		[screenMode]
	);

	return <ShellContext.Provider value={value}>{children}</ShellContext.Provider>;
}
