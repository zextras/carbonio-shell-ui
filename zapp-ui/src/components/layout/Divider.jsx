import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import defaultTheme from '../../theme/Theme';

const DividerEl = styled.div`
		background: ${({theme, color}) => color ? theme.palette[color].regular : theme.palette.gray2.regular};
		height: 1px;
		width: 100%;
`;

const Divider = React.forwardRef(function({ ...rest }, ref) {
	return (
		<DividerEl ref={ref} {...rest}></DividerEl>
	);
});

Divider.propTypes = {
	color: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.oneOf(Object.keys(defaultTheme.palette.light))
	]),
};

Divider.defaultProps = {
	color: 'gray2'
};

export default Divider;
