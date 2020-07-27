import React from 'react';
import styled from 'styled-components';

import Text from '../basic/Text';

const P = styled(Text)`
	line-height: 1.4;
	padding-bottom: 0.8em;

	&:last-child {
		padding-bottom: 0;
	}
`;

const Paragraph = React.forwardRef(function ({
	children,
	...rest
}, ref) {
	return (
		<P ref={ref} {...rest}>{ children }</P>
	);
});

Paragraph.defaultProps = {
	overflow: 'break-word'
};

export default Paragraph;