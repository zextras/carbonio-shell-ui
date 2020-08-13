import React from 'react';
import ThemeProvider from '../../src/theme/ThemeProvider';
import Theme from '../../src/theme/Theme';
import {ThemeContext} from "../../src";
import Container from "../../src/components/layout/Container";
import Button from "../../src/components/basic/Button";
import useFontImport from './useFontImport';

const Wrapper = ({ children }) => {
	useFontImport();
	return (
		<>
			<ThemeProvider theme={ Theme }>
				<ContainerWithModeSwitch>
					{ children }
				</ContainerWithModeSwitch>
			</ThemeProvider>
		</>
	);
};
export default Wrapper;

const ContainerWithModeSwitch = ({children}) => {
	const theme = React.useContext(ThemeContext);
	return (
		<Container
			background="gray6"
			mainAlignment="flex-start"
			crossAlignment="flex-start"
			padding={{ horizontal: 'extralarge', top: 'extralarge', bottom: 'small' }}
		>
			{children}
			<Container
				height="fit"
				width="fill"
				crossAlignment="flex-end"
			>
				<Button
					type="ghost"
					label={`${theme.mode} mode`}
					icon={theme.mode === 'dark' ? 'MoonOutline' : 'SunOutline'}
					color="primary"
					onClick={() => theme.setMode(theme.mode === 'dark' ? 'light' : 'dark')}
				/>
			</Container>
		</Container>
	);
}
