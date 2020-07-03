import React, { useState, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import Container from '../layout/Container';
import Icon from '../basic/Icon';
import { useCombinedRefs } from '../../hooks/useCombinedRefs';
import defaultTheme from '../../theme/Theme';
import { pseudoClasses } from '../utilities/functions';

const ContainerEl = styled(Container)`
	${(props) => props.disabled && css`
		pointer-events: none;
		opacity: 0.5;
	`};
	${({theme, background, disabled}) => !disabled && css`
		transition: background 0.2s ease-out;
		&:focus {
			outline: none;
			background: ${theme.palette[background].focus};
			& input {
				background: ${theme.palette[background].focus};
			}
		}
		&:hover {
			outline: none;
			background: ${theme.palette[background].hover};
			& input {
				background: ${theme.palette[background].hover};
			}
		}
		&:active {
			outline: none;
			background: ${theme.palette[background].active};
			& input {
				background: ${theme.palette[background].active};
			}
		}
	`};
`;
const InputEl = styled.input`
	border: none;
	width: 100%;
	outline: 0;
	background: ${({theme, background}) => theme.palette[background].regular};
	font-size: ${({theme}) => theme.sizes.font.medium};
	font-weight: ${({theme}) => theme.fonts.weight.regular};
	font-family: ${({theme}) => theme.fonts.default};
	color: ${({theme, color}) => theme.palette[color].regular};
	padding-top: ${({theme}) => theme.sizes.padding.medium};
	transition: background 0.2s ease-out;
`;

const Label = styled.label`
	position: absolute;
	top: ${({theme, active}) => active ? `calc(${theme.sizes.padding.small} - 1px)` : '50%'};
	left: ${({theme}) => theme.sizes.padding.large};
	font-size: ${({theme, active}) => theme.sizes.font[active ? 'small' : 'medium']};
	font-weight: ${({theme}) => theme.fonts.weight.regular};
	font-family: ${({theme}) => theme.fonts.default};
	color: ${({theme, hasFocus}) => theme.palette[hasFocus ? 'primary' : 'secondary'].regular};
	transform: translateY(${({active}) => active ? '0': '-50%'});
	transition: transform 150ms ease-out, font-size 150ms ease-out, top 150ms ease-out, left 150ms ease-out;
	pointer-events: none;
`;
const InputUnderline = styled.div`
	position: absolute;
	left: 0;
	bottom: 0;
	width: 100%;
	height: 1px;
	background: ${({theme, color}) => theme.palette[color].regular};
`;

const Input = React.forwardRef(function({
	borderColor,
	backgroundColor,
	disabled,
	textColor,
	label,
	inputRef,
	value,
	onChange
}, ref) {

	const [active, setActive] = useState(false);
	const innerRef = useRef();
	const comboRef = !!inputRef ? useCombinedRefs(inputRef, innerRef) : innerRef;
	const [id] = useState(`input-${Input._newId++}`);

	const onInputFocus = useCallback(() => {
		if (!disabled) {
			setActive(true);
			comboRef.current.focus();
		}
	}, [setActive, comboRef, disabled]);

	const onInputBlur = useCallback(() => setActive(false), [setActive]);

	return (
		<ContainerEl
			ref={ref}
			orientation="horizontal"
			width="fill"
			height="fit"
			borderRadius="half"
			background={backgroundColor}
			padding={{
				vertical: 'small',
				horizontal: 'large'
			}}
			style={{
				cursor: 'text',
				position: 'relative',
			}}
			onClick={onInputFocus}
			disabled={disabled}
		>
			<Label
				htmlFor={id}
				hasFocus={active}
				active={active || (comboRef.current && comboRef.current.value !== '') || !(comboRef.current || !value)}
				style={{userSelect: 'none'}}
			>
				{label}
			</Label>
			<InputEl
				background={backgroundColor}
				color={textColor}
				ref={comboRef}
				type="text"
				onFocus={onInputFocus}
				onBlur={onInputBlur}
				id={id}
				name={label}
				value={value}
				onChange={onChange}
				disabled={disabled}
			/>
			<InputUnderline color={active ? 'primary' : borderColor} />
		</ContainerEl>
	);
});

Input.propTypes = {
	/** Input's background color */
	backgroundColor: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.oneOf(Object.keys(defaultTheme.palette.light))
	]),
	/** whether to disable the Input or not */
	disabled: PropTypes.bool,
	/** Input's text color */
	textColor: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.oneOf(Object.keys(defaultTheme.palette.light))
	]),
	/** Input's bottom border color */
	borderColor: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.oneOf(Object.keys(defaultTheme.palette.light))
	]),
	/** Label of the input, will act (graphically) as placeholder when the input is not focused */
	label: PropTypes.string.isRequired,
	/** input change callback */
	onChange: PropTypes.func,
	/** ref to the input element */
	inputRef: PropTypes.object,
	/** value of the input */
	value: PropTypes.string
};

Input.defaultProps = {
	backgroundColor: 'gray6',
	disabled: false,
	textColor: 'text',
	borderColor: 'gray2'
};

Input._newId = 0;

const PasswordInput = React.forwardRef(function({
	borderColor,
	backgroundColor,
	disabled,
	textColor,
	label,
	inputRef,
	value,
	onChange
}, ref) {

	const [active, setActive] = useState(false);
	const [show, setShow] = useState(false);
	const innerRef = useRef();
	const comboRef = !!inputRef ? useCombinedRefs(inputRef, innerRef) : innerRef;
	const [id] = useState(`password-${PasswordInput._newId++}`);

	const onInputFocus = useCallback(() => {
		if (!disabled) {
			setActive(true);
			comboRef.current.focus()
		}
	}, [setActive, comboRef, disabled]);

	const onShowClick = useCallback((ev) => {
		ev.stopPropagation();
		setActive(true);
		setShow(!show);
	}, [setActive, setShow, show]);

	const onInputBlur = useCallback(() => setActive(false), [setActive]);

	return (
		<ContainerEl
			ref={ref}
			orientation="horizontal"
			width="fill"
			height="fit"
			borderRadius="half"
			background={backgroundColor}
			padding={{
				vertical: 'small',
				horizontal: 'large'
			}}
			style={{
				cursor: 'text',
				position: 'relative',
			}}
			onClick={onInputFocus}
			disabled={disabled}
		>
			<InputEl
				background={backgroundColor}
				color={textColor}
				ref={comboRef}
				type={show ? 'text' : 'password'}
				onFocus={onInputFocus}
				onBlur={onInputBlur}
				id={id}
				name={label}
				value={value}
				onChange={onChange}
				disabled={disabled}
			/>
			<Container onClick={onShowClick} width="fit" height="fit" style={{ cursor: 'pointer'}}>
				<Icon icon={show ? "Eye" : "EyeOff"} size="large" color={active ? 'primary' : 'secondary'} />
			</Container>
			<InputUnderline color={active ? 'primary' : borderColor} />
			<Label
				htmlFor={label}
				hasFocus={active}
				active={active || (comboRef.current && comboRef.current.value !== '')}
				style={{userSelect: 'none'}}
			>
				{label}
			</Label>
		</ContainerEl>
	);
});

PasswordInput.propTypes = Input.PropTypes;

PasswordInput.defaultProps = Input.defaultProps;

PasswordInput._newId = 0;

export { Input, PasswordInput };
