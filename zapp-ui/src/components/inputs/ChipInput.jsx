import React, { useState, useEffect, useRef, useReducer, useCallback, useMemo } from 'react';
import { map, filter, slice } from 'lodash';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import Chip from '../display/Chip';
import Text from '../basic/Text';
import useKeyboard, { getKeyboardPreset } from '../../hooks/useKeyboard';

const Placeholder = styled(Text)`
	position: absolute;
	top: 50%;
	left: 0;
	transform: translateY(-50%);
	transition: transform 150ms ease-out, font-size 150ms ease-out, top 150ms ease-out;
	font-size: ${props => props.theme.sizes.font.medium};
	color: ${({theme}) => theme.palette.secondary.regular};
	user-select: none;
`;
const ChipInputContainer = styled.div`
	width: 100%;
	padding: ${props => `${props.theme.sizes.padding.extrasmall} ${props.theme.sizes.padding.large}` };
	box-sizing: border-box;
	cursor: text;

	&:focus {
		outline: 1px solid #eee;
	}
	${(props) => props.active && css`
		${Placeholder} {
			top: 3px;
			transform: translateY(0);
			font-size: ${props => props.theme.sizes.font.small};
		}
	`};
	${(props) => props.hasFocus && css`
		${Placeholder} {
			color: ${({theme}) => theme.palette.primary.regular};
		}
	`};
`;
const ChipInputWrapper = styled.div`
	position: relative;
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	padding: ${props => props.theme.sizes.avatar.small.diameter} 0 0;
	
	> div {
		margin: calc(${props => props.theme.sizes.padding.extrasmall} / 2);
		margin-left: 0;
	}
`;
const InputContainer = styled.div`
	flex-grow: 1;
	max-width: 100%;
	font-family: 'Roboto',sans-serif;
	color: ${({theme}) => theme.palette.text.regular};
	overflow: hidden;

	> div{
		min-height: ${props => `calc(${props.theme.sizes.avatar.small.diameter} + ${props.theme.sizes.padding.extrasmall} * 2)`};
		font-size: ${props => props.theme.sizes.font.medium};
		line-height: ${props => `calc(${props.theme.sizes.avatar.small.diameter} + ${props.theme.sizes.padding.extrasmall} * 2)`};
 	
		&:focus{
			outline: none;
		}
	}
`;

function reducer(state, action) {
	switch (action.type) {
		case 'push':
			return [...state, action.contact];
		case 'pop':
			return filter(state, (value, index) => action.index !== index);
		case 'popLast':
			return slice(state, 0, state.length - 1);
		case 'reset':
			return action.value;
		default:
			throw new Error();
	}
}

const ChipInput = React.forwardRef(function({ placeholder, value, onChange, ...rest }, ref) {
	const [contacts, dispatch] = useReducer(reducer, value);
	const [active, setActive] = useState(false);
	const [hasFocus, setHasFocus] = useState(false);
	const contentEditableInput = useRef(undefined);

	const saveCurrentValue = useCallback(() => {
		const inputValue = contentEditableInput.current.textContent;
		if (inputValue.length) {
			dispatch({ type: 'push', contact: {value: inputValue} });
			contentEditableInput.current.innerHTML = '';
		}
	}, [contentEditableInput]);

	const onBackspace = useCallback((e) => {
		const cursorPosition = window.getSelection().getRangeAt(0).startOffset;
		if (cursorPosition === 0) {
			e.preventDefault();
			dispatch({ type: 'popLast' });
			return false;
		}
	}, []);

	const checkIfSetActive = useCallback(() => {
		setActive(contacts.length || document.activeElement === contentEditableInput.current || contentEditableInput.current.textContent.length);
	}, [contacts, setActive, contentEditableInput]);

	const onFocus = useCallback(() => {
		checkIfSetActive();
		setHasFocus(true);
	}, [checkIfSetActive, setHasFocus]);

	const onBlur = useCallback(() => {
		checkIfSetActive();
		saveCurrentValue();
		setHasFocus(false);
	}, [checkIfSetActive, saveCurrentValue, setHasFocus]);

	const onChipClose = useCallback((index) => {
		dispatch({ type: 'pop', index });
		contentEditableInput.current.focus();
	}, [contentEditableInput]);

	const saveCurrentEvent = useMemo(() => getKeyboardPreset('button', saveCurrentValue), [saveCurrentValue]);
	useKeyboard(contentEditableInput, saveCurrentEvent);

	const backspaceEvent = useMemo(() => [{ type: 'keydown', callback: onBackspace, keys: ['Backspace'], haveToPreventDefault: false }], [onBackspace]);
	useKeyboard(contentEditableInput, backspaceEvent);

	useEffect(() => {
		dispatch({type: 'reset', value});
	}, [value]);

	useEffect(() => {
		checkIfSetActive();
		onChange(contacts);
	}, [contacts]);

	const setFocus = useCallback(() => contentEditableInput.current.focus(), []);

	return (
		<ChipInputContainer ref={ref} { ...rest } tabindex={0} active={active} hasFocus={hasFocus} onClick={setFocus}>
			<ChipInputWrapper>
				<Placeholder>{ placeholder }</Placeholder>
				{ map(contacts, (contact, index) => (
					<Chip key={`${index}-${contact.value}`} label={contact.value} closable={true} onClose={() => onChipClose(index)} />
				)) }

				<InputContainer>
					<div contentEditable={true} ref={contentEditableInput} onFocus={onFocus} onBlur={onBlur}></div>
				</InputContainer>
			</ChipInputWrapper>
		</ChipInputContainer>
	);
});

ChipInput.propTypes = {
	/** Input's Placeholder */
	placeholder: PropTypes.string,
	/** Input's value */
	value: PropTypes.arrayOf(PropTypes.shape({
		value: PropTypes.string.isRequired,
		picture: PropTypes.string
	})),
	/** Callback to call when Input's value changes */
	onChange: PropTypes.func
};

ChipInput.defaultProps = {
	placeholder: '',
	value: [],
	onChange: () => {}
};

export default ChipInput;
