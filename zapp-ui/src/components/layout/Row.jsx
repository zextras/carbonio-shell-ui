import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import defaultTheme from '../../theme/Theme';
import Container from './Container';

const ContainerEl = styled(Container)`
	display: ${(props) => props.display};
	max-width: 100%;
	flex-basis: ${(props) => props.flexBasis};
	flex-grow: ${(props) => props.flexGrow};
	order: ${(props) => props.order};
	${(props) => props.takeAvailableSpace && css`
		min-width: 0;
		flex-basis: 0;
		flex-grow: 1;
	`};
`;

const Row = React.forwardRef(function({ children, ...rest }, ref) {
	return (
		<ContainerEl ref={ref} {...rest}>
			{ children }
		</ContainerEl>
	);
});

Row.propTypes = {
	display: PropTypes.string,
	flexBasis: PropTypes.string,
	flexGrow: PropTypes.string,
	order: PropTypes.string,
	takeAvailableSpace: PropTypes.bool
};

Row.defaultProps = {
	display: 'flex',
	orientation: 'horizontal',
	borderRadius: 'none',
	height: 'auto',
	width: 'auto',
	wrap: 'wrap',
	flexBasis: 'unset',
	flexGrow: 'unset',
	order: 'unset',
	takeAvailableSpace: false
};

export default Row;
