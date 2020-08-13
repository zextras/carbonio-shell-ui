import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import defaultTheme from '../../theme/Theme';

function getPadding(props) {
  if (props.value) {
    let paddingValue = props.value;
    const paddingSizes = Object.keys(props.theme.sizes.padding);
    paddingSizes.forEach((size) => {
      const regex = new RegExp(`(^|(?<= ))${size}`, 'gi');
      paddingValue = paddingValue.replace(regex, props.theme.sizes.padding[size]);
    });
    return paddingValue;
  }
  else {
    const p =['0', '0', '0', '0'];
    if (props.all) {
      p[0] = props.theme.sizes.padding[props.all];
      p[1] = props.theme.sizes.padding[props.all];
      p[2] = props.theme.sizes.padding[props.all];
      p[3] = props.theme.sizes.padding[props.all];
    }
    if (props.vertical) {
      p[0] = props.theme.sizes.padding[props.vertical];
      p[2] = props.theme.sizes.padding[props.vertical];
    }
    if (props.horizontal) {
      p[1] = props.theme.sizes.padding[props.horizontal];
      p[3] = props.theme.sizes.padding[props.horizontal];
    }
    if (props.top) {
      p[0] = props.theme.sizes.padding[props.top];
    }
    if (props.right) {
      p[1] = props.theme.sizes.padding[props.right];
    }
    if (props.bottom) {
      p[2] = props.theme.sizes.padding[props.bottom];
    }
    if (props.left) {
      p[3] = props.theme.sizes.padding[props.left];
    }
    return p.join(' ');
  }
}
const Comp = styled.div`
	height: fit-content;
	width: fit-content;
	padding: ${(props) => getPadding(props)};
`;

const Padding = React.forwardRef(function({ children, ...rest }, ref) {
	return (
    <Comp ref={ref} {...rest}>
      { children }
    </Comp>
	);
});

Padding.propTypes = {
	value: PropTypes.string,
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
};

Padding.defaultProps = {};

export default Padding;
