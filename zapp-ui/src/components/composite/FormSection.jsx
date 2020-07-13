import React, { createContext, useContext } from 'react';
import PropTypes from 'prop-types';
import Container from '../layout/Container';
import defaultTheme from "../../theme/Theme";
import Text from "../basic/Text";

const levelContext = createContext(0);

const FormSection = React.forwardRef(function({ background, label, children }, ref) {
	const level = useContext(levelContext);
	return (
			<Container
				ref={ref}
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
});

FormSection.propTypes = {
	label: PropTypes.string,
	background: PropTypes.oneOf(Object.keys(defaultTheme.palette.light)),
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
