import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import ThemeContext from '../../theme/ThemeContext';
import defaultTheme from '../../theme/Theme';

const Icon = ({ icon, size, color, ...rest }) => {
	const theme = useContext(ThemeContext);
	const IconComp = theme.icons[icon];
	return (
		<IconComp
			width={theme.sizes.icon[size]}
			height={theme.sizes.icon[size]}
			fill={theme.colors.text[color]}
			{...rest}
		/>
	);
};

Icon.propTypes = {
	/** Icon size */
	size: PropTypes.oneOf(Object.keys(defaultTheme.sizes.icon)),
	/** Icon Color */
	color: PropTypes.oneOf(Object.keys(defaultTheme.colors.text)),
	/** Icon name, as key for the theme's icon map */
	icon: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf(Object.keys(defaultTheme.icons))]),
};

Icon.defaultProps = {
	color: 'txt_1',
	size: 'medium'
};

export default Icon;
