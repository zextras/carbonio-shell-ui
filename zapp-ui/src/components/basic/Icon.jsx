import React, { useContext, useMemo, Fragment } from 'react';
import PropTypes from 'prop-types';
import { ThemeContext } from '@zextras/zapp-ui';
import defaultTheme from '../../theme/Theme';

const Icon = React.forwardRef(function({ icon, size, color, disabled, style, ...rest }, ref) {
	const theme = useContext(ThemeContext);
	const IconComp = useMemo(() => theme.icons[icon] || theme.icons.AlertTriangleOutline, [theme.icons, icon]);
	return (
		<IconComp
			ref={ref}
			width={theme.sizes.icon[size]}
			height={theme.sizes.icon[size]}
			fill="currentColor"
			style={{
				display: 'block',
				color: theme.palette[color][disabled ? 'disabled' : 'regular'],
				...style
			}}
			{...rest}
		/>
	);
});

Icon.propTypes = {
	/** Icon size */
	size: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.oneOf(Object.keys(defaultTheme.sizes.icon))
	]),
	/** Icon Color */
	color: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.oneOf(Object.keys(defaultTheme.palette.light))
	]),
	/** Icon name, as key for the theme's icon map */
	icon: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.oneOf(Object.keys(defaultTheme.icons))
	]),
	/** whether the icon is in a disabled element */
	disabled: PropTypes.bool,
};

Icon.defaultProps = {
	color: 'text',
	size: 'medium',
	disabled: false
};

export default Icon;
