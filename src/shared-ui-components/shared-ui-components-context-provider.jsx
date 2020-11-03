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
import React, {
	useCallback, useEffect, useMemo, useState
} from 'react';
import { reduce } from 'lodash';
import { combineLatest } from 'rxjs';
import { useAppsCache } from '../app/app-loader-context';
import SharedUiComponentsContext from './shared-ui-components-context';

export default function SharedUiComponentsContextProvider({ children }) {
	const [appsCache, appsLoaded] = useAppsCache();
	const [scopes, setScopes] = useState({});

	const mergeAndSetScopes = useCallback((appScopes, canSet) => {
		if (!canSet) return;
		const newScopes = reduce(
			appScopes, // eslint-disable-next-line
			(r1, v1, k1) => {
				return reduce(
					v1,
					(r2, v2, k2) => { // eslint-disable-next-line
						if (!r2[k2]) r2[k2] = [];
						r2[k2].push(...v2);
						return r2;
					},
					r1
				);
			},
			{}
		);
		setScopes(newScopes);
	}, [setScopes]);

	useEffect(() => {
		let canSet = true;

		const combined = combineLatest(
			reduce(
				appsLoaded ? appsCache : {},
				(r, v, k) => {
					r.push(v.sharedUiComponents);
					return r;
				},
				[]
			)
		);
		const sub = combined.subscribe(
			(s) => mergeAndSetScopes(s, canSet)
		);

		return () => {
			canSet = false;
			sub.unsubscribe();
		};
	}, [appsCache, appsLoaded, mergeAndSetScopes]);
	// eslint-disable-next-line
	const value = useMemo(() => {
		return { // eslint-disable-next-line
			scopes: scopes
		};
	}, [
		scopes
	]);

	return (
		<SharedUiComponentsContext.Provider
			value={value}
		>
			{ children }
		</SharedUiComponentsContext.Provider>
	);
}
