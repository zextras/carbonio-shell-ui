import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import Container from "../layout/Container";
import Icon from '../basic/Icon';
import Text from '../basic/Text';
import Padding from '../layout/Padding';
import useKeyboard, { getKeyboardPreset } from '../../hooks/useKeyboard';
import { useCombinedRefs } from '../../hooks/useCombinedRefs';
import { pseudoClasses } from '../utilities/functions';

const IconWrapper = styled.div`
	${(props) => props.disabled && css`
		pointer-events: none;
		opacity: 0.3;
	`};
	${({theme}) => pseudoClasses(theme, 'transparent')};
`;

const Checkbox = React.forwardRef(function({
	defaultChecked,
	value,
	label,
	iconSize,
	iconColor,
	padding,
	disabled,
	onClick,
	onChange,
	...rest
}, ref) {
	const [checked, setChecked] = useState(value || defaultChecked || false);
	const innerRef = useRef(undefined);
	const ckbRef = useCombinedRefs(ref, innerRef);

	const uncontrolledMode = useMemo(() => typeof value === 'undefined', [value]);
	const handleClick = useCallback(() => {
		if (!disabled) {
			if (uncontrolledMode) {
				setChecked((checked) => !checked);
			}
			if (onClick) {
				onClick();
			}
		}
	}, [disabled, uncontrolledMode, onClick]);

	const keyEvents = useMemo(() => getKeyboardPreset('button', handleClick), [handleClick]);
	useKeyboard(ckbRef, keyEvents);

	useEffect(() => {
		typeof value !== 'undefined' && setChecked(value);
	}, [value]);

	useEffect(() => {
		onChange && onChange(checked);
	}, [onChange, checked]);

	return (
		<Container
			ref={ckbRef}
			orientation="horizontal"
			width="fit"
			height="fit"
			padding={padding ? padding : undefined}
			style={{ cursor: disabled ? 'default' : 'pointer' }}
			onClick={handleClick}
			crossAlignment="center"
			{...rest}
		>
			<IconWrapper disabled={disabled} tabIndex={disabled ? -1 : 0}>
				<Icon size={iconSize} icon={checked ? 'CheckmarkSquare' : 'Square'} color={iconColor} />
			</IconWrapper>
		{label && <Padding left="small"><Text size="medium" weight="regular" overflow="break-word" style={{userSelect: 'none'}}>{label}</Text></Padding>}
		</Container>
	);
});

Checkbox.propTypes = {
	/** status of the Checkbox */
	defaultChecked: PropTypes.bool,
	/** Checkbox value */
	value: PropTypes.bool,
	/** Checkbox size */
	iconSize: Icon.propTypes.size,
	/** Checkbox color */
	iconColor: Icon.propTypes.color,
	/** Checkbox text */
	label: PropTypes.string,
	/** Checkbox padding */
	padding: Container.propTypes.padding,
	/** whether to disable the checkbox or not */
	disabled: PropTypes.bool,
	/** click callback */
	onClick: PropTypes.func,
	/** change callback */
	onChange: PropTypes.func
};

Checkbox.defaultProps = {
	disabled: false,
	iconSize: 'large',
	iconColor: 'text'
};

export default Checkbox;
