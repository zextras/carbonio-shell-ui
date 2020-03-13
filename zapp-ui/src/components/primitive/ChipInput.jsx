import React, { useState, useEffect, useRef, useReducer } from 'react';
import { map, filter, slice } from 'lodash';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Chip from "./Chip";
import Text from "./Text";


const Placeholder = styled(Text)`
	position: absolute;
	top: 50%;
	left: 0;
	transform: translateY(-50%);
	transition: transform 150ms ease-out, font-size 150ms ease-out, top 150ms ease-out;
	font-size: ${props => props.theme.sizes.font.medium};
	color: ${props => props.theme.colors.text.txt_4};
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
	&.active {
		${Placeholder} {
			top: 3px;
			transform: translateY(0);
			font-size: ${props => props.theme.sizes.font.small};
		}
	}
	&.hasFocus {
		${Placeholder} {
			color: ${props => props.theme.colors.text.txt_2};
		}
	}
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

function ChipInput({ placeholder, value, onChange, ...rest }) {
	const [contacts, dispatch] = useReducer(reducer, value);
	const [active, setActive] = useState(false);
	const [hasFocus, setHasFocus] = useState(false);
	const contentEditableInput = useRef(null);

	const classes = [active ? 'active' : '', hasFocus ? 'hasFocus' : ''];

	function saveCurrentValue() {
		const inputValue = contentEditableInput.current.textContent;
		if (inputValue.length) {
			dispatch({ type: 'push', contact: {value: inputValue} });
			contentEditableInput.current.innerHTML = '';
		}
	}

	function onKeyDown(e) {
		if (e.code === 'Space' || e.code === 'Enter') {
			e.preventDefault();
			saveCurrentValue();
		}
		else if (e.code === 'Backspace') {
			const cursorPosition = window.getSelection().getRangeAt(0).startOffset;
			if (cursorPosition === 0) {
				e.preventDefault();
				dispatch({ type: 'popLast' });
				return false;
			}
		}
	}
	function onFocus() {
		checkIfSetActive();
		setHasFocus(true);
	}
	function onBlur() {
		checkIfSetActive();
		saveCurrentValue();
		setHasFocus(false);
	}
	function onChipClose(index) {
		dispatch({ type: 'pop', index });
		contentEditableInput.current.focus();
	}

	function checkIfSetActive() {
		setActive(contacts.length || document.activeElement === contentEditableInput.current || contentEditableInput.current.textContent.length);
	}

	useEffect(() => {
		dispatch({type: 'reset', value});
	}, [value]);

	useEffect(() => {
		checkIfSetActive();
		onChange(contacts);
	}, [contacts]);

	useEffect(() => {
		contentEditableInput.current.addEventListener('keydown', onKeyDown);
		return () => contentEditableInput.current.removeEventListener('keydown', onKeyDown);
	}, []);

	return (
		<ChipInputContainer { ...rest } className={classes.join(' ')} tabindex={0} onClick={() => contentEditableInput.current.focus()}>
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
}

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
