import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Comp = styled.span`
	display: inline-block;
	min-width: 1.5em;
	padding: ${props => props.theme.sizes.padding.extrasmall + ' ' + props.theme.sizes.padding.small};
	font-family: ${props => props.theme.fonts['default']};
	font-size: ${props => props.theme.sizes.font['small']};
	font-weight: ${props => props.theme.fonts.weight['regular']};
	background-color: ${props => props.theme.colors.background[props.isRead ? 'bg_5' : 'bg_1']};
	color: ${props => props.theme.colors.text[props.isRead ? 'txt_1' : 'txt_3']};
	border-radius: 1.2em;
	text-align: center;
`;

const Badge = ({ type, value, ...rest }) => {

	let badgeText = value;
	if (typeof value === "number")
		badgeText = value > 99 ? '99+' : value;

	return (
		<Comp isRead={type === 'read'} { ...rest } >
			{ badgeText }
		</Comp>
	);
};

Badge.propTypes = {
	/** Badge type */
	type: PropTypes.oneOf(['read', 'unread']),
	/** Badge text */
	value: PropTypes.oneOfType(PropTypes.string, PropTypes.number).isRequired
};

Badge.defaultProps = {
	type: 'read'
};

export default Badge;