import React from 'react';
import PropTypes from 'prop-types';
import Container from "./Container";
import Text from "./Text";
import Icon from "./Icon";
import Padding from "./Padding";

function LoadMore({ label }) {
	return (
		<Container
			orientation="horizontal"
			width="fill"
			height="40px"
		>
			<Icon icon="Sync"/>
			{label && <Padding left="small"><Text style={{userSelect: 'none'}}>{label}</Text></Padding>}
		</Container>
	);
}

LoadMore.propTypes = {
	label: PropTypes.string,
};

export default LoadMore;
