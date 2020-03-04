import React from 'react';
import PropTypes from 'prop-types';
import styled from "styled-components";
import Container from './Container';
import Icon from './Icon';
import defaultTheme from '../../theme/Theme'

const getSizing = (size) => {
	switch (size) {
		case 'small':
			return { iconSize: 'medium', paddingSize: 'extrasmall'};
		case 'medium':
			return { iconSize: 'large', paddingSize: 'small'};
		case 'large':
			return { iconSize: 'large', paddingSize: 'medium'};
	}
};

const ContainerEl = styled(Container)`
	&:focus{
		outline: 1px solid #eee;
	}
`;

const IconButton = ({
	iconColor,
	backgroundColor,
	size,
	icon,
	...rest
}) => {
	const { iconSize, paddingSize } = getSizing(size);
	return (
		<ContainerEl
			width="fit"
			height="fit"
			borderRadius="regular"
			background={backgroundColor}
			style={{cursor: 'pointer', userSelect: 'none'}}
			padding={{
				all: paddingSize
			}}
			crossAlignment="center"
			{...rest}
			tabIndex={0}
		>
			<Icon icon={icon} size={iconSize} color={iconColor} />
		</ContainerEl>
	);
};

IconButton.propTypes = {
	/** Color of the icon */
	iconColor: PropTypes.oneOf(Object.keys(defaultTheme.colors.text)),
	// borderColor: PropTypes.oneOf(),
	/** Color of the button */
	backgroundColor: PropTypes.oneOf(Object.keys(defaultTheme.colors.background)),
	/** button size */
	size: PropTypes.oneOf(['small', 'medium', 'large']),
	/** icon name */
	icon: PropTypes.string.isRequired
};

IconButton.defaultProps = {
	iconColor: 'txt_1',
	size: 'medium'
};

export default IconButton;
