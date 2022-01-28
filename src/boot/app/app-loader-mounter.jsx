/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useState, memo, useEffect } from 'react';
import { find, reduce } from 'lodash';
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
						if (!find(acc.mounted, (i) => i === app.name)) {
							// eslint-disable-next-line no-param-reassign
							acc.list.push(
								<AppContextProvider key={app.name} pkg={app.name}>
									<App key={app.name} />
								</AppContextProvider>
							);
							acc.mounted.push(app.name);
							// if (idx === 0 && history.location.pathname === '/') {
							// 	history.replace(`/${app.route}/`);
							// }
							// } else if (FLAVOR === 'NPM' && cliSettings?.app_package?.name === app.name) {
							// 	const i = findIndex(acc.list, (a) => a.key === app.name);
							// 	// eslint-disable-next-line no-param-reassign
							// 	acc.list[i] = (
							// 		<AppContextProvider key={app.name} pkg={app.name}>
							// 			<App key={app.name} />
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
