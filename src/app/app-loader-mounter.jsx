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
import React, { useState, memo, useEffect } from 'react';
import { find, map, reduce } from 'lodash';
import { useApps } from '../app-store/hooks';
import AppContextProvider from './app-context-provider';

export default function AppLoaderMounter() {
	const apps = useApps();

	const [classes, setClasses] = useState({ list: [], mounted: [] });
	useEffect(() => {
		setClasses((c) =>
			reduce(
				apps,
				(acc, app, id) => {
					if (app.class && !find(acc.mounted, (i) => i === id)) {
						const App = memo(app.class);
						// eslint-disable-next-line no-param-reassign
						acc.list.push(
							<AppContextProvider key={id} pkg={id}>
								<App key={id} />
							</AppContextProvider>
						);
						acc.mounted.push(id);
					}
					return acc;
				},
				c
			)
		);
	}, [apps]);

	return (
		<div
			data-testid="app-mounter"
			key="app-mounter"
			hidden
			style={{ height: 0, overflow: 'hidden' }}
		>
			{classes.list}
		</div>
	);
}
