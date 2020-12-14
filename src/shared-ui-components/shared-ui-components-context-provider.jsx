/*
 * *** BEGIN LICENSE BLOCK *****
 * Copyright (C) 2011-2020 Zextras
 *
 *  The contents of this file are subject to the Zextras EULA;
 * you may not use this file except in compliance with the EULA.
 * You may obtain a copy of the EULA at
 * http://www.zextras.com/zextras-eula.html
 * *** END LICENSE BLOCK *****
 */
import React, { useState, useEffect } from 'react';
import { map, merge } from 'lodash';
import { combineLatest } from 'rxjs';
import { useAppsCache } from '../app/app-loader-context';
import { SharedUIComponentsContext } from './shared-ui-components-context';

const SharedUIComponentsContextProvider = ({ children }) => {

	const [appsCache, appsLoaded] = useAppsCache();
	const [components, setComponents] = useState({});

	useEffect(() => {
		let canSet = true;

		const combined = combineLatest(
			map(
				appsLoaded ? appsCache : {},
				'sharedUiComponents'
			)
		);

		const sub = combined.subscribe(
			(comps) => {
				if (canSet) {
					setComponents((c) => merge(c, ...comps));
				}
			}
		);

		return () => {
			canSet = false;
			sub.unsubscribe();
		};
	}, [appsCache, appsLoaded]);

	return (
		<SharedUIComponentsContext.Provider
			value={components}
		>
			{ children }
		</SharedUIComponentsContext.Provider>
	);
};

export default SharedUIComponentsContextProvider;
