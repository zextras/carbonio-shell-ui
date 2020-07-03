import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Comp = styled.span`
	display: inline-block;
	min-width: 1.7em;
	padding: ${props => {
		window.top.theme = props.theme;
		return `${props.theme.sizes.padding.extrasmall} ${props.theme.sizes.padding.small}`;
}};
	font-family: ${props => props.theme.fonts['default']};
	font-size: ${props => props.theme.sizes.font['small']};
	font-weight: ${props => props.theme.fonts.weight['regular']};
	background-color: ${({theme, isRead}) => theme.palette[isRead ? 'gray2' : 'primary'].regular};
	color: ${({theme, isRead}) => theme.palette[isRead ? 'gray0' : 'gray6'].regular};
	border-radius: 1.2em;
	text-align: center;
`;

const Badge = React.forwardRef(function({ type, value, ...rest }, ref) {
	const badgeText = useMemo(() => {
		return typeof value === 'number' && value > 99 ? '99+' : value;
	}, [value]);
	const isRead = useMemo(() => type === 'read', [type]);

	return (
		<Comp ref={ref} isRead={isRead} { ...rest } >
			{ badgeText }
		</Comp>
	);
});

Badge.propTypes = {
	/** Badge type */
	type: PropTypes.oneOf(['read', 'unread']),
	/** Badge text */
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
};

Badge.defaultProps = {
	type: 'read'
};

export default Badge;
