/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, {
	createContext,
	useCallback,
	useEffect,
	useLayoutEffect,
	useMemo,
	useState
} from 'react';

import {
	generateColorSet,
	ThemeProvider as UIThemeProvider,
	ThemeProviderProps as UIThemeProviderProps
} from '@zextras/carbonio-design-system';
import { auto, disable, enable, setFetchMethod } from 'darkreader';
import { map, reduce } from 'lodash';
import { createGlobalStyle, css, DefaultTheme, SimpleInterpolation } from 'styled-components';

import { useGetPrimaryColor } from './use-get-primary-color';
import { DarkReaderPropValues, ThemeExtension } from '../../types';
import { ScalingSettings } from '../../types/settings';
import { darkReaderDynamicThemeFixes, LOCAL_STORAGE_SETTINGS_KEY } from '../constants';
import { getAutoScalingFontSize } from '../settings/components/utils';
import { useLocalStorage } from '../shell/hooks/useLocalStorage';

setFetchMethod(window.fetch);

interface ThemeCallbacks {
	addExtension: (newExtension: ThemeExtension, id: string) => void;
	setDarkReaderState: (newState: DarkReaderPropValues) => void;
}

export const ThemeCallbacksContext = createContext<ThemeCallbacks>({
	addExtension: () => {
		throw Error('Not implemented');
	},
	setDarkReaderState: () => {
		throw Error('not implemented');
	}
});

type CustomTheme = Partial<Omit<DefaultTheme, 'palette'>> & {
	palette?: Partial<DefaultTheme['palette']>;
};

const paletteExtension =
	(customTheme: CustomTheme = {}) =>
	(theme: DefaultTheme): DefaultTheme => ({
		...theme,
		...customTheme,
		palette: {
			...theme.palette,
			...customTheme.palette,
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

const globalCursorsExtension: ThemeExtension = (theme) => ({
	...theme,
	globalCursors: [
		...(theme.globalCursors || []),
		'ns-resize',
		'ew-resize',
		'nesw-resize',
		'nwse-resize',
		'move'
	]
});

interface GlobalStyledProps {
	baseFontSize: number;
}

const GlobalStyle = createGlobalStyle<GlobalStyledProps>`
  html {
    font-size: ${({ baseFontSize }): string => `${baseFontSize}%`};
  }
  ${({ theme }): SimpleInterpolation =>
		map(
			theme.globalCursors,
			(cursor) => css`
				.global-cursor-${cursor} * {
					cursor: ${cursor} !important;
				}
			`
		)}
  .no-active-background:active {
	  background-color: inherit;
  }
`;

interface ThemeProviderProps {
	children?: React.ReactNode | React.ReactNode[];
}
export const ThemeProvider = ({ children }: ThemeProviderProps): React.JSX.Element => {
	const [localStorageSettings] = useLocalStorage<ScalingSettings>(LOCAL_STORAGE_SETTINGS_KEY, {});

	const [extensions, setExtensions] = useState<Partial<Record<keyof DefaultTheme, ThemeExtension>>>(
		{}
	);

	const primaryColor = useGetPrimaryColor();

	useLayoutEffect(() => {
		const customThemePalette: Partial<DefaultTheme['palette']> = primaryColor
			? { primary: generateColorSet({ regular: primaryColor }) }
			: {};
		setExtensions((extension) => ({
			...extension,
			palette: paletteExtension({
				palette: customThemePalette
			}),
			icons: iconExtension,
			globalCursors: globalCursorsExtension
		}));
	}, [primaryColor]);

	const [darkReaderState, setDarkReaderState] = useState<DarkReaderPropValues>('disabled');

	useEffect(() => {
		switch (darkReaderState) {
			case 'disabled':
				auto(false);
				disable();
				break;
			case 'enabled':
				auto(false);
				enable({}, darkReaderDynamicThemeFixes);
				break;
			case 'auto':
			default:
				auto({}, darkReaderDynamicThemeFixes);
				break;
		}
	}, [darkReaderState]);

	const aggregatedExtensions = useCallback<NonNullable<UIThemeProviderProps['extension']>>(
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

	const baseFontSize = useMemo<GlobalStyledProps['baseFontSize']>(() => {
		const savedScalingValueSetting = localStorageSettings['settings.appearance_setting.scaling'];
		if (savedScalingValueSetting !== undefined) {
			return savedScalingValueSetting;
		}
		return getAutoScalingFontSize();
	}, [localStorageSettings]);

	const themeCallbacksContextValue = useMemo<ThemeCallbacks>(
		() => ({ addExtension, setDarkReaderState }),
		[addExtension]
	);

	return (
		<UIThemeProvider extension={aggregatedExtensions}>
			<ThemeCallbacksContext.Provider value={themeCallbacksContextValue}>
				<GlobalStyle baseFontSize={baseFontSize} />
				{children}
			</ThemeCallbacksContext.Provider>
		</UIThemeProvider>
	);
};
