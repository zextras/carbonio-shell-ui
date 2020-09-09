import React, { useCallback, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import styled, { css, keyframes } from 'styled-components';
import Container from '../layout/Container';
import Icon from './Icon';
import Text from './Text';
import { useCombinedRefs } from '../../hooks/useCombinedRefs';
import useKeyboard, { getKeyboardPreset } from '../../hooks/useKeyboard';
import defaultTheme from '../../theme/Theme';

const colors =  ['primary', 'secondary', 'warning', 'error', 'success', 'info'];
const fixedColors = colors.reduce((prev, currentValue) => {
	prev[currentValue] = {
		default: {
			color: 'gray6',
		},
		outlined: {
			background: 'transparent',
		},
		ghost: {
			background: 'transparent',
			border: 'transparent'
		}
	};
	return prev;
} , {});

const Label = styled(Text)`
	user-select: none;
	padding: 0 ${(props) => props.theme.sizes.padding.extrasmall};
`;
const ContainerEl = styled(Container)`
	position: relative;
	cursor: ${(props) => props.disabled ? 'default' : 'pointer'};
	max-width: 100%;
	color: ${({theme, textColor}) => theme.palette[textColor].regular};
	transition: .2s ease-out;
	outline: none;

	${(props) => props.disabled && css`
		pointer-events: none;
		background: ${({theme, background}) => theme.palette[background || 'transparent'].disabled};
		color: ${({theme, textColor}) => theme.palette[textColor].disabled};
	`};
	&:hover{
		background: ${({theme, background}) => theme.palette[background || 'transparent'].hover};
		color: ${({theme, textColor}) => theme.palette[textColor].hover};
	}
	&:focus{
		background: ${({theme, background}) => theme.palette[background || 'transparent'].focus};
		color: ${({theme, textColor}) => theme.palette[textColor].focus};
	}
	&:active{
		background: ${({theme, background}) => theme.palette[background || 'transparent'].active};
		color: ${({theme, textColor}) => theme.palette[textColor].active};
	}
	${({bdColor}) => bdColor && css`
		border: 1px solid currentColor;
	`};
	${({theme, loading, disabled, bdColor}) => loading && bdColor && css`
		border-color: ${theme.palette[bdColor][disabled ? 'disabled' : 'regular']};
		&:hover{
			border-color: ${theme.palette[bdColor].hover};
		}
		&:focus{
			border-color: ${theme.palette[bdColor].focus};
		}
		&:active{
			border-color: ${theme.palette[bdColor].active};
		}
	`}
	${({loading}) => loading && css`
		color: transparent !important;
	`}
`;

const Button = React.forwardRef(function({
	children,
	type,
	color,
	disabled,
	labelColor,
	backgroundColor,
	label,
	size,
	icon,
	iconPlacement,
	onClick,
	loading,
	...rest
}, ref) {
	const buttonRef = useRef(undefined);
	const combinedRef = useCombinedRefs(ref, buttonRef);

	const keyPress = useCallback((e) => {
		if (!disabled) {
			onClick(e);
		}
	}, [disabled, onClick]);

	const keyEvents = useMemo(() => getKeyboardPreset('button', keyPress), [keyPress]);
	useKeyboard(combinedRef, keyEvents);

	const bgColor = useMemo(() => backgroundColor ? backgroundColor : (fixedColors[color][type].background || color), [backgroundColor, color, type]);
	const bdColor = useMemo(() => backgroundColor ? backgroundColor : (fixedColors[color][type].border || color), [backgroundColor, color, type]);
	const textColor = useMemo(() => labelColor ? labelColor : (fixedColors[color][type].color || color), [labelColor, color, type]);

	return (
		<ContainerEl
			ref={combinedRef}
			orientation={iconPlacement === 'left' ? 'row-reverse' : 'row'}
			width={size}
			height="fit"
			borderRadius="regular"
			textColor={textColor}
			bdColor={type === 'outlined' ? bdColor : undefined}
			background={bgColor}
			disabled={disabled}
			loading={loading ? 1 : 0}
			padding={{
				vertical: 'small',
				horizontal: 'medium'
			}}
			crossAlignment="center"
			onClick={onClick}
			{...rest}
			tabIndex={disabled ? -1 : 0}
		>
			<Label size="large" weight="regular" color="currentColor">{label.toUpperCase()}</Label>
			{ icon &&
				<Container width="fit" height="fit" padding={{horizontal: 'extrasmall'}}>
					<Icon icon={icon} size="medium" color="currentColor" />
				</Container> }
			{ loading && <LoadingIcon color={textColor}/> }
		</ContainerEl>
	);
});

Button.propTypes = {
	/** Type of button */
	type: PropTypes.oneOf(['default', 'outlined', 'ghost']),
	/** Color of button */
	color: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.oneOf(Object.keys(defaultTheme.palette.light))
	]),
	/** Color of the Button label */
	labelColor: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.oneOf(Object.keys(defaultTheme.palette.light))
	]),
	/** Color of the Button background */
	backgroundColor: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.oneOf(Object.keys(defaultTheme.palette.light))
	]),
	/** Button text */
	label: PropTypes.string.isRequired,
	/** `fit`: assume the size of the content
	 *
	 *  `fill`: take the width of the container
	 */
	size: PropTypes.oneOf(['fit', 'fill']),
	/** optional icon to display beside the label */
	icon: PropTypes.string,
	/** Icon position */
	iconPlacement: PropTypes.oneOf(['left', 'right']),
	/** whether to show the loading icon */
	loading: PropTypes.bool,
	/** whether to disable the button or not */
	disabled: PropTypes.bool
};

Button.defaultProps = {
	color: 'primary',
	type: 'default',
	size: 'fit',
	iconPlacement: 'right',
	loading: false,
	disabled: false
};

const rotateKeyframes = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
	}
`;
const rotateAnimation = css`
	${rotateKeyframes} .75s linear infinite;
`;
const LoadingContainer = styled(Container)`
	position: absolute;
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;
`;
const Spinner = styled.span`
	display: inline-block;
	width: 0.75rem;
	height: 0.75rem;
	vertical-align: text-bottom;
	color: ${({theme, color}) => theme.palette[color].regular};
	border: .125em solid currentColor;
	border-right-color: transparent;
	border-radius: 50%;
	animation: ${rotateAnimation};
`;
const LoadingIcon = ({ color }) => {
	return (
		<LoadingContainer>
			<Spinner color={color} />
		</LoadingContainer>
	);
};

export default Button;
