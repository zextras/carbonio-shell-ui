/*
 * *** BEGIN LICENSE BLOCK *****
 * Copyright (C) 2011-2020 ZeXtras
 *
 * The contents of this file are subject to the ZeXtras EULA;
 * you may not use this file except in compliance with the EULA.
 * You may obtain a copy of the EULA at
 * http://www.zextras.com/zextras-eula.html
 * *** END LICENSE BLOCK *****
 */

import React from 'react';
import { usePromise } from '../shell/hooks';
import LoadingView from './loading-view';

export default function LazyBootstrapper({ onBeforeBoot }) {
	const [result, errorMessage, state] = usePromise(
		() => import(/* webpackChunkName: "bootstrapper" */ './bootstrapper')
			.then(({ default: bootstrapper }) => bootstrapper(onBeforeBoot)),
		[onBeforeBoot]
	);

	switch (state) {
		case 'rejected': {
			return (
				<pre>{ errorMessage }</pre>
			);
		}
		case 'resolved': {
			const { default: _LazyBootstrapper } = result;
			return (
				<_LazyBootstrapper />
			);
		}
		default:
			return (
				<LoadingView />
			);
	}
}
