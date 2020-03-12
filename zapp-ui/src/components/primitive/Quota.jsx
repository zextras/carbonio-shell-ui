import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const QuotaBar = styled.div`
	height: 8px;
	min-width: 64px;
	width: 30%;
	max-width: 128px;
	background: ${props => props.theme.colors.background['bg_7']};
	border-radius: ${props => props.theme.borderRadius};
`;

const QuotaFill = styled.div`
	height: 100%;
	width: ${props => props.fill}%;
	background: ${props => props.theme.colors.background['bg_1']};
	border-radius: ${props => props.theme.borderRadius};
`;

function Quota({ fill }) {
	return (
		<QuotaBar>
			<QuotaFill fill={fill}/>
		</QuotaBar>
	);
}

Quota.propTypes = {
	/** quota percentage */
	fill: PropTypes.number.isRequired
};

export default Quota;
