import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import defaultTheme from '../../theme/Theme';

const Comp = styled.div`
  color: ${({theme, color}) => theme.palette[color].regular};
  font-family: ${({theme}) => theme.fonts['default']};
  font-size: ${({theme, size}) => theme.sizes.font[size]};
  font-weight: ${({theme, weight}) => theme.fonts.weight[weight]};
  margin: 0;
  max-width: 100%;
  ${props => props.overflow === 'ellipsis' ?
		`white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;`
		:
		`overflow-wrap: break-word;
		word-wrap: break-word;
		ms-word-break: break-all;`};
`;

const Text = React.forwardRef(function ({ children, ...rest }, ref) {
	return (
		<Comp ref={ref} { ...rest }>
			{ children }
		</Comp>
	);
});

Text.propTypes = {
	/** Text color */
	color: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.oneOf(Object.keys(defaultTheme.palette.light))
	]),
	/** Text size */
	size: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.oneOf(Object.keys(defaultTheme.sizes.font))
	]),
	/** Text weight */
	weight: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.oneOf(Object.keys(defaultTheme.fonts.weight))
	]),
	/** Overflow handling */
	overflow: PropTypes.oneOf(['ellipsis', 'break-word'])
};

Text.defaultProps = {
	color: 'text',
	size: 'medium',
	weight: 'regular',
	overflow: 'ellipsis'
};

export default Text;
