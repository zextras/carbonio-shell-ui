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

import React, {
	useCallback, useContext, useEffect, useState
} from 'react';
import { extendTheme, ThemeContext, ThemeProvider } from '@zextras/zapp-ui';
import { useFiberChannelFactory } from '../bootstrap/bootstrapper-context';
import { loadThemes, unloadThemes } from '../app/theme-loader';
import { useUserAccounts } from '../store/shell-store-hooks';

const ThemeModeSwitcher = () => {
	const { mode, setMode } = useContext(ThemeContext);
	const [mediaPrefers, setMediaPrefers] = useState(
		window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
	);
	const mediaChangeCallback = useCallback(
		(e) => setMediaPrefers(e.matches ? 'dark' : 'light'),
		[setMediaPrefers]
	);

	useEffect(
		() => {
			window.matchMedia('(prefers-color-scheme: dark)').addEventListener(
				'change',
				mediaChangeCallback
			);
			return () => window.matchMedia('(prefers-color-scheme: dark)').removeEventListener(
				'change',
				mediaChangeCallback
			);
		},
		[mediaChangeCallback]
	);

	useEffect(() => {
		if (mediaPrefers !== mode) setMode(mediaPrefers);
	}, [mode, setMode, mediaPrefers]);

	return null;
};

const ShellThemeProvider = ({ children }) => {
	const accounts = useUserAccounts();
	const fiberChannelFactory = useFiberChannelFactory();
	const [[themeCache, themeLoaded], setThemeCache] = useState([
		extendTheme({}),
		false
	]);

	useEffect(() => {
		console.log('Accounts changed, un/loading Themes!');
		let canSet = true;
		if (accounts.length < 1) {
			unloadThemes()
				.then(() => {
					if (!canSet) return;
					setThemeCache([
						extendTheme({}),
						false
					]);
				})
				.catch();
		}
		else {
			loadThemes(
				accounts[0].themes,
				fiberChannelFactory,
				extendTheme({})
			)
				.then((themes) => {
					if (!canSet) return;
					setThemeCache([
						extendTheme(themes[0]),
						true
					]);
				});
		}
		return () => {
			canSet = false;
		};
	}, [accounts]);

	return (
		<ThemeProvider
			theme={themeCache}
		>
			<ThemeModeSwitcher />
			{ children }
		</ThemeProvider>
	);
};

export default ShellThemeProvider;
