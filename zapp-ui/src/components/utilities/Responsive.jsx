import React from 'react';
import PropTypes from 'prop-types';
import { useScreenMode } from "../../hooks/useScreenMode";

function Responsive({
	children,
	mode
}) {
	const screenMode = useScreenMode();
	return (
		<>
			{ screenMode === mode && children }
		</>
	)
}

Responsive.propTypes = {
	/** Whether the component's children should be displayed on mobile or desktop mode */
	mode: PropTypes.oneOf(['desktop', 'mobile']).isRequired
};

export default Responsive;
