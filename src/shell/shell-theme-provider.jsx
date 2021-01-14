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

import React, { useEffect, useState } from 'react';
import { extendTheme, ThemeProvider } from '@zextras/zapp-ui';
import { useFiberChannelFactory } from '../bootstrap/bootstrapper-context';
import { loadThemes, unloadThemes } from '../app/theme-loader';
import { useUserAccounts } from '../store/shell-store-hooks';

export default function ShellThemeProvider({ children }) {
	const accounts = useUserAccounts();
	const fiberChannelFactory = useFiberChannelFactory();
	const [[themeCache], setThemeCache] = useState([{}, false]);

	useEffect(() => {
		console.log('Accounts changed, un/loading Themes!');
		let canSet = true;
		if (accounts.length < 1) {
			unloadThemes()
				.then(() => {
					if (!canSet) return;
					setThemeCache([{}, false]);
				})
				.catch();
		}
		else {
			loadThemes(
				accounts,
				fiberChannelFactory,
				(cache) => {
					if (!canSet) return;
					setThemeCache([cache, true]);
				}
			)
				.then();
		}
		return () => {
			canSet = false;
		};
	}, [accounts, fiberChannelFactory]);

	return (
		<ThemeProvider
			theme={extendTheme(themeCache)}
		>
			{ children }
		</ThemeProvider>
	);
}
