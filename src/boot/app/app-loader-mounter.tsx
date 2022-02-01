/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useState, useEffect, FC, ComponentType } from 'react';
import { map, reduce } from 'lodash';
import { useHistory } from 'react-router';
import { useAppStore } from '../../store/app';
import AppContextProvider from './app-context-provider';

const AppLoaderMounter: FC = () => {
	const entryPoints = useAppStore((s) => s.entryPoints);
	const history = useHistory();
	const [modules, setModules] = useState<Record<string, ComponentType>>({});
	useEffect(() => {
		setModules((old) =>
			reduce(
				entryPoints,
				(acc, ep, appId) => {
					console.log('@@@ looping', acc, ep, appId);
					// const App = memo(ep);
					if (!acc[appId]) {
						// eslint-disable-next-line no-param-reassign
						acc[appId] = ep;
					}
					return acc;
				},
				old
			)
		);
	}, [entryPoints, history]);

	console.log('@@@ entryPoints ', entryPoints);
	console.log('@@@ modules ', modules);

	return (
		<div
			data-testid="app-mounter"
			key="app-mounter"
			hidden
			style={{ height: 0, overflow: 'hidden' }}
		>
			{map(modules, (C, appId) => (
				<div key={appId} id={appId}>
					{((): null => {
						console.log('@@@ IIFE', Object.keys(modules));
						return null;
					})()}
					<AppContextProvider key={appId} pkg={appId}>
						<C key={appId} />
					</AppContextProvider>
				</div>
			))}
		</div>
	);
};

export default AppLoaderMounter;
