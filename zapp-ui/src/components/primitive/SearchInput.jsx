import React, { useState, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Container from './Container';
import Icon from './Icon';
import { useCombinedRefs } from '../../hooks/useCombinedRefs';

const InputEl = styled.input`
	border: none;
	width: 100%;
	outline: 0;
	font-size: ${props => props.theme.sizes.font['medium']};
	font-weight: ${props => props.theme.fonts.weight['regular']};
	font-family: ${props => props.theme.fonts.default};
`;

const Label = styled.label`
	position: absolute;
	left: calc(${props => props.theme.sizes.padding['large']} + ${props => props.theme.sizes.icon['large']} + 2px);
	font-size: ${props => props.theme.sizes.font['medium']};
	font-weight: ${props => props.theme.fonts.weight['regular']};
	font-family: ${props => props.theme.fonts.default};
	color: ${props => props.theme.colors.text['txt_4']};
	display: ${props => props.active ? 'none' : 'block'};
`;

function SearchInput({
	inputRef,
	onChange
}) {

	const [active, setActive] = useState(false);
	const innerRef = useRef();
	const comboRef = !!inputRef ? useCombinedRefs(inputRef, innerRef) : innerRef;

	const onInputFocus = useCallback(() => {
		setActive(true);
		comboRef.current.focus()
	}, [setActive, comboRef]);

	const onInputBlur = useCallback(
		() => setActive(false),
	[setActive]);
	return (
		<Container
			orientation="horizontal"
			width="fill"
			height="fit"
			borderRadius="half"
			background="bg_7"
			mainAlignment="baseline"
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
			<Label htmlFor={'search'} active={active || (comboRef.current && comboRef.current.value !== '')}>
				Search
			</Label>
			<Container width="fit" height="fit" padding={{ right: 'small' }} style={{ cursor: 'pointer'}}>
				<Icon icon="Search" size="large" color={active ? 'txt_2' : 'txt_4'} />
			</Container>
			<InputEl ref={comboRef} type="text" onBlur={onInputBlur} id={'search'} name={'search'} onChange={onChange} />
			<Container width="fit" height="fit" style={{ cursor: 'pointer'}} mainAlignment="center">
				<Icon icon="ArrowDown" size="large" color={active ? 'txt_2' : 'txt_4'} />
			</Container>
		</Container>
	);
}

SearchInput.propTypes = {
	onChange: PropTypes.func,
	inputRef: PropTypes.object,
};

export default SearchInput;
