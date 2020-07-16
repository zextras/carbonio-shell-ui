import React, { useRef, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import Container from '../layout/Container';
import Icon from '../basic/Icon';
import useKeyboard, { getKeyboardPreset } from '../../hooks/useKeyboard';
import { useCombinedRefs } from '../../hooks/useCombinedRefs';
import defaultTheme from '../../theme/Theme';
import { pseudoClasses } from '../utilities/functions';

function getSizing(size) {
	switch (size) {
		case 'small':
			return { iconSize: 'medium', paddingSize: 'extrasmall'};
		case 'medium':
			return { iconSize: 'large', paddingSize: 'small'};
		case 'large':
			return { iconSize: 'large', paddingSize: 'medium'};
	}
}

const ContainerEl = styled(Container)`
	${(props) => props.disabled && css`
		pointer-events: none;
		background: ${({theme, background}) => theme.palette[background || 'transparent'].disabled};
	`};
	${({theme, background, disabled}) => !disabled && pseudoClasses(theme, background || 'transparent')};
`;

const IconButton = React.forwardRef(function({
	iconColor,
	backgroundColor,
	disabled,
	customSize,
	size,
	icon,
	borderRadius,
	onClick,
	...rest
}, ref) {
	const innerRef = useRef(undefined);
	const iconButtonRef = useCombinedRefs(ref, innerRef);

	const { iconSize, paddingSize } = useMemo(() => {
		return customSize ? {
			iconSize: customSize.iconSize,
			paddingSize: customSize.paddingSize
		} : getSizing(size);
	}, [customSize, size]);

	const handleClick = useCallback((e) => !disabled && onClick(e), [disabled, onClick]);
	const keyEvents = useMemo(() => getKeyboardPreset('button', handleClick), [handleClick]);
	useKeyboard(iconButtonRef, keyEvents);

	return (
		<ContainerEl
			ref={iconButtonRef}
			width="fit"
			height="fit"
			borderRadius={borderRadius}
			background={backgroundColor}
			disabled={disabled}
			style={{cursor: disabled ? 'default' : 'pointer', userSelect: 'none'}}
			padding={paddingSize !== 0 ? {
				all: paddingSize
			} : {}}
			crossAlignment="center"
			onClick={handleClick}
			{...rest}
			tabIndex={disabled ? -1 : 0}
		>
			<Icon icon={icon} size={iconSize} color={iconColor} disabled={disabled} />
		</ContainerEl>
	);
});

IconButton.propTypes = {
	/** Color of the icon */
	iconColor: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.oneOf(Object.keys(defaultTheme.palette.light))
	]),
	// borderColor: PropTypes.oneOf(),
	/** Color of the button */
	backgroundColor: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.oneOf(Object.keys(defaultTheme.palette.light))
	]),
	/** whether to disable the IconButton or not */
	disabled: PropTypes.bool,
	/** button size */
	size: PropTypes.oneOf(['small', 'medium', 'large']),
	/** Custom button size */
	customSize: PropTypes.object,
	/** icon name */
	icon: PropTypes.string.isRequired,
	/** IconButton border radius */
	borderRadius: PropTypes.oneOf(['regular', 'round']),
};

IconButton.defaultProps = {
	iconColor: 'text',
	size: 'medium',
	borderRadius: 'regular',
	disabled: false
};

export default IconButton;
