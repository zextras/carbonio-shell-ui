import React from 'react';
import PropTypes from 'prop-types';
import styled from "styled-components";
import Container from "./Container";
import Icon from "./Icon";
import Text from "./Text";
import defaultTheme from '../../theme/Theme';

const ContainerEl = styled(Container)`
	&:focus{
		outline: 1px solid #eee;
	}
`;

const Button = ({
	children,
	labelColor,
	backgroundColor,
	label,
	size,
	icon,
	...rest
}) => {
	return (
		<ContainerEl
			orientation="horizontal"
			width={size}
			height="fit"
			borderRadius="regular"
			background={backgroundColor}
			style={{ cursor: 'pointer'}}
			padding={{
				vertical: 'small',
				horizontal: 'large'
			}}
			crossAlignment="center"
			{...rest}
			tabIndex={0}
		>
			<Text size="large" color={labelColor} weight="regular" style={{userSelect: 'none'}}>{label.toUpperCase()}</Text>
			{ icon &&
				<Container width="fit" height="fit" padding={{left: 'small'}}>
					<Icon icon={icon} size="medium" color={labelColor} />
				</Container> }
		</ContainerEl>
	);
};

Button.propTypes = {
	/** Color of the Button label */
	labelColor: PropTypes.oneOf(Object.keys(defaultTheme.colors.text)),
	// borderColor: PropTypes.oneOf(Object.keys(defaultTheme.colors.border)),
	/** Color of the Button background */
	backgroundColor: PropTypes.oneOf(Object.keys(defaultTheme.colors.background)),
	/** Button text */
	label: PropTypes.string.isRequired,
	/** `fit`: assume the size of the content
	 * 
	 *  `fill`: take the width of the container
	 */
	size: PropTypes.oneOf(['fit', 'fill']),
	/** optional icon to display beside the label */
	icon: PropTypes.string
};

Button.defaultProps = {
	labelColor: 'txt_3',
	backgroundColor : 'bg_1',
	size: 'fit'
};

export default Button;
