/*
 * SPDX-FileCopyrightText: 2021 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

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
