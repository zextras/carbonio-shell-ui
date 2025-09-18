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

import { Global, css } from '@emotion/react';
import type {
	Theme,
	ThemeProviderProps as UIThemeProviderProps
} from '@zextras/carbonio-design-system';
import {
	generateColorSet,
	ThemeProvider as UIThemeProvider,
	useTheme
} from '@zextras/carbonio-design-system';
import { auto, disable, enable, setFetchMethod } from 'darkreader';
import { map, reduce } from 'lodash';

import { useGetPrimaryColor } from './use-get-primary-color';
import { darkReaderDynamicThemeFixes, LOCAL_STORAGE_SETTINGS_KEY } from '../constants';
import type { DarkReaderPropValues } from '../dark-mode/utils';
import { getAutoScalingFontSize } from '../settings/components/utils';
import { useLocalStorage } from '../shell/hooks/useLocalStorage';
import type { ScalingSettings } from '../types/settings';

export type ThemeExtension = (theme: Theme) => Theme;

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

type CustomTheme = Partial<Omit<Theme, 'palette'>> & {
	palette?: Partial<Theme['palette']>;
};

const paletteExtension =
	(customTheme: CustomTheme = {}) =>
	(theme: Theme): Theme => ({
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

const getGlobalStyles = (baseFontSize: number, theme: Theme): ReturnType<typeof css> => css`
	html {
		font-size: ${baseFontSize}%;
	}
	${map(
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

const GlobalStyles = (): React.JSX.Element => {
	const [localStorageSettings] = useLocalStorage<ScalingSettings>(LOCAL_STORAGE_SETTINGS_KEY, {});
	const theme = useTheme();

	const baseFontSize = useMemo<GlobalStyledProps['baseFontSize']>(() => {
		const savedScalingValueSetting = localStorageSettings['settings.appearance_setting.scaling'];
		if (savedScalingValueSetting !== undefined) {
			return savedScalingValueSetting;
		}
		return getAutoScalingFontSize();
	}, [localStorageSettings]);

	const styles = useMemo(() => getGlobalStyles(baseFontSize, theme), [baseFontSize, theme]);

	return <Global styles={styles} />;
};

interface ThemeProviderProps {
	children?: React.ReactNode | React.ReactNode[];
}

export const ThemeProvider = ({ children }: ThemeProviderProps): React.JSX.Element => {
	const [extensions, setExtensions] = useState<Partial<Record<keyof Theme, ThemeExtension>>>({});

	const primaryColor = useGetPrimaryColor();

	useLayoutEffect(() => {
		const customThemePalette: Partial<Theme['palette']> = primaryColor
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

	const themeCallbacksContextValue = useMemo<ThemeCallbacks>(
		() => ({ addExtension, setDarkReaderState }),
		[addExtension]
	);

	return (
		<UIThemeProvider extension={aggregatedExtensions}>
			<ThemeCallbacksContext.Provider value={themeCallbacksContextValue}>
				<GlobalStyles />
				{children}
			</ThemeCallbacksContext.Provider>
		</UIThemeProvider>
	);
};
