import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { useScreenMode } from "../../hooks/useScreenMode";

function Responsive({
	children,
	mode,
	target
}) {
	const screenMode = useScreenMode(target || window);
	return (
		<Fragment>
			{ screenMode === mode && children }
		</Fragment>
	)
}

Responsive.propTypes = {
	/** Whether the component's children should be displayed on mobile or desktop mode */
	mode: PropTypes.oneOf(['desktop', 'mobile']).isRequired,
	/** The Window element to use to determine the screenMode */
	target: PropTypes.object
};

export default Responsive;
