import React from 'react';
import PropTypes from 'prop-types';
import Container from "../layout/Container";
import Text from "../basic/Text";

class Catcher extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			hasError: false,
			errorInfo: null,
			error: null
		};
	}

	componentDidCatch(error, errorInfo) {
		// You can also log the error to an error reporting service
		if (this.props.onError) {
			this.props.onError(error, errorInfo);
		}
		console.error(error);
		console.error(errorInfo);
		this.setState(
			{
				hasError: true,
				error,
				errorInfo,
			}
		);
	}

	render() {
		if (this.state.hasError) {
			// You can render any custom fallback UI
			return (
				<Container>
					<Text size="large" color="error">{this.state.error.message}</Text>
				</Container>
				);
		}

		return this.props.children;
	}
}

Catcher.propTypes = {
	/** error callback, use this to perform operations when an error is caught */
	onError: PropTypes.func
};

export default Catcher;
