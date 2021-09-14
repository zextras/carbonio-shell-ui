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
import { enable, disable, auto, setFetchMethod } from 'darkreader';
import { reduce } from 'lodash';
import Logo from './logo';
import { useAccountStore } from '../store/account/account-store';
import { ThemeExtension, ThemeExtensionMap } from '../../types';

setFetchMethod(window.fetch);

export const ThemeCallbacksContext = createContext<{
	addExtension: (newExtension: ThemeExtension, id: string) => void;
	setDarkReaderState: (newState: 'auto' | 'enabled' | 'disabled') => void;
}>({
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	addExtension: (newExtension: ThemeExtension, id: string) => {},
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	setDarkReaderState: (newState: 'auto' | 'enabled' | 'disabled') => {}
});

const themeSizes = (
	size: 'small' | 'normal' | 'large' | 'larger' | 'default' | string
): ThemeExtension => {
	switch (size) {
		case 'small': {
			return (t: any): any => {
				// eslint-disable-next-line no-param-reassign
				t.sizes.font = {
					extrasmall: '10px',
					small: '12px',
					medium: '14px',
					large: '16px'
				};
				return t;
			};
		}
		case 'large': {
			return (t: any): any => {
				// eslint-disable-next-line no-param-reassign
				t.sizes.font = {
					extrasmall: '14px',
					small: '16px',
					medium: '18px',
					large: '20px'
				};
				return t;
			};
		}
		case 'larger': {
			return (t: any): any => {
				// eslint-disable-next-line no-param-reassign
				t.sizes.font = {
					extrasmall: '16px',
					small: '18px',
					medium: '20px',
					large: '22px'
				};
				return t;
			};
		}
		case 'default':
		case 'normal':
		default: {
			return (t: any): any => {
				// eslint-disable-next-line no-param-reassign
				t.sizes.font = {
					extrasmall: '12px',
					small: '14px',
					medium: '16px',
					large: '18px'
				};
				return t;
			};
		}
	}
};

export const ThemeProvider: FC = ({ children }) => {
	const zimbraPrefFontSize = useAccountStore((s) => s.settings.prefs?.zimbraPrefFontSize as string);
	// TODO: update when the DS is fully typed :D
	const [extensions, setExtensions] = useState<ThemeExtensionMap>({
		zextrasLogo: (t) => ({ ...t, logo: { ...t.logo, svg: Logo } }),
		fonts: (theme) => {
			// eslint-disable-next-line no-param-reassign
			theme.sizes.font = {
				extrasmall: '12px',
				small: '14px',
				medium: '16px',
				large: '18px'
			};
			return theme;
		}
	});
	useEffect(() => {
		setExtensions((e) => ({
			...e,
			fonts: themeSizes(zimbraPrefFontSize)
		}));
	}, [zimbraPrefFontSize]);
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
