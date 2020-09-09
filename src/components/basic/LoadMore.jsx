import React from 'react';
import PropTypes from 'prop-types';
import Container from '../layout/Container';
import Text from './Text';
import Icon from './Icon';
import Padding from '../layout/Padding';

const LoadMore = React.forwardRef(function({ label, ...rest }, ref) {
	return (
		<Container
			ref={ref}
			orientation="horizontal"
			width="fill"
			height="40px"
			{...rest}
		>
			<Icon icon="Sync"/>
			{label && <Padding left="small"><Text style={{userSelect: 'none'}}>{label}</Text></Padding>}
		</Container>
	);
});

LoadMore.propTypes = {
	label: PropTypes.string,
};

export default LoadMore;
