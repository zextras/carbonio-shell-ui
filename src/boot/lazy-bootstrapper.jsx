import React from 'react';
import usePromise from 'react-use-promise';
import LoadingView from './loading-view';

const LazyBootstrapper = ({ onBeforeBoot }) => {
	const [result, errorMessage, state] = usePromise(
		() =>
			import(/* webpackChunkName: "bootstrapper" */ './bootstrapper').then(
				({ default: bootstrapper }) => bootstrapper(onBeforeBoot)
			),
		[onBeforeBoot]
	);

	switch (state) {
		case 'rejected': {
			return <pre>{errorMessage}</pre>;
		}
		case 'resolved': {
			const { default: LoadedLazyBootstrapper } = result;
			return <LoadedLazyBootstrapper />;
		}
		default:
			return <LoadingView />;
	}
};

export default LazyBootstrapper;
