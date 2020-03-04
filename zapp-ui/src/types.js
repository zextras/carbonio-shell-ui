import PropTypes from 'prop-types';

export const WrappedItemActionShape = PropTypes.shape({
	icon: PropTypes.string.isRequired,
	label: PropTypes.string.isRequired,
	id: PropTypes.string.isRequired,
	onActivate: PropTypes.func.isRequired
});
