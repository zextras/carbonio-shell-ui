/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { createTheme } from '@mui/material';

declare module '@mui/material/styles' {
	interface Palette {
		currentColor: CustomCurrentColorOptions;
		gray0: PaletteColorOptions;
		gray1: PaletteColorOptions;
		gray2: PaletteColorOptions;
		gray3: PaletteColorOptions;
		gray4: PaletteColorOptions;
		gray5: PaletteColorOptions;
		gray6: PaletteColorOptions;
		transparent: PaletteColorOptions;
		header: PaletteColorOptions;
		highlight: PaletteColorOptions;
	}

	interface PaletteOptions {
		currentColor?: CustomCurrentColorOptions;
		gray0: PaletteColorOptions;
		gray1: PaletteColorOptions;
		gray2: PaletteColorOptions;
		gray3: PaletteColorOptions;
		gray4: PaletteColorOptions;
		gray5: PaletteColorOptions;
		gray6: PaletteColorOptions;
		primary?: PaletteColorOptions;
		secondary?: PaletteColorOptions;
		text?: Partial<TypeText>;
		transparent: PaletteColorOptions;
		header: PaletteColorOptions;
		highlight: PaletteColorOptions;
		warning?: PaletteColorOptions;
		error?: PaletteColorOptions;
		success?: PaletteColorOptions;
		info?: PaletteColorOptions;
	}

	interface SimplePaletteColor {
		regular: string;
		hover: string;
		active: string;
		focus: string;
		disabled: string;
		main: string;
		gray3: string;
	}
	interface SimplePaletteColorOptions {
		regular?: string;
		hover?: string;
		active?: string;
		focus?: string;
		disabled?: string;
		main: string;
		gray3?: string;
	}

	interface PaletteColor {
		regular: string;
		hover: string;
		active: string;
		focus: string;
		disabled: string;
		main: string;
		gray3: string;
	}

	interface PaletteColorOptions {
		regular?: string;
		hover?: string;
		active?: string;
		focus?: string;
		disabled?: string;
		main: string;
		gray3?: string;
	}

	interface BreakpointOverrides {
		xs: true;
		sm: true;
		md: true;
		lg: true;
		xl: true;
		xxl: true;
		xxs: true;
	}

	interface TypeText {
		regular?: string;
		hover?: string;
		active?: string;
		focus?: string;
	}

	interface CustomCurrentColorOptions {
		regular: 'currentColor';
		hover: 'currentColor';
		active: 'currentColor';
		focus: 'currentColor';
		disabled: 'currentColor';
	}

	interface CustomSizesOptions {
		font: {
			extrasmall: string;
			small: string;
			medium: string;
			large: string;
			extralarge: string;
		};
		icon: { small: string; medium: string; large: string };
		padding: {
			extrasmall: string;
			small: string;
			medium: string;
			large: string;
			extralarge: string;
		};
	}

	interface CustomAvatarColorsOptions {
		[key: string]: string;
	}

	interface Theme {
		palette: PaletteOptions;
		sizes: CustomSizesOptions;
		avatarColors: CustomAvatarColorsOptions;
	}

	interface ThemeOptions {
		palette?: PaletteOptions;
		sizes?: CustomSizesOptions;
		avatarColors?: CustomAvatarColorsOptions;
	}
}
export const themeMui = createTheme({
	breakpoints: {
		values: {
			xxs: 600,
			xs: 900,
			sm: 1280,
			md: 1440,
			lg: 1920,
			xl: 2560,
			xxl: 3840
		}
	},
	sizes: {
		font: {
			extrasmall: '12px',
			small: '14px',
			medium: '16px',
			large: '18px',
			extralarge: '20px'
		},
		icon: { small: '12px', medium: '16px', large: '24px' },
		padding: {
			extrasmall: '4px',
			small: '8px',
			medium: '12px',
			large: '16px',
			extralarge: '24px'
		}
	},
	palette: {
		currentColor: {
			regular: 'currentColor',
			hover: 'currentColor',
			active: 'currentColor',
			focus: 'currentColor',
			disabled: 'currentColor'
		},
		transparent: {
			regular: 'rgba(0, 0, 0, 0)',
			hover: 'rgba(0, 0, 0, 0.05)',
			active: 'rgba(0, 0, 0, 0.1)',
			focus: 'rgba(0, 0, 0, 0.05)',
			disabled: 'rgba(0, 0, 0, 0)',
			main: 'rgba(0, 0, 0, 0)'
		},
		primary: {
			regular: '#2b73d2',
			hover: '#225ca8',
			active: '#1e5092',
			focus: '#225ca8',
			disabled: '#aac8ee',
			main: '#2b73d2'
		},
		secondary: {
			regular: '#828282',
			hover: '#696969',
			active: '#5c5c5c',
			focus: '#696969',
			disabled: '#cccccc',
			main: '#828282'
		},
		header: {
			regular: '#cfd5dc',
			hover: '#b1bbc6',
			active: '#a3aebc',
			focus: '#b1bbc6',
			disabled: '#cfd5dc',
			main: '#cfd5dc'
		},
		highlight: {
			regular: '#d5e3f6',
			hover: '#abc7ed',
			active: '#96b8e8',
			focus: '#abc7ed',
			disabled: '#d5e3f6',
			main: '#d5e3f6'
		},
		gray0: {
			regular: '#414141',
			hover: '#282828',
			active: '#1b1b1b',
			focus: '#282828',
			disabled: '#cccccc',
			main: '#414141'
		},
		gray1: {
			regular: '#828282',
			hover: '#696969',
			active: '#5c5c5c',
			focus: '#696969',
			disabled: '#cccccc',
			main: '#828282'
		},
		gray2: {
			regular: '#cfd5dc',
			hover: '#b1bbc6',
			active: '#a3aebc',
			focus: '#b1bbc6',
			disabled: '#cfd5dc',
			main: '#cfd5dc'
		},
		gray3: {
			regular: '#e6e9ed',
			hover: '#c8cfd8',
			active: '#bac2cd',
			focus: '#c8cfd8',
			disabled: '#e6e9ed',
			main: '#e6e9ed'
		},
		gray4: {
			regular: '#eeeff3',
			hover: '#d0d3de',
			active: '#c1c5d3',
			focus: '#d0d3de',
			disabled: '#eeeff3',
			main: '#eeeff3'
		},
		gray5: {
			regular: '#f5f6f8',
			hover: '#d7dbe3',
			active: '#c8ced9',
			focus: '#d7dbe3',
			disabled: '#f5f6f8',
			main: '#f5f6f8'
		},
		gray6: {
			regular: '#ffffff',
			hover: '#e6e6e6',
			active: '#d9d9d9',
			focus: '#e6e6e6',
			disabled: '#ffffff',
			main: '#ffffff'
		},
		warning: {
			regular: '#ffc107',
			hover: '#d39e00',
			active: '#ba8b00',
			focus: '#d39e00',
			disabled: '#ffe699',
			main: '#ffc107'
		},
		error: {
			regular: '#d74942',
			hover: '#be3028',
			active: '#a92a24',
			focus: '#be3028',
			disabled: '#edaeab',
			main: '#d74942'
		},
		success: {
			regular: '#8bc34a',
			hover: '#71a436',
			active: '#639030',
			focus: '#71a436',
			disabled: '#cee6b2',
			main: '#8bc34a'
		},
		info: {
			regular: '#2196d3',
			hover: '#1a75a7',
			active: '#176691',
			focus: '#1a75a7',
			disabled: '#a7d7f1',
			main: '#2196d3'
		},
		text: {
			regular: '#333333',
			hover: '#1a1a1a',
			active: '#0d0d0d',
			focus: '#1a1a1a',
			disabled: '#cccccc'
		}
	},
	avatarColors: {
		avatar_1: '#EF9A9A',
		avatar_2: '#F48FB1',
		avatar_3: '#CE93D8',
		avatar_4: '#B39DDB',
		avatar_5: '#9FA8DA',
		avatar_6: '#90CAF9',
		avatar_7: '#81D4FA',
		avatar_8: '#80DEEA',
		avatar_9: '#80CBC4',
		avatar_10: '#A5D6A7',
		avatar_11: '#C5E1A5',
		avatar_12: '#E6EE9C',
		avatar_13: '#FFE082',
		avatar_14: '#FFCC80',
		avatar_15: '#FFAB91',
		avatar_16: '#BCAAA4',
		avatar_17: '#E57373',
		avatar_18: '#F06292',
		avatar_19: '#BA68C8',
		avatar_20: '#9575CD',
		avatar_21: '#7986CB',
		avatar_22: '#64B5F6',
		avatar_23: '#4FC3F7',
		avatar_24: '#4DD0E1',
		avatar_25: '#4DB6AC',
		avatar_26: '#81C784',
		avatar_27: '#AED581',
		avatar_28: '#DCE775',
		avatar_29: '#FFD54F',
		avatar_30: '#FFB74D',
		avatar_31: '#FF8A65',
		avatar_32: '#A1887F',
		avatar_33: '#0097A7',
		avatar_34: '#EF5350',
		avatar_35: '#EC407A',
		avatar_36: '#AB47BC',
		avatar_37: '#7E57C2',
		avatar_38: '#5C6BC0',
		avatar_39: '#42A5F5',
		avatar_40: '#29B6F6',
		avatar_41: '#26C6DA',
		avatar_42: '#26A69A',
		avatar_43: '#66BB6A',
		avatar_44: '#9CCC65',
		avatar_45: '#D4E157',
		avatar_46: '#FFCA28',
		avatar_47: '#FFA726',
		avatar_48: '#FF7043',
		avatar_49: '#8D6E63',
		avatar_50: '#0288D1'
	}
});
