import React, {useState, useEffect, useRef, useCallback} from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import Text from '../basic/Text';

const PlaceholderInline = styled(Text)`
	font-size: ${props => props.theme.sizes.font.medium};
	color: ${({theme}) => theme.palette.secondary.regular};
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
	${({theme, disabled}) => !disabled && css`
		transition: background 0.2s ease-out;
		&:focus {
			outline: none;
			background: ${theme.palette.gray6.focus};
			& input {
				background: ${theme.palette.gray6.focus};
			}
		}
		&:hover {
			outline: none;
			background: ${theme.palette.gray6.hover};
			& input {
				background: ${theme.palette.gray6.hover};
			}
		}
		&:active {
			outline: none;
			background: ${theme.palette.gray6.active};
			& input {
				background: ${theme.palette.gray6.active};
			}
		}
	`};
	${(props) => props.active && css`
		${PlaceholderDefault} {
			top: 3px;
			font-size: ${props => props.theme.sizes.font.small};
			transform: translateY(0);
		}
	`};
	${(props) => props.hasFocus && css`
		${PlaceholderDefault},
		${PlaceholderInline} {
			color: ${({theme}) => theme.palette.primary.regular};
		}
	`};
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

const EmailComposerInput = React.forwardRef(function({ placeholder, placeholderType, value, onChange, ...rest }, ref) {
	const [active, setActive] = useState(false);
	const [hasFocus, setHasFocus] = useState(false);
	const inputRef = useRef(undefined);

	const checkIfSetActive = useCallback(() => {
		setActive(window.top.document.activeElement === inputRef.current || inputRef.current.value);
	}, [setActive, inputRef]);

	const onFocus = useCallback(() => {
		checkIfSetActive();
		setHasFocus(true);
	}, [checkIfSetActive, setHasFocus]);

	const onBlur = useCallback(() => {
		checkIfSetActive();
		setHasFocus(false);
	}, [checkIfSetActive, setHasFocus]);

	const setFocus = useCallback(() => inputRef.current.focus(), [inputRef]);

	useEffect(() => {
		checkIfSetActive();
	});

	return (
		<EmailComposerInputContainer ref={ref} { ...rest } tabindex={0} active={active} hasFocus={hasFocus} onClick={setFocus}>
			<EmailComposerInputWrapper placeholderType={placeholderType}>
				{ placeholderType === 'inline' ? (
					<PlaceholderInline>{ placeholder }</PlaceholderInline>
				) : (
					<PlaceholderDefault>{ placeholder }</PlaceholderDefault>
				)}
				<InputContainer>
					<input
						style={{ transition: 'background 0.2s ease-out'}}
						ref={inputRef}
						onFocus={onFocus}
						onBlur={onBlur}
						onChange={onChange}
						value={value}
					/>
				</InputContainer>
			</EmailComposerInputWrapper>
		</EmailComposerInputContainer>
	);
});

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
