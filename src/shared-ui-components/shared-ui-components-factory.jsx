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
import { reduce } from 'lodash';
import AppContextProvider from '../app/app-context-provider';
import { useSharedUiComponentsScope } from './shared-ui-components-context';

export default function SharedUiComponentsFactory({ scope, ...props }) {
	const classes = useSharedUiComponentsScope(scope);

	const components = reduce(
		classes,
		(r, v, k) => {
			const { pkg, componentClass: TmpComponent } = v;
			r.push(
				<AppContextProvider key={`${scope}-${pkg.package}=${k}`} pkg={pkg}>
					<TmpComponent key={`${scope}-${pkg.package}`} {...props} />
				</AppContextProvider>
			);
			return r;
		},
		[]
	);

	return (
		<>
			{ components }
		</>
	);
}
