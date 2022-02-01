/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { FC, memo, useEffect, useMemo } from 'react';
import { map } from 'lodash';
import { useAppStore } from '../../store/app';
import AppContextProvider from './app-context-provider';

const Mounter: FC<{ appId: string }> = ({ children, appId }) => (
	<div key={appId} id={appId}>
		<AppContextProvider key={appId} pkg={appId}>
			{children}
		</AppContextProvider>
	</div>
);

const AppLoaderMounter: FC = () => {
	const entryPoints = useAppStore((s) => s.entryPoints);
	const entries = useMemo(
		() =>
			map(entryPoints, (Comp, appId) => {
				const MemoComp = memo(Comp);
				return (
					<Mounter key={appId} appId={appId}>
						<MemoComp />
					</Mounter>
				);
			}),
		[entryPoints]
	);
	// const history = useHistory();
	// const [modules, setModules] = useState<Record<string, ComponentType>>({});
	// useEffect(() => {
	// 	setModules((old) =>
	// 		reduce(
	// 			entryPoints,
	// 			(acc, ep, appId) => {
	// 				// const App = memo(ep);
	// 				if (!acc[appId]) {
	// 					// eslint-disable-next-line no-param-reassign
	// 					acc[appId] = ep;
	// 				}
	// 				return acc;
	// 			},
	// 			old
	// 		)
	// 	);
	// }, [entryPoints, history]);
	useEffect(() => {
		console.log('@@@ entryPoints ', entryPoints);
	}, [entryPoints]);

	return (
		<div
			data-testid="app-mounter"
			key="app-mounter"
			hidden
			style={{ height: 0, overflow: 'hidden' }}
		>
			{entries}
		</div>
	);
};

export default AppLoaderMounter;
