/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { createContext, FC, useCallback, useEffect, useMemo, useState } from 'react';
import {
	ThemeProvider as UIThemeProvider,
	ThemeProviderProps
} from '@zextras/carbonio-design-system';
import { auto, disable, enable, setFetchMethod } from 'darkreader';
import { reduce } from 'lodash';
import { createGlobalStyle, DefaultTheme } from 'styled-components';
import { DRPropValues, ThemeExtension } from '../../types';
import {
	BASE_FONT_SIZE,
	darkReaderDynamicThemeFixes,
	LOCAL_STORAGE_SETTINGS_KEY,
	SCALING_OPTIONS
} from '../constants';
import { useLocalStorage } from '../shell/hooks';
import { ScalingSettings } from '../../types/settings';

setFetchMethod(window.fetch);

interface ThemeCallbacks {
	addExtension: (newExtension: ThemeExtension, id: string) => void;
	setDarkReaderState: (newState: DRPropValues) => void;
}

export const ThemeCallbacksContext = createContext<ThemeCallbacks>({
	addExtension: () => {
		throw Error('Not implemented');
	},
	setDarkReaderState: () => {
		throw Error('not implemented');
	}
});

const paletteExtension = (theme: DefaultTheme): DefaultTheme => ({
	...theme,
	palette: {
		...theme.palette,
		shared: {
			regular: '#FFB74D',
			hover: '#FFA21A',
			active: '#FFA21A',
			focus: '#FF9800',
			disabled: '#FFD699'
		},
		linked: {
			regular: '#AB47BC',
			hover: '#8B3899',
			active: '#8B3899',
			focus: '#7A3187',
			disabled: '#DDB4E4'
		}
	}
});

const iconExtension: ThemeExtension = (theme) => ({
	...theme,
	icons: {
		...theme.icons,
		Shared: theme.icons.ArrowCircleRight,
		Linked: theme.icons.ArrowCircleLeft
	}
});

interface GlobalStyledProps {
	baseFontSize: number;
}

const GlobalStyle = createGlobalStyle<GlobalStyledProps>`
  html {
	  font-size: ${({ baseFontSize }): string => `${baseFontSize}%`};
  }
`;

const SCALING_LIMIT = {
	WIDTH: 1400,
	HEIGHT: 900,
	DPR: 2 // device pixel ratio
} as const;
export const ThemeProvider: FC = ({ children }) => {
	const [localStorageSettings] = useLocalStorage<ScalingSettings>(LOCAL_STORAGE_SETTINGS_KEY, {});

	const [extensions, setExtensions] = useState<Partial<Record<keyof DefaultTheme, ThemeExtension>>>(
		{}
	);

	useEffect(() => {
		setExtensions((extension) => ({
			...extension,
			palette: paletteExtension,
			icons: iconExtension
		}));
	}, []);

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

	const aggregatedExtensions = useCallback<NonNullable<ThemeProviderProps['extension']>>(
		(theme) =>
			reduce(
				extensions,
				(themeAccumulator, themeExtensionFn) => {
					if (themeExtensionFn) {
						return themeExtensionFn(themeAccumulator);
					}
					return themeAccumulator;
				},
				theme
			),
		[extensions]
	);

	const addExtension = useCallback<ThemeCallbacks['addExtension']>((newExtension, id) => {
		setExtensions((ext) => ({ ...ext, [id]: newExtension }));
	}, []);

	const getAutoScalingFontSize = useCallback<() => GlobalStyledProps['baseFontSize']>(() => {
		if (
			window.screen.width <= SCALING_LIMIT.WIDTH &&
			window.screen.height <= SCALING_LIMIT.HEIGHT &&
			window.devicePixelRatio >= SCALING_LIMIT.DPR
		) {
			const baseFontIndex = SCALING_OPTIONS.findIndex((option) => option.value === BASE_FONT_SIZE);
			if (baseFontIndex > 0) {
				return SCALING_OPTIONS[baseFontIndex - 1].value;
			}
		}
		return BASE_FONT_SIZE;
	}, []);

	const baseFontSize = useMemo<GlobalStyledProps['baseFontSize']>(() => {
		const savedScalingValueSetting = localStorageSettings['settings.appearance_setting.scaling'];
		const savedScalingAutoSetting = localStorageSettings['settings.appearance_setting.auto'];
		if (savedScalingAutoSetting === false && savedScalingValueSetting !== undefined) {
			return savedScalingValueSetting;
		}
		return getAutoScalingFontSize();
	}, [getAutoScalingFontSize, localStorageSettings]);

	return (
		<UIThemeProvider extension={aggregatedExtensions} loadDefaultFont>
			<ThemeCallbacksContext.Provider value={{ addExtension, setDarkReaderState }}>
				<GlobalStyle baseFontSize={baseFontSize} />
				{children}
			</ThemeCallbacksContext.Provider>
		</UIThemeProvider>
	);
};
