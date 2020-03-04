import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import defaultTheme from '../../theme/Theme';

const Comp = styled.div`
    height: fit-content;
    width: fit-content;
    padding: ${(props) => {
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
}}
`;

const Padding = ({ children, ...rest }) => {
    return (
        <Comp {...rest}>
            { children }
        </Comp>
    );
};

Padding.propTypes = {
    all: PropTypes.oneOf(Object.keys(defaultTheme.sizes.padding)),
    vertical: PropTypes.oneOf(Object.keys(defaultTheme.sizes.padding)),
    horizontal: PropTypes.oneOf(Object.keys(defaultTheme.sizes.padding)),
    top: PropTypes.oneOf(Object.keys(defaultTheme.sizes.padding)),
    right: PropTypes.oneOf(Object.keys(defaultTheme.sizes.padding)),
    bottom: PropTypes.oneOf(Object.keys(defaultTheme.sizes.padding)),
    left: PropTypes.oneOf(Object.keys(defaultTheme.sizes.padding)),
};

Padding.defaultProps = {
};

export default Padding;
