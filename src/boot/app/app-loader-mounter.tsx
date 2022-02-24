/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { FC, memo, Suspense, useMemo } from 'react';
import { isEmpty, map } from 'lodash';
import { useAppStore } from '../../store/app';
import AppContextProvider from './app-context-provider';

const Mounter: FC<{ appId: string }> = ({ children, appId }) => (
	<div key={appId} id={appId}>
		<AppContextProvider key={appId} pkg={appId}>
			<Suspense fallback={''}>{children}</Suspense>
		</AppContextProvider>
	</div>
);

const AppLoaderMounter: FC = () => {
	const entryPoints = useAppStore((s) => s.entryPoints);
	const entries = useMemo(
		() =>
			isEmpty(entryPoints)
				? null
				: map(entryPoints, (Comp, appId) => {
						const MemoComp = memo(Comp);
						return (
							<Mounter key={appId} appId={appId}>
								<MemoComp />
							</Mounter>
						);
				  }),
		[entryPoints]
	);

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
