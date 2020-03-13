import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Text from "./Text";

const PlaceholderInline = styled(Text)`
	font-size: ${props => props.theme.sizes.font.medium};
	color: ${props => props.theme.colors.text.txt_4};
	user-select: none;
`;
const PlaceholderDefault = styled(PlaceholderInline)`
	position: absolute;
	top: 50%;
	left: 0;
	transform: translateY(-50%);
	transition: transform 150ms ease-out, font-size 150ms ease-out, top 150ms ease-out;
`;
const EmailComposerInputContainer = styled.div`
	width: 100%;
	padding: ${props => `${props.theme.sizes.padding.extrasmall} ${props.theme.sizes.padding.large}` };
	box-sizing: border-box;
	cursor: text;

	&:focus {
		outline: 1px solid #eee;
	}
	&.active {
		${PlaceholderDefault} {
			top: 3px;
			font-size: ${props => props.theme.sizes.font.small};
			transform: translateY(0);
		}
	}
	&.hasFocus {
		${PlaceholderDefault},
		${PlaceholderInline} {
			color: ${props => props.theme.colors.text.txt_2};
		}
	}
`;
const EmailComposerInputWrapper = styled.div`
	position: relative;
	display: flex;
	align-items: center;
	flex-wrap: ${props => props.placeholderType === 'default' ? 'wrap' : 'nowrap'};
	padding: ${props => props.placeholderType === 'default' ?
		`${props.theme.sizes.avatar.small.diameter} 0 0`
		:
		`calc(${props.theme.sizes.avatar.small.diameter} / 2) 0 calc(${props.theme.sizes.avatar.small.diameter} / 2)`};
	
	> div {
		margin: calc(${props => props.theme.sizes.padding.extrasmall} / 2);
		margin-left: ${props => props.placeholderType === 'default' ? '0' : props.theme.sizes.padding.medium};
	}
`;
const InputContainer = styled.div`
	flex-grow: 1;
	flex-basis: 0;
	max-width: 100%;
  font-family: 'Roboto',sans-serif;
  overflow: hidden;

	> input{
		width: 100%;
		height: ${props => `calc(${props.theme.sizes.avatar.small.diameter} + ${props.theme.sizes.padding.extrasmall} * 2)`};
		margin: 0;
		border: none;
		font-size: ${props => props.theme.sizes.font.medium};
		line-height: ${props => `calc(${props.theme.sizes.avatar.small.diameter} + ${props.theme.sizes.padding.extrasmall} * 2)`};

		&:focus{
			outline: none;
		}
	}
`;

function EmailComposerInput({ placeholder, placeholderType, value, onChange, ...rest }) {
	const [active, setActive] = useState(false);
	const [hasFocus, setHasFocus] = useState(false);
	const inputRef = useRef(null);

	const classes = [active ? 'active' : '', hasFocus ? 'hasFocus' : ''];

	function checkIfSetActive() {
		setActive(document.activeElement === inputRef.current || inputRef.current.value);
	}
	function onFocus() {
		checkIfSetActive();
		setHasFocus(true);
	}
	function onBlur() {
		checkIfSetActive();
		setHasFocus(false);
	}
	useEffect(() => {
		checkIfSetActive();
	});

	return (
		<EmailComposerInputContainer { ...rest } className={classes.join(' ')} tabindex={0} onClick={() => inputRef.current.focus()}>
			<EmailComposerInputWrapper placeholderType={placeholderType}>
				{ placeholderType === 'inline' ? (
					<PlaceholderInline>{ placeholder }</PlaceholderInline>
				) : (
					<PlaceholderDefault>{ placeholder }</PlaceholderDefault>
				)}
				<InputContainer>
					<input ref={inputRef} onFocus={onFocus} onBlur={onBlur} onChange={onChange} value={value} />
				</InputContainer>
			</EmailComposerInputWrapper>
		</EmailComposerInputContainer>
	);
}

EmailComposerInput.propTypes = {
	/** Input's Placeholder */
	placeholder: PropTypes.string,
	/** Placeholder Type */
	placeholderType: PropTypes.oneOf(['default', 'inline']),
	/** Input's value */
	value: PropTypes.string,
	/** Callback to call when Input's value changes */
	onChange: PropTypes.func
};

EmailComposerInput.defaultProps = {
	placeholder: '',
	placeholderType: 'default',
	onChange: () => {}
};

export default EmailComposerInput;
