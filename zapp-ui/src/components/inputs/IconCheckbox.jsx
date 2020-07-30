import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import Container from '../layout/Container';
import Icon from '../basic/Icon';
import Text from '../basic/Text';
import Padding from '../layout/Padding';
import useKeyboard, { getKeyboardPreset } from '../../hooks/useKeyboard';
import { useCombinedRefs } from '../../hooks/useCombinedRefs';
import defaultTheme from '../../theme/Theme';

const IconWrapper = styled.div`
	border-radius: ${(props) => props.borderRadius === 'regular' ? props.theme.borderRadius : '50%'};
	background: ${({theme, isActive}) => isActive ? theme.palette.primary.regular : 'transparent'};
	transition: 0.2s ease-out;
	
	${({disabled}) => disabled && css`
		pointer-events: none;
		background: ${({theme, isActive}) => theme.palette[isActive ? 'primary' : 'transparent'].disabled};
	`};
	svg{
		transition: 0.2s ease-out;
		fill: ${({theme, isActive}) => isActive ? theme.palette.gray6.regular : 'currentColor'};
	};
	${({theme, isActive}) => css`
		transition: background 0.2s ease-out;
		&:focus {
			outline: none;
			background: ${theme.palette[isActive ? 'primary' : 'transparent'].focus};
			svg{
				fill: ${({theme, isActive}) => isActive
				? theme.palette.gray6.focus
				: theme.palette.primary.focus};
			}
		}
		&:hover {
			outline: none;
			background: ${theme.palette[isActive ? 'primary' : 'transparent'].hover};
			svg{
				fill: ${({theme, isActive}) => isActive
				? theme.palette.gray6.hover
				: theme.palette.primary.hover};
			}
		}
		&:active {
			outline: none;
			background: ${theme.palette[isActive ? 'primary' : 'transparent'].active};
		}
	`};
`;

const padding = {
	'small': 'extrasmall',
	'regular': 'small',
	'large': 'medium'
};

const IconCheckbox = React.forwardRef(function({
	defaultChecked,
	label,
	borderRadius,
	disabled,
	icon,
	size,
	margin,
	value,
	onChange
}, ref) {
	const [checked, setChecked] = useState(value || defaultChecked || false);
	const checkedRef = useRef(defaultChecked);

	const innerRef = useRef(undefined);
	const iconCheckboxRef = useCombinedRefs(ref, innerRef);

	const iconSize = useMemo(() => size === 'small' ? 'medium' : 'large', [size]);

	const uncontrolledMode = useMemo(() => typeof value === 'undefined', [value]);
	const handleClick = useCallback(() => {
		if (!disabled) {
			if (uncontrolledMode) {
				setChecked((c) => !c);
			}

			if (onChange) {
				onChange(!checkedRef.current);
			}
		}
	}, [disabled, uncontrolledMode, onChange]);
	const keyEvents = useMemo(() => getKeyboardPreset('button', handleClick), [handleClick]);
	useKeyboard(iconCheckboxRef, keyEvents);

	useEffect(() => {
		typeof value !== 'undefined' && setChecked(value);
	}, [value]);

	useEffect(() => {
		checkedRef.current = checked;
	}, [checked]);

	return (
		<Container
			orientation="horizontal"
			width="fit"
			height="fit"
			padding={{horizontal: margin}}
			style={{cursor: disabled ? 'default' : 'pointer'}}
			onClick={handleClick}
			crossAlignment="center"
		>
			<IconWrapper
				ref={iconCheckboxRef}
				isActive={checked}
				borderRadius={borderRadius}
				disabled={disabled}
				tabIndex={disabled ? -1 : 0}
			>
				<Padding all={padding[size]}>
					<Icon size={iconSize} icon={icon} />
				</Padding>
			</IconWrapper>
			{label && <Text size="medium" weight="regular" style={{whiteSpace: 'normal', paddingLeft: defaultTheme.sizes.padding.small, userSelect: 'none'}}>{label}</Text>}
		</Container>
	);
});

IconCheckbox.propTypes = {
	/** Status of the IconCheckbox */
	defaultChecked: PropTypes.bool,
	/** IconCheckbox text */
	label: PropTypes.string,
	/** IconCheckbox radius */
	borderRadius: PropTypes.oneOf(['regular', 'round']),
	/** whether to disable the IconCheckbox or not */
	disabled: PropTypes.bool,
	/** IconCheckbox icon */
	icon: PropTypes.string.isRequired,
	/** IconCheckbox size */
	size: PropTypes.oneOf(['small', 'regular', 'large']),
	/** IconCheckbox margin */
	margin: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.oneOf(Object.keys(defaultTheme.sizes.padding))
	]),
	/** IconCheckbox value */
	value: PropTypes.bool,
	/** change callback */
	onChange: function(props, propName) {
		if (typeof props['value'] !== 'undefined' && typeof props[propName] !== 'function') {
			return new Error('Please provide a onChange function!');
		}
	}
};

IconCheckbox.defaultProps = {
	borderRadius: 'round',
	disabled: false,
	size: 'regular',
	margin: 'extrasmall'
};

export default IconCheckbox;
