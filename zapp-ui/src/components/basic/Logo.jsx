import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ThemeContext from '../../theme/ThemeContext';
import defaultTheme from '../../theme/Theme';

const LogoEl = styled.div`
    width: 100%;
`;

const Logo = React.forwardRef(function({ size }, ref) {
	const theme = useContext(ThemeContext);
	const LogoEl = theme.logo.svg;

	return (
		<LogoEl ref={ref} height={theme.logo.size[size]} />
	);
});

Logo.propTypes = {
	size: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.oneOf(Object.keys(defaultTheme.logo.size))
	]),
};

Logo.defaultProps = {
	size: 'small'
};

export default Logo;
