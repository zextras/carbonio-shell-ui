import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Container from "../primitive/Container";

const CollapseEl = styled.div`
	${props => props.orientation === 'horizontal' ? 'width' : 'height'} ${props => !props.open ? '0' : 'fit-content'};
	${props => {
		if (props.crossSize) {
			return `${props.orientation === 'horizontal' ? 'height' : 'width'}: ${props.crossSize};`;
		}
		else return '';
	}};
	overflow: hidden;
	visibility: ${(props) => props.open ? "visible" : "hidden"}
`;
//transition: ${props => props.orientation === 'horizontal' ? 'max-width' : 'max-height'} 150ms linear;
const Collapse = ({
	children,
	open,
	orientation,
	crossSize,
	...rest
}) => {
	return (
		<CollapseEl crossSize={crossSize} open={open} orientation={orientation} {...rest}>
			{ children }
		</CollapseEl>
	)
};

Collapse.propTypes = {
	/** Orientation of the collapsing action */
	orientation: PropTypes.oneOf(['vertical', 'horizontal']),
	/** control prop */
	open: PropTypes.bool.isRequired,
	// maxSize: PropTypes.string.isRequired,
	/** Size of the collapse element on the opposite axis (e.g. height if the collapse orientation is horizontal) */
	crossSize: PropTypes.string
};

Collapse.defaultProps = {
	orientation: 'horizontal'
};

export default Collapse;

const CollapserNotch = styled.div`
	width: 4px;
	height: 24px;
	background: ${props => props.theme.colors.background['bg_4']};
	border-radius: ${props => props.theme.borderRadius};
`;


export const Collapser = ({clickCallback}) => {
	return (
		<Container
			style={{ cursor: 'pointer' }}
			padding={{ horizontal: 'extrasmall' }}
			height="fill"
			width={12}
			onClick={clickCallback}
		>
			<CollapserNotch/>
		</Container>
	)
};

Collapser.propTypes = {
	clickCallback: PropTypes.func.isRequired
};

