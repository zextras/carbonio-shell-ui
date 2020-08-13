import { default as IconData } from '../icons';
import { merge } from 'lodash';
import generateColorMap from "./generateColorMap";
const Theme = {
	breakpoints: {
		width: 960,
		aspectRatio: (2/3)
	},
	borderRadius: '2px',
	fonts: {
		default: `'Roboto', sans-serif`,
		weight: { regular: 400, medium: 500, bold: 700 }
	},
	sizes: {
		font: { small: '10px', medium: '12px', large: '14px' },
		icon: { small: '12px', medium: '16px', large: '24px' },
		avatar: {
			small: { diameter: '16px', font: '9px' },
			medium: { diameter: '32px', font: '14px' },
			large: { diameter: '64px', font: '28px' }
		},
		padding: { extrasmall: '4px', small: '8px', medium: '12px', large: '16px', extralarge: '24px'}
	},
	icons: {
		...IconData
	},
	loginBackground: 'assets/login-bg.jpg',
	logo: {
		svg: IconData.Logo,
		size: {small: '16px', large: '24px'}
	},
	mode: 'light',
	palette: {
		light: {
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
				disabled: 'rgba(0, 0, 0, 0)'
			},
			primary: {
				regular: '#2b73d2',
				hover: '#225ca8',
				active: '#1e5092',
				focus: '#225ca8',
				disabled: '#aac8ee'
			},
			secondary: {
				regular: '#828282',
				hover: '#696969',
				active: '#5c5c5c',
				focus: '#696969',
				disabled: '#cccccc'
			},
			header: {
				regular: '#cfd5dc',
				hover: '#b1bbc6',
				active: '#a3aebc',
				focus: '#b1bbc6',
				disabled: '#cfd5dc'
			},
			highlight: {
				regular: '#d5e3f6',
				hover: '#abc7ed',
				active: '#96b8e8',
				focus: '#abc7ed',
				disabled: '#d5e3f6'
			},
			gray0: {
				regular: '#414141',
				hover: '#282828',
				active: '#1b1b1b',
				focus: '#282828',
				disabled: '#cccccc'
			},
			gray1: {
				regular: '#828282',
				hover: '#696969',
				active: '#5c5c5c',
				focus: '#696969',
				disabled: '#cccccc'
			},
			gray2: {
				regular: '#cfd5dc',
				hover: '#b1bbc6',
				active: '#a3aebc',
				focus: '#b1bbc6',
				disabled: '#cfd5dc'
			},
			gray3: {
				regular: '#e6e9ed',
				hover: '#c8cfd8',
				active: '#bac2cd',
				focus: '#c8cfd8',
				disabled: '#e6e9ed'
			},
			gray4: {
				regular: '#eeeff3',
				hover: '#d0d3de',
				active: '#c1c5d3',
				focus: '#d0d3de',
				disabled: '#eeeff3'
			},
			gray5: {
				regular: '#f5f6f8',
				hover: '#d7dbe3',
				active: '#c8ced9',
				focus: '#d7dbe3',
				disabled: '#f5f6f8'
			},
			gray6: {
				regular: '#ffffff',
				hover: '#e6e6e6',
				active: '#d9d9d9',
				focus: '#e6e6e6',
				disabled: '#ffffff'
			},
			warning: {
				regular: '#ffc107',
				hover: '#d39e00',
				active: '#ba8b00',
				focus: '#d39e00',
				disabled: '#ffe699'
			},
			error: {
				regular: '#d74942',
				hover: '#be3028',
				active: '#a92a24',
				focus: '#be3028',
				disabled: '#edaeab'
			},
			success: {
				regular: '#8bc34a',
				hover: '#71a436',
				active: '#639030',
				focus: '#71a436',
				disabled: '#cee6b2'
			},
			info: {
				regular: '#2196d3',
				hover: '#1a75a7',
				active: '#176691',
				focus: '#1a75a7',
				disabled: '#a7d7f1'
			},
			text: {
				regular: '#333333',
				hover: '#1a1a1a',
				active: '#0d0d0d',
				focus: '#1a1a1a',
				disabled: '#cccccc'
			}
		},
		dark: {
			currentColor: {
				regular: 'currentColor',
				hover: 'currentColor',
				active: 'currentColor',
				focus: 'currentColor',
				disabled: 'currentColor'
			},
			transparent: {
				regular: 'rgba(255, 255, 255, 0)',
				hover: 'rgba(255, 255, 255, 0.05)',
				active: 'rgba(255, 255, 255, 0.1)',
				focus: 'rgba(255, 255, 255, 0.05)',
				disabled: 'rgba(255, 255, 255, 0)'
			},
			primary: {
				regular: '#5791dd',
				hover: '#81ade6',
				active: '#97bbea',
				focus: '#81ade6',
				disabled: '#364963'
			},
			secondary: {
				regular: '#969696',
				hover: '#afafaf',
				active: '#bcbcbc',
				focus: '#afafaf',
				disabled: '#4d4d4d'
			},
			header: {
				regular: '#39424e',
				hover: '#4f5b6c',
				active: '#59687a',
				focus: '#4f5b6c',
				disabled: '#39424e'
			},
			divider: {
				regular: '#39424e',
				hover: '#4f5b6c',
				active: '#59687a',
				focus: '#4f5b6c',
				disabled: '#39424e'
			},
			highlight: {
				regular: '#122e54',
				hover: '#1b447e',
				active: '#205093',
				focus: '#1b447e',
				disabled: '#243042'
			},
			gray0: {
				regular: '#d7d7d7',
				hover: '#f0f0f0',
				active: '#fdfdfd',
				focus: '#f0f0f0',
				disabled: '#4d4d4d'
			},
			gray1: {
				regular: '#969696',
				hover: '#afafaf',
				active: '#bcbcbc',
				focus: '#afafaf',
				disabled: '#4d4d4d'
			},
			gray2: {
				regular: '#39424e',
				hover: '#4f5b6c',
				active: '#59687a',
				focus: '#4f5b6c',
				disabled: '#39424e'
			},
			gray3: {
				regular: '#272e37',
				hover: '#3c4755',
				active: '#475364',
				focus: '#3c4755',
				disabled: '#272e37'
			},
			gray4: {
				regular: '#21242f',
				hover: '#363b4d',
				active: '#41475c',
				focus: '#363b4d',
				disabled: '#21242f'
			},
			gray5: {
				regular: '#1c2028',
				hover: '#313846',
				active: '#3b4455',
				focus: '#313846',
				disabled: '#1c2028'
			},
			gray6: {
				regular: '#1a1a1a',
				hover: '#343434',
				active: '#404040',
				focus: '#343434',
				disabled: '#1a1a1a'
			},
			warning: {
				regular: '#ffca2c',
				hover: '#ffd75f',
				active: '#ffdd78',
				focus: '#ffd75f',
				disabled: '#635836'
			},
			error: {
				regular: '#d74941',
				hover: '#e0716b',
				active: '#e48580',
				focus: '#e0716b',
				disabled: '#633836'
			},
			success: {
				regular: '#96c95b',
				hover: '#aed682',
				active: '#bbdc95',
				focus: '#aed682',
				disabled: '#4e6336'
			},
			info: {
				regular: '#58b4e5',
				hover: '#84c8ec',
				active: '#9ad2ef',
				focus: '#84c8ec',
				disabled: '#365363'
			},
			text: {
				regular: '#e6e6e6',
				hover: '#ffffff',
				active: '#ffffff',
				focus: '#ffffff',
				disabled: '#4d4d4d'
			}
		},
	},
	avatarColors: {
		light: {
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
		},
		dark: {
			avatar_1: '#911717',
			avatar_2: '#9e103f',
			avatar_3: '#833591',
			avatar_4: '#503287',
			avatar_5: '#333f85',
			avatar_6: '#095b9f',
			avatar_7: '#077aaf',
			avatar_8: '#1c9aab',
			avatar_9: '#43a39a',
			avatar_10: '#397d3b',
			avatar_11: '#58802b',
			avatar_12: '#838e18',
			avatar_13: '#b08400',
			avatar_14: '#b26b00',
			avatar_15: '#a12600',
			avatar_16: '#786159',
			avatar_17: '#b72222',
			avatar_18: '#cb1351',
			avatar_19: '#aa46bb',
			avatar_20: '#6940b0',
			avatar_21: '#4254ab',
			avatar_22: '#0c75cb',
			avatar_23: '#0a9de1',
			avatar_24: '#28c6db',
			avatar_25: '#6bc2ba',
			avatar_26: '#48a14c',
			avatar_27: '#71a437',
			avatar_28: '#a7b620',
			avatar_29: '#e3ae00',
			avatar_30: '#e58900',
			avatar_31: '#cd3000',
			avatar_32: '#9b8076',
			avatar_33: '#8bf3ff',
			avatar_34: '#de1814',
			avatar_35: '#e81d61',
			avatar_36: '#b966c7',
			avatar_37: '#7e56c2',
			avatar_38: '#5766be',
			avatar_39: '#0d88ed',
			avatar_40: '#1cb1f5',
			avatar_41: '#50d0e1',
			avatar_42: '#83e2d9',
			avatar_43: '#5ab65f',
			avatar_44: '#84c040',
			avatar_45: '#c2d326',
			avatar_46: '#ffc20b',
			avatar_47: '#ff9e0d',
			avatar_48: '#ef3800',
			avatar_49: '#b19990',
			avatar_50: '#60c6fd',
		}
	}
};

const palette = {
	light: {
		primary: { regular: '#2b73d2' },
		secondary: { regular: '#828282' },
		header: { regular: '#cfd5dc' },
		divider: { regular: '#cfd5dc' },
		highlight: { regular: '#d5e3f6' },
		gray0: { regular: '#414141' },
		gray1: { regular: '#828282' },
		gray2: { regular: '#e6e9ed' },
		gray3: { regular: '#eeeff3' },
		gray4: { regular: '#f5f6f8' },
		gray5: { regular: '#ffffff' },
		warning: { regular: '#ffc107' },
		error: { regular: '#d74942' },
		success: { regular: '#8bc34a' },
		info: { regular: '#2196d3' },
		text: { regular: '#333333' },
	}
};

export const extendTheme = (mods, paletteOptions) => merge(Theme, { ...mods, palette: generateColorMap(mods.palette, paletteOptions || {})});

export default Theme;
