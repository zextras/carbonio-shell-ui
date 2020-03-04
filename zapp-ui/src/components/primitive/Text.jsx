import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import defaultTheme from '../../theme/Theme';

const Comp = styled.p`
  color: ${props => props.theme.colors.text[props.color]};
  font-family: ${props => props.theme.fonts['default']};
  font-size: ${props => props.theme.sizes.font[props.size]};
  font-weight: ${props => props.theme.fonts.weight[props.weight]};
  margin: 0;
  max-width: 100%;
  ${props => props.overflow === 'ellipsis' ?
		`white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;`
		:
		`overflow-wrap: break-word;
		word-wrap: break-word;
		ms-word-break: break-all;`}
`;

const Text = ({ children, ...rest }) => {
	return (
		<Comp { ...rest }>
			{ children }
		</Comp>
	);
};

Text.propTypes = {
	/** Text color */
	color: PropTypes.oneOf(Object.keys(defaultTheme.colors.text)),
	/** Text size */
	size: PropTypes.oneOf(Object.keys(defaultTheme.sizes.font)),
	/** Text weight */
	weight: PropTypes.oneOf(Object.keys(defaultTheme.fonts.weight)),
	/** Overflow handling */
	overflow: PropTypes.oneOf(['ellipsis', 'break-word'])
};

Text.defaultProps = {
	color: 'txt_1',
	size: 'medium',
	weight: 'regular',
	overflow: 'ellipsis'
};

export default Text;
