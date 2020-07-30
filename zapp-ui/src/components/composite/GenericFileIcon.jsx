import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Text from '../basic/Text';
import defaultTheme from '../../theme/Theme';

const Comp = styled.div`
	width: ${({theme, size}) => theme.sizes.icon[size]};
	height: ${({theme, size}) => theme.sizes.icon[size]};
	color: ${({theme, color}) => theme.palette[color].regular};
	background: ${({theme, bgColor}) => theme.palette[bgColor].regular};
	border-radius: 2px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
`;

const GenericFileIcon = React.forwardRef(function({ fileName, color, ...rest }, ref) {
	const ext = fileName.split('.').pop();
	return (
		<Comp ref={ref} color={color} {...rest}>
			<Text color={color} size="small">
				{ ext ? ext.toUpperCase() : null }
			</Text>
		</Comp>
	);
});

GenericFileIcon.propTypes = {
	fileName: PropTypes.string,
	size: PropTypes.oneOf(Object.keys(defaultTheme.sizes.icon)),
	color: PropTypes.oneOf(Object.keys(defaultTheme.palette.light)),
	bgColor: PropTypes.oneOf(Object.keys(defaultTheme.palette.light))
};

GenericFileIcon.defaultProps = {
	color: 'gray6',
	bgColor: 'primary',
	size: 'large'
};

export default GenericFileIcon;
