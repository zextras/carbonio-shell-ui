import React, { useState, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Container from "./Container";
import Icon from "./Icon";
import defaultTheme from "../../theme/Theme";
import { useCombinedRefs } from "../../hooks/useCombinedRefs";

const InputEl = styled.input`
	border: none;
	height: 16px;
	width: 100%;
	outline: 0;
	background: ${props => props.theme.colors.background[props.background]};
	font-size: ${props => props.theme.sizes.font['medium']};
	font-weight: ${props => props.theme.fonts.weight['regular']};
	font-family: ${props => props.theme.fonts.default};
	color: ${props => props.theme.colors.text[props.color]};
	padding-top: ${props => props.theme.sizes.padding['medium']};
  padding-bottom: ${props => props.theme.sizes.padding['extrasmall']};
`;

const Label = styled.label`
	position: absolute;
	top: calc(${props => props.active ? `${props.theme.sizes.padding['extrasmall']} + 2px` : `${props.theme.sizes.padding['large']} + 6px`});
	left: ${props => props.theme.sizes.padding[props.active ? 'small' : 'large']};
	font-size: ${props => props.theme.sizes.font[props.active ? 'small' : 'medium']};
	font-weight: ${props => props.theme.fonts.weight['regular']};
	font-family: ${props => props.theme.fonts.default};
	color: ${props => props.theme.colors.text['txt_4']};
	transition: transform 150ms ease-out, font-size 150ms ease-out, top 150ms ease-out, left 150ms ease-out;
`;
const InputUnderline = styled.div`
	position: absolute;
	bottom: 0;
	width: 100%;
	height: 1px;
	background: ${props => props.theme.colors.border[props.color]};
`;

function Input({
	borderColor,
	backgroundColor,
	textColor,
	label,
	inputRef,
	value,
	onChange
}) {

	const [active, setActive] = useState(false);
	const innerRef = useRef();
	const comboRef = !!inputRef ? useCombinedRefs(inputRef, innerRef) : innerRef;
	const [id] = useState(`input-${Input._newId++}`);

	const onInputFocus = useCallback(() => {
		setActive(true);
		comboRef.current.focus()
	}, [setActive, comboRef]);

	const onInputBlur = useCallback(() => setActive(false), [setActive]);

	return (
		<Container
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
		>
			<Label
				htmlFor={id}
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
			/>
			<InputUnderline color={active ? 'bd_2' : borderColor} />
		</Container>
	);
}

Input.propTypes = {
	/** Input's background color */
	backgroundColor: PropTypes.oneOf(Object.keys(defaultTheme.colors.background)),
	/** Input's text color */
	textColor: PropTypes.oneOf(Object.keys(defaultTheme.colors.text)),
	/** Input's bottom border color */
	borderColor: PropTypes.oneOf(Object.keys(defaultTheme.colors.border)),
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
	backgroundColor: 'bg_7',
	textColor: 'txt_1',
	borderColor: 'bd_1'
};

Input._newId = 0;

function PasswordInput({
	borderColor,
	backgroundColor,
	textColor,
	label,
	inputRef,
	value,
	onChange
}) {

	const [active, setActive] = useState(false);
	const [show, setShow] = useState(false);
	const innerRef = useRef();
	const comboRef = !!inputRef ? useCombinedRefs(inputRef, innerRef) : innerRef;
	const [id] = useState(`password-${PasswordInput._newId++}`);

	const onInputFocus = useCallback(() => {
		setActive(true);
		comboRef.current.focus()
	}, [setActive, comboRef]);

	const onShowClick = useCallback((ev) => {
		ev.stopPropagation();
		setActive(true);
		setShow(!show);
	}, [setActive, setShow, show]);

	const onInputBlur = useCallback(() => setActive(false), [setActive]);

	return (
		<Container
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
			/>
			<Container onClick={onShowClick} width="fit" height="fit" style={{ cursor: 'pointer'}}>
				<Icon icon={show ? "Eye" : "EyeOff"} size="large" color={active ? 'txt_2' : 'txt_4'} />
			</Container>
			<InputUnderline color={active ? 'bd_2' : borderColor} />
			<Label
				htmlFor={label}
				active={active || (comboRef.current && comboRef.current.value !== '')}
				style={{userSelect: 'none'}}
			>
				{label}
			</Label>
		</Container>
	);
}

PasswordInput.propTypes = Input.PropTypes;

PasswordInput.defaultProps = Input.defaultProps;

PasswordInput._newId = 0;

export { Input, PasswordInput };
