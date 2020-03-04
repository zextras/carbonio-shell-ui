import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import defaultTheme from '../../theme/Theme';

const DividerEl = styled.div`
		background: ${props => props.theme.colors.border[props.color]};
		height: 1px;
		width: 100%;
`;

const Divider = ({ ...rest }) => {
	return (
		<DividerEl {...rest}></DividerEl>
	);
};

Divider.propTypes = {
	color: PropTypes.oneOf(Object.keys(defaultTheme.colors.border)),
};

Divider.defaultProps = {
	color: 'bd_1'
};

export default Divider;
