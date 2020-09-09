import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const QuotaBar = styled.div`
	height: 8px;
	min-width: 64px;
	width: 30%;
	max-width: 128px;
	background: ${({theme}) => theme.palette.gray6.regular};
	border-radius: ${props => props.theme.borderRadius};
`;

const QuotaFill = styled.div`
	height: 100%;
	width: ${props => props.fill}%;
	background: ${({theme}) => theme.palette.primary.regular};
	border-radius: ${props => props.theme.borderRadius};
`;

const Quota = React.forwardRef(function({ fill, ...rest }, ref) {
	return (
		<QuotaBar ref={ref} {...rest}>
			<QuotaFill fill={fill}/>
		</QuotaBar>
	);
});

Quota.propTypes = {
	/** quota percentage */
	fill: PropTypes.number.isRequired
};

export default Quota;
