import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Text from '../primitive/Text';
import defaultTheme from '../../theme/Theme';

const Comp = styled.div`
		width: ${props => props.theme.sizes.icon[props.size]};
		height: ${props => props.theme.sizes.icon[props.size]};
		color: ${props => props.theme.colors.text[props.color]};
		background: ${props => props.theme.colors.background[props.bgColor]};
		border-radius: 2px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
`;

function GenericFileIcon({ fileName, color, ...rest }) {
	const ext = fileName.split('.').pop();
	return (
		<Comp color={color} {...rest}>
			<Text color={color} size="small">
				{ ext ? ext.toUpperCase() : null }
			</Text>
		</Comp>
	);
}

GenericFileIcon.propTypes = {
	fileName: PropTypes.string,
	size: PropTypes.oneOf(Object.keys(defaultTheme.sizes.icon)),
	color: PropTypes.oneOf(Object.keys(defaultTheme.colors.text)),
	bgColor: PropTypes.oneOf(Object.keys(defaultTheme.colors.background))
};

GenericFileIcon.defaultProps = {
	color: 'txt_3',
	bgColor: 'bg_1',
	size: 'large'
};

export default GenericFileIcon;
