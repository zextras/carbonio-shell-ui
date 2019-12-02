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
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core';
import ThemeService from './ThemeService';

interface IThemeContextProviderProps {
	themeService: ThemeService;
}

const ThemeContextProvider: FC<IThemeContextProviderProps> = ({ themeService, children }) => {
	const [ theme, setTheme ] = useState(createMuiTheme({}));
	const themeSubRef = useRef<Subscription>();

	useEffect(() => {
		themeSubRef.current = themeService.theme.subscribe((theme) => setTheme(theme));

		return (): void => {
			if (themeSubRef.current) {
				themeSubRef.current.unsubscribe();
				themeSubRef.current = undefined;
			}
		};
	}, [ themeService.theme ]);

	return (
		<ThemeProvider theme={ theme }>
			{ children }
		</ThemeProvider>
	);
};
export default ThemeContextProvider;
