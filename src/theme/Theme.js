import { default as IconData } from '../icons';
import { merge } from 'lodash';
const Theme = {
	breakpoints: {
		width: 960,
		aspectRatio: (2/3)
	},
	borderRadius: '2px',
	fonts: {
		default: `'Roboto', sans-serif`,
		weight: { regular: 400, medium: 600, bold: 700 }
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
	loginBackground: '/asset/login-bg.jpg',
	logo: {
		svg: IconData.Logo,
		size: {small: '16px', large: '24px'}
	},
	colors: {
		background: {
			bg_1: '#2b73d2',
			bg_2: '#95b9e8',
			bg_3: '#3267ac',
			bg_4: '#828282',
			bg_5: '#cfd5dc',
			bg_6: '#414141',
			bg_7: '#ffffff',
			bg_8: '#e6e9ed', //header and divider grey
			bg_9: '#f5f6f8', //containers grey
			bg_10: '#eeeff3', //email chip grey
			bg_11: '#d5e3f6' //highlight elements
		},
		disabled: {
			db_1: '#95b9e8',
			db_2: '#cfd5dc',
		},
		hover: {
			hv_1: '#3267ac',
			hv_2: '#414141',
			hv_7: '#eaeaea',
		},
		text: {
			txt_1: '#333333',
			txt_2: '#2b73d2',
			txt_3: '#ffffff',
			txt_4: '#828282',
			txt_5: '#ff5f58', //alert color
			txt_6: '#8bc34a', //success color
			txt_7: '#ffc107', //warning color
			txt_8: '#2196d3', //info color
		},
		feedback: {
			fb_1: '#ff5f58',
			fb_2: '#8bc34a',
			fb_3: '#ffc107',
			fb_4: '#2196d3'
		},
		border: {
			bd_1: '#CFD5DC',
			bd_2: '#2b73d2',
			bd_3: '#ffffff',
			bd_4: '#ff5f58',
			bd_5: '#e6e6e6',
		},
		highlight: {
			hl_1: '#d5e3f6' //highlight elements
		},
		status: {
			st_1: '#8bc34a',
			st_2: '#ff5f58',
			st_3: '#ffc107',
			st_4: '#414141',
		},
		avatar: {
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
	}
};

export const extendTheme = (mods) => merge(Theme, mods);

export default Theme;
