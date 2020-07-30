import { css } from 'styled-components';
export function pseudoClasses(theme, color) {
	return css`
		transition: background 0.2s ease-out;
		&:focus {
			outline: none;
			background: ${theme.palette[color].focus};
		}
		&:hover {
			outline: none;
			background: ${theme.palette[color].hover};
		}
		&:active {
			outline: none;
			background: ${theme.palette[color].active};
		}
	`;
}
