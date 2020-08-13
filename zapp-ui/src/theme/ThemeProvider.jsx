// export { ThemeProvider as default } from 'styled-components';
import React, { useState, useMemo } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';

function ThemeProvider({theme, children}) {
	const [mode, setMode] = useState('light');
	const adaptedTheme = useMemo(() => ({
			...theme,
			palette: theme.palette[mode],
			avatarColors: theme.avatarColors[mode]
		}), [theme, mode]);
	return (
		<StyledThemeProvider
			theme={
				{
					...adaptedTheme,
					mode,
					setMode,
				}
			}
		>
			{children}
		</StyledThemeProvider>
	);
}

export default ThemeProvider;
