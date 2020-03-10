import React, { createContext, useContext } from 'react';
import PropTypes from 'prop-types';
import Container from '../primitive/Container';
import defaultTheme from "../../theme/Theme";
import Text from "../primitive/Text";

const levelContext = createContext(0);

function FormSection({ background, label, children }) {
	const level = useContext(levelContext);
	return (
			<Container
				background={background}
				orientation="vertical"
				width="fill"
				height="fit"
				crossAlignment="flex-start"
				padding={{
					vertical: 'large',
					horizontal: 'small'
				}}
			>
				<Text
					size="large"
					weight={level > 0 ? 'regular' : 'medium'}
					overflow="break-word"
				>
					{label}
				</Text>
				<levelContext.Provider value={level+1}>
					{ children }
				</levelContext.Provider>
			</Container>
	);
}

FormSection.propTypes = {
	label: PropTypes.string,
	background: PropTypes.oneOf(Object.keys(defaultTheme.colors.background)),
};

export default FormSection;

export const FormRow = ({ children }) => (
	<Container
		orientation="horizontal"
		mainAlignment="flex-start"
		width="fill"
		padding={{
			top: 'large',
			horizontal: 'small'
		}}
	>
		{children}
	</Container>
);
