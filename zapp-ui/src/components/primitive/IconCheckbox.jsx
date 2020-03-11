import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Container from './Container';
import Icon from './Icon';
import Text from './Text';
import Padding from './Padding';
import defaultTheme from '../../theme/Theme';

const IconWrapper = styled.div`
	border-radius: ${(props) => props.borderRadius === 'regular' ? props.theme.borderRadius : '50%'};
	background-color: ${(props) => props.isActive ? props.theme.colors.background.bg_1 : 'transparent'};
	transition: 0.2s ease-out;
	
	svg{
		transition: 0.2s ease-out;
		fill: ${(props) => props.isActive ? props.theme.colors.text.txt_3 : 'currentColor'};
	}
	&:hover,
	&:focus{
		background-color: ${(props) => props.isActive ? props.theme.colors.hover.hv_1 : props.theme.colors.background.bg_8};
		
		svg{
			fill: ${(props) => props.isActive ? props.theme.colors.text.txt_3 : props.theme.colors.background.bg_3};
		}
	}
	&:focus{
		outline: none;
	}
`;

function IconCheckbox({
	defaultChecked,
	label,
	borderRadius,
	icon,
	size,
	margin,
	onChange
}) {
	const [checked, setChecked] = useState(defaultChecked);

	const padding = {'small': 'extrasmall', 'regular': 'small', 'large': 'medium'};
	const iconSize = size === 'small' ? 'medium' : 'large';

	return (
		<Container
			orientation="horizontal"
			width="fit"
			height="fit"
			padding={{horizontal: margin}}
			style={{cursor: 'pointer'}}
			onClick={() => {
				setChecked(!checked);
				if (onChange) {
					onChange(!checked);
				}
			}}
			crossAlignment="center"
		>
			<IconWrapper isActive={checked} borderRadius={borderRadius} tabIndex={0}>
				<Padding all={padding[size]}>
					<Icon size={iconSize} icon={icon} style={{display: 'block'}}/>
				</Padding>
			</IconWrapper>
			{label && <Text size="medium" weight="regular" style={{whiteSpace: 'normal', paddingLeft: defaultTheme.sizes.padding.small, userSelect: 'none'}}>{label}</Text>}
		</Container>
	);
}
// checked ? 'CheckmarkSquare' : 'Square'
IconCheckbox.propTypes = {
	/** Status of the IconCheckbox */
	defaultChecked: PropTypes.bool,
	/** IconCheckbox text */
	label: PropTypes.string,
	/** IconCheckbox radius */
	borderRadius: PropTypes.oneOf(['regular', 'round']),
	/** IconCheckbox icon */
	icon: PropTypes.string.isRequired,
	/** IconCheckbox size */
	size: PropTypes.oneOf(['small', 'regular', 'large']),
	/** IconCheckbox margin */
	margin: PropTypes.oneOf(Object.keys(defaultTheme.sizes.padding)),
	/** change callback */
	onChange: PropTypes.func
};

IconCheckbox.defaultProps = {
	borderRadius: 'round',
	size: 'regular',
	margin: 'extrasmall'
};

export default IconCheckbox;
