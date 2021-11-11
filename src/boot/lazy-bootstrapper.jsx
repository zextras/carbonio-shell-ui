/*
 * *** BEGIN LICENSE BLOCK *****
 * Copyright (C) 2011-2021 Zextras
 *
 *  The contents of this file are subject to the Zextras EULA;
 * you may not use this file except in compliance with the EULA.
 * You may obtain a copy of the EULA at
 * http://www.zextras.com/zextras-eula.html
 * *** END LICENSE BLOCK *****
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
