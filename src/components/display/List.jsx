import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Virtuoso } from 'react-virtuoso';
import Container from '../layout/Container';

const List = React.forwardRef(function({
	Factory,
	itemHeight,
	amount,
	...rest
}, ref) {
	const [scrolling, setScrolling] = useState(false);
	const virtuosoFactory = useMemo(() => (index) => (
		<Factory
			index={index}
			scrolling={scrolling}
		/>
	), [scrolling, Factory]);

	return (
		<Container
			ref={ref}
			orientation="vertical"
			width="fill"
			height="fill"
			crossAlignment="stretch"
			mainAlignment="flex-start"
		>
			<Virtuoso
				totalCount={amount}
				style={{ height: '100%', width: '100%' }}
				item={virtuosoFactory}
				itemHeight={itemHeight}
				scrollingStateChange={setScrolling}
				{ ...rest }
			/>
		</Container>
	);
});

List.propTypes = {
	/** the amount of list items */
	amount: PropTypes.number.isRequired,
	/** The factory function which will be ran on each item into the viewport */
	Factory: PropTypes.func.isRequired,
	/** Optional, height of each item, avoids height computation if available */
	itemHeight: PropTypes.string
};

export default List;
