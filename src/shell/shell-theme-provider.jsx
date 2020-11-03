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
import { reduce, merge } from 'lodash';
import { extendTheme, ThemeContext, ThemeProvider } from '../../zapp-ui/src';
import { useFiberChannelFactory } from '../bootstrap/bootstrapper-context';
import { loadThemes } from '../app/theme-loader';
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
	const [baseTheme, setBaseTheme] = useState(extendTheme({}));
	const [themesLoaded, setThemesLoaded] = useState(false);
	const accounts = useUserAccounts();
	const fiberChannelFactory = useFiberChannelFactory();
	const loadThemesCb = useCallback(() => {
		loadThemes(
			accounts[0].themes,
			fiberChannelFactory,
			baseTheme
		)
			.then((themes) => {
				setBaseTheme(
					reduce(
						themes,
						(acc, v) => merge(
							acc,
							extendTheme(v)
						),
						{ ...baseTheme }
					)
				);
			});
	}, [accounts, fiberChannelFactory, baseTheme]);

	useEffect(() => {
		if (accounts.length > 0) {
			setThemesLoaded(false);
		}
	}, [accounts]);

	useEffect(() => {
		if (!themesLoaded) {
			loadThemesCb();
			setThemesLoaded(true);
		}
	}, [loadThemesCb, themesLoaded]);
	return (
		<ThemeProvider theme={baseTheme}>
			<ThemeModeSwitcher />
			{children}
		</ThemeProvider>
	);
};

export default ShellThemeProvider;
