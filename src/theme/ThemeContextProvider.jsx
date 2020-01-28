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
import { ThemeProvider, extendTheme } from '@zextras/zapp-ui'

const ThemeContextProvider = ({ themeService, children }) => {
	const [ theme, setTheme ] = useState( extendTheme({}));
	const themeSubRef = useRef();
	useEffect(() => {
		themeSubRef.current = themeService.theme.subscribe((theme) => setTheme(theme));

		return () => {
			if (themeSubRef.current) {
				themeSubRef.current.unsubscribe();
				themeSubRef.current = undefined;
			}
		};
	}, [ themeService.theme ]);


	return (
		<ThemeProvider theme={theme}>
			{ children }
		</ThemeProvider>
	);
};
export default ThemeContextProvider;
