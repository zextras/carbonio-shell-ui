/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { createContext, FC, useCallback, useEffect, useState } from 'react';
import { ThemeProvider as UIThemeProvider } from '@zextras/carbonio-design-system';
import { enable, disable, auto, setFetchMethod } from 'darkreader';
import { reduce } from 'lodash';
import { useAccountStore } from '../store/account';
import { DRPropValues, ThemeExtension, ThemeExtensionMap } from '../../types';
import { darkReaderDynamicThemeFixes } from '../constants';

setFetchMethod(window.fetch);

export const ThemeCallbacksContext = createContext<{
	addExtension: (newExtension: ThemeExtension, id: string) => void;
	setDarkReaderState: (newState: DRPropValues) => void;
}>({
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	addExtension: (newExtension: ThemeExtension, id: string) => {},
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	setDarkReaderState: (newState: DRPropValues) => {}
});

const themeSizes = (
	size: 'small' | 'normal' | 'large' | 'larger' | 'default' | string
): ThemeExtension => {
	switch (size) {
		case 'small': {
			return (theme: any): any => {
				// eslint-disable-next-line no-param-reassign
				theme.sizes.font = {
					extrasmall: '10px',
					small: '12px',
					medium: '14px',
					large: '16px'
				};
				return theme;
			};
		}
		case 'large': {
			return (theme: any): any => {
				// eslint-disable-next-line no-param-reassign
				theme.sizes.font = {
					extrasmall: '14px',
					small: '16px',
					medium: '18px',
					large: '20px'
				};
				return theme;
			};
		}
		case 'larger': {
			return (theme: any): any => {
				// eslint-disable-next-line no-param-reassign
				theme.sizes.font = {
					extrasmall: '16px',
					small: '18px',
					medium: '20px',
					large: '22px'
				};
				return theme;
			};
		}
		case 'default':
		case 'normal':
		default: {
			return (theme: any): any => {
				// eslint-disable-next-line no-param-reassign
				theme.sizes.font = {
					extrasmall: '12px',
					small: '14px',
					medium: '16px',
					large: '18px'
				};
				return theme;
			};
		}
	}
};

const paletteExtension =
	(): ThemeExtension =>
	(theme: any): any => {
		// eslint-disable-next-line no-param-reassign
		theme.palette.shared = {
			regular: '#FFB74D',
			hover: '#FFA21A',
			active: '#FFA21A',
			focus: '#FF9800',
			disabled: '#FFD699'
		};
		// eslint-disable-next-line no-param-reassign
		theme.palette.linked = {
			regular: '#AB47BC',
			hover: '#8B3899',
			active: '#8B3899',
			focus: '#7A3187',
			disabled: '#DDB4E4'
		};
		return theme;
	};

const iconExtension =
	(): ThemeExtension =>
	(theme: any): any => {
		// eslint-disable-next-line no-param-reassign
		theme.icons.Shared = theme.icons.ArrowCircleRight;
		// eslint-disable-next-line no-param-reassign
		theme.icons.Linked = theme.icons.ArrowCircleLeft;
		return theme;
	};

export const ThemeProvider: FC = ({ children }) => {
	const zimbraPrefFontSize = useAccountStore((s) => s.settings.prefs?.zimbraPrefFontSize as string);
	// TODO: update when the DS is fully typed :D
	const [extensions, setExtensions] = useState<ThemeExtensionMap>({
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
			fonts: themeSizes(zimbraPrefFontSize),
			palette: paletteExtension(),
			icons: iconExtension()
		}));
	}, [zimbraPrefFontSize]);
	const [darkReaderState, setDarkReaderState] = useState<'auto' | 'disabled' | 'enabled'>('auto');
	useEffect(() => {
		switch (darkReaderState) {
			case 'disabled':
				disable();
				break;
			case 'enabled':
				enable(
					{
						sepia: -50
					},
					darkReaderDynamicThemeFixes
				);
				break;
			case 'auto':
			default:
				auto(
					{
						sepia: -50
					},
					darkReaderDynamicThemeFixes
				);
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
