import React, { Fragment } from 'react';
import Text from "../../src/components/basic/Text";
import Container from "../../src/components/layout/Container";
import Padding from "../../src/components/layout/Padding";
import ThemeProvider from "../../src/theme/ThemeProvider";
import Theme from "../../src/theme/Theme";
import useFontImport from './useFontImport';

const Logo = ({}) => {
	useFontImport();
	return (
		<Fragment>
			<ThemeProvider theme={ Theme }>
				<Container>
					<Padding top="small">
						<Text size="large" weight="medium" color="primary">
							Zextras Zapp UI
						</Text>
					</Padding>
					<Text size="large" weight="regular" color="primary">
						Style Guide
					</Text>
				</Container>
			</ThemeProvider>
		</Fragment>
	);
};
export default Logo;
