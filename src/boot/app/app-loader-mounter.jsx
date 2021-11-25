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
import { find, findIndex, reduce } from 'lodash';
import { useHistory } from 'react-router';
import { useAppList } from '../../store/app/hooks';
import AppContextProvider from './app-context-provider';

export default function AppLoaderMounter() {
	const apps = useAppList();
	const history = useHistory();
	const [classes, setClasses] = useState({ list: [], mounted: [] });
	useEffect(() => {
		setClasses((old) =>
			reduce(
				apps,
				(acc, app, idx) => {
					if (app.class) {
						const App = memo(app.class);
						if (!find(acc.mounted, (i) => i === app.core.name)) {
							// eslint-disable-next-line no-param-reassign
							acc.list.push(
								<AppContextProvider key={app.core.name} pkg={app.core.name}>
									<App key={app.core.name} />
								</AppContextProvider>
							);
							acc.mounted.push(app.core.name);
							if (idx === 0 && history.location.pathname !== '/') {
								history.replace(`/${app.core.route}/`);
							}
							// } else if (FLAVOR === 'NPM' && cliSettings?.app_package?.name === app.core.name) {
							// 	const i = findIndex(acc.list, (a) => a.key === app.core.name);
							// 	// eslint-disable-next-line no-param-reassign
							// 	acc.list[i] = (
							// 		<AppContextProvider key={app.core.name} pkg={app.core.name}>
							// 			<App key={app.core.name} />
							// 		</AppContextProvider>
							// 	);
						}
					}
					return acc;
				},
				old
			)
		);
	}, [apps, history]);
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
