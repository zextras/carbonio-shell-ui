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

import React, { useEffect, useMemo, useState } from 'react';
import { combineLatest } from 'rxjs';
import { reduce, isEmpty } from 'lodash';
import { map as rxMap } from 'rxjs/operators';
import { useThemesCache } from './app-loader-context';

export default function ThemeLoaderMounter() {
	const { cache } = useThemesCache();
	const [themesClasses, setThemeClasses] = useState([]);

	useEffect(() => {
		if (isEmpty(cache)) {
			setThemeClasses([]);
			return () => undefined;
		}
		const subscription = combineLatest(
			reduce(
				cache,
				(acc, { pkg, entryPoint }) => {
					acc.push(entryPoint.pipe(rxMap((ThemeClass) => ({ ThemeClass, pkg }))));
					return acc;
				},
				[]
			)
		).subscribe((_themesClasses) => {
			setThemeClasses(_themesClasses);
		});

		return () => {
			if (subscription) {
				subscription.unsubscribe();
			}
		};
	}, [cache]);

	const children = useMemo(
		() =>
			reduce(
				themesClasses,
				(acc, { ThemeClass, pkg }) => {
					acc.push(<ThemeClass key={pkg.package} />);
					return acc;
				},
				[]
			),
		[themesClasses]
	);

	return (
		<div data-testid="theme-mounter" hidden style={{ height: 0, overflow: 'hidden' }}>
			{children}
		</div>
	);
}
