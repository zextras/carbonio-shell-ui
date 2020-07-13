import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import defaultTheme from '../../theme/Theme';

const ContainerEl = styled.div`
		display: flex;
		flex-direction: ${props => props.orientation};
		align-items: ${props => props.crossAlignment};
		justify-content: ${props => props.mainAlignment};
		flex-wrap: ${props => props.wrap};
		border-radius: ${props => {
			switch (props.borderRadius) {
				case 'regular':
					return props.theme.borderRadius;
				case 'round':
					return '50%';
				case 'half':
					return `${props.theme.borderRadius} ${props.theme.borderRadius} 0 0`;
				default: return '0';
			}
		}};
		background: ${({theme, background}) => background ? theme.palette[background].regular : 'transparent'};
		box-sizing: border-box;
		width: ${props => {
			if (props.width === 'fill') return '100%;';
			else if (props.width === 'fit') return 'fit-content';
			else if (typeof props.width === 'string') return props.width;
			else if (typeof props.width === 'number') return `${props.width}px`;
		}};
		height: ${props => {
			if (props.height === 'fill') return '100%';
			else if (props.height === 'fit') return 'fit-content';
			else if (typeof props.height === 'string') return props.height;
			else if (typeof props.height === 'number') return `${props.height}px`;
		}};
		${({borderColor, theme}) => borderColor ? `border: 1px solid ${theme.palette[borderColor].regular}` : ''};
		padding: ${(props) => {
			const p =['0', '0', '0', '0'];
			if (props.padding) {
				if (props.padding.all) {
					p[0] = props.theme.sizes.padding[props.padding.all];
					p[1] = props.theme.sizes.padding[props.padding.all];
					p[2] = props.theme.sizes.padding[props.padding.all];
					p[3] = props.theme.sizes.padding[props.padding.all];
				}
				if (props.padding.vertical) {
					p[0] = props.theme.sizes.padding[props.padding.vertical];
					p[2] = props.theme.sizes.padding[props.padding.vertical];
				}
				if (props.padding.horizontal) {
					p[1] = props.theme.sizes.padding[props.padding.horizontal];
					p[3] = props.theme.sizes.padding[props.padding.horizontal];
				}
				if (props.padding.top) {
					p[0] = props.theme.sizes.padding[props.padding.top];
				}
				if (props.padding.right) {
					p[1] = props.theme.sizes.padding[props.padding.right];
				}
				if (props.padding.bottom) {
					p[2] = props.theme.sizes.padding[props.padding.bottom];
				}
				if (props.padding.left) {
					p[3] = props.theme.sizes.padding[props.padding.left];
				}
			}
			return p.join(' ');
		}};
`;

const Container = React.forwardRef(function({ orientation, children, ...rest }, ref) {
	const direction = useMemo(() => orientation.replace('horizontal', 'row').replace('vertical', 'column'), [orientation]);
	return (
		<ContainerEl ref={ref} orientation={direction} {...rest}>
			{ children }
		</ContainerEl>
	);
});

Container.propTypes = {
	/** The Container orientation (css flex-direction prop or 'vertical' or 'horizontal') */
	orientation: PropTypes.string,
	/** Type of the Container's corners */
	borderRadius: PropTypes.oneOf(['regular', 'round', 'half', 'none']),
	/** Container background color */
	background: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.oneOf(Object.keys(defaultTheme.palette.light))
	]),
	// borderColor: PropTypes.oneOf(Object.keys(defaultTheme.colors.border)),
	/** Container height: <br/>
	 *  	`fit`: shorthand for fit-content
	 *  	`fill`: semantic alternative for `100%`
	 *  	number: measure in px
	 *  	string: any measure in CSS syntax
	 */
	height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
		/** Container width: <br/>
	 *  	`fit`: shorthand for fit-content
	 *  	`fill`: semantic alternative for `100%`
	 *  	number: measure in px
	 *  	string: any measure in CSS syntax
	 */
	width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	/** Container flex alignment along the main axis */
	mainAlignment: PropTypes.oneOf(['stretch', 'center', 'baseline', 'flex-start', 'flex-end', 'space-between', 'space-around', 'space-evenly', 'unset']),
	/** Container flex alignment along the cross axis */
	crossAlignment: PropTypes.oneOf(['stretch', 'center', 'baseline', 'flex-start', 'flex-end', 'unset']),
	/** Whether the Container items should wrap or not */
	wrap: PropTypes.oneOf(['wrap', 'nowrap', 'wrap-reverse', 'unset']),
	/** an object specifying the Container padding */
	padding: PropTypes.shape({
		all: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.oneOf(Object.keys(defaultTheme.sizes.padding))
		]),
		vertical: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.oneOf(Object.keys(defaultTheme.sizes.padding))
		]),
		horizontal: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.oneOf(Object.keys(defaultTheme.sizes.padding))
		]),
		top: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.oneOf(Object.keys(defaultTheme.sizes.padding))
		]),
		right: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.oneOf(Object.keys(defaultTheme.sizes.padding))
		]),
		bottom: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.oneOf(Object.keys(defaultTheme.sizes.padding))
		]),
		left: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.oneOf(Object.keys(defaultTheme.sizes.padding))
		]),
	})
};

Container.defaultProps = {
	orientation: 'vertical',
	borderRadius: 'regular',
	height: 'fill',
	width: 'fill',
	mainAlignment: 'center',
	crossAlignment: 'center',
	wrap: 'nowrap'
};

export default Container;
