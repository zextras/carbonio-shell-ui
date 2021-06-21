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
import React, { createContext, FC, useCallback, useEffect, useState } from 'react';
import { ThemeProvider as UIThemeProvider } from '@zextras/zapp-ui';
import { enable, disable, auto } from 'darkreader';
import { reduce } from 'lodash';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Logo from './logo';

export type ThemeExtension = (theme: any) => any;
export type ThemeExtensionMap = Record<string, ThemeExtension>;

export const ThemeCallbacksContext = createContext<{
	addExtension: (newExtension: ThemeExtension, id: string) => void;
	setDarkReaderState: (newState: 'auto' | 'enabled' | 'disabled') => void;
}>({
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	addExtension: (newExtension: ThemeExtension, id: string) => {},
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	setDarkReaderState: (newState: 'auto' | 'enabled' | 'disabled') => {}
});

export const ThemeProvider: FC = ({ children }) => {
	// TODO: update when the DS is fully typed :D
	const [extensions, setExtensions] = useState<ThemeExtensionMap>({
		zextrasLogo: (t) => ({ ...t, logo: { ...t.logo, svg: Logo } })
	});
	const [darkReaderState, setDarkReaderState] = useState<'auto' | 'disabled' | 'enabled'>('auto');
	useEffect(() => {
		switch (darkReaderState) {
			case 'disabled':
				disable();
				break;
			case 'enabled':
				enable({
					sepia: -50
				});
				break;
			default:
			case 'auto':
				auto({
					sepia: -50
				});
				break;
		}
	}, [darkReaderState]);
	const aggregatedExtensions = useCallback(
		(theme: any) => reduce(extensions, (acc, val) => val(acc), theme),
		[extensions]
	);
	const addExtension = useCallback((newExtension: ThemeExtension, id: string) => {
		setExtensions((ext) => ({ ...ext, [id]: newExtension }));
	}, []);
	return (
		<UIThemeProvider extension={aggregatedExtensions}>
			<ThemeCallbacksContext.Provider value={{ addExtension, setDarkReaderState }}>
				{children}
			</ThemeCallbacksContext.Provider>
		</UIThemeProvider>
	);
};
