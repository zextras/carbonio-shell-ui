import React, { useState, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Container from '../layout/Container';
import Icon from '../basic/Icon';
import { useCombinedRefs } from '../../hooks/useCombinedRefs';

const InputEl = styled.input`
	border: none;
	width: 100%;
	outline: 0;
	font-size: ${({theme}) => theme.sizes.font['medium']};
	font-weight: ${({theme}) => theme.fonts.weight['regular']};
	font-family: ${({theme}) => theme.fonts.default};
`;

const Label = styled.label`
	position: absolute;
	left: calc(${({theme}) => theme.sizes.padding['large']} + ${({theme}) => theme.sizes.icon['large']} + 2px);
	font-size: ${({theme}) => theme.sizes.font['medium']};
	font-weight: ${({theme}) => theme.fonts.weight['regular']};
	font-family: ${({theme}) => theme.fonts.default};
	color: ${({theme}) => theme.palette.secondary.regular};
	display: ${({active}) => active ? 'none' : 'block'};
`;

const SearchInput = React.forwardRef(function({
	inputRef,
	onChange
}, ref) {

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
			ref={ref}
			orientation="horizontal"
			width="fill"
			height="fit"
			borderRadius="half"
			background="gray6"
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
				<Icon icon="Search" size="large" color={active ? 'primary' : 'secondary'} />
			</Container>
			<InputEl ref={comboRef} type="text" onBlur={onInputBlur} id={'search'} name={'search'} onChange={onChange} />
			<Container width="fit" height="fit" style={{ cursor: 'pointer'}} mainAlignment="center">
				<Icon icon="ArrowDown" size="large" color={active ? 'primary' : 'secondary'} />
			</Container>
		</Container>
	);
});

SearchInput.propTypes = {
	onChange: PropTypes.func,
	inputRef: PropTypes.object,
};

export default SearchInput;
