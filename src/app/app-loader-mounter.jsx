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
import React, { useEffect, useMemo, useState } from 'react';
import { combineLatest } from 'rxjs';
import { reduce } from 'lodash';
import { map as rxMap } from 'rxjs/operators';
import { useAppsCache } from './app-loader-context';
import AppContextProvider from './app-context-provider';

export default function AppLoaderMounter() {
	const [appsCache] = useAppsCache();
	const [appsClasses, setAppClasses] = useState([]);

	useEffect(() => {
		const subscription = combineLatest(
			reduce(
				appsCache,
				(acc, { pkg, entryPoint }) => {
					acc.push(
						entryPoint.pipe(
							rxMap((AppClass) => ({ AppClass, pkg }))
						)
					);
					return acc;
				},
				[]
			)
		)
			.subscribe((_appsClasses) => {
				setAppClasses(_appsClasses);
			});

		return () => {
			if (subscription) {
				subscription.unsubscribe();
			}
		};
	}, [appsCache]);

	const children = useMemo(() => reduce(
		appsClasses,
		(acc, { AppClass, pkg }) => {
			acc.push((
				<AppContextProvider key={pkg.package} pkg={pkg}>
					<AppClass />
				</AppContextProvider>
			));
			return acc;
		},
		[]
	), [appsClasses]);

	return (
		<div
			hidden={true}
			style={{ height: 0, overflow: 'hidden' }}
		>
			{ children }
		</div>
	);
}
