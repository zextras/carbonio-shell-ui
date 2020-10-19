import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from "prop-types";

const Portal = React.forwardRef(function Portal({ children, container, show, disablePortal = false }, ref) {
	if (disablePortal) return children;
	if (!show) return null;

	return ReactDOM.createPortal(children, container || window.top.document.body);
});

Portal.propTypes = {
	/** The children to render into the `container` */
	children: PropTypes.node,
	/**
	 * HTML node where to insert the Portal's children.
	 * The default value is 'window.top.document'.
	 * */
	container: PropTypes.instanceOf(Element),
	/** Flag to show or hide Portal's content */
	show: PropTypes.bool,
	/** Flag to disable the Portal implementation */
	disablePortal: PropTypes.bool
};

Portal.defaultProps = {
	disablePortal: false
};

export default Portal;