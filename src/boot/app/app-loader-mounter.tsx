/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useMemo } from 'react';

import { map } from 'lodash';

import { AppContextProvider } from './app-context-provider';
import { useAppStore } from '../../store/app';

const Mounter = ({
	children,
	appId
}: React.PropsWithChildren<{ appId: string }>): React.JSX.Element => (
	<div key={appId} id={appId}>
		<AppContextProvider key={appId} pkg={appId}>
			{children}
		</AppContextProvider>
	</div>
);

const AppLoaderMounter = (): React.JSX.Element => {
	const entryPoints = useAppStore((s) => s.entryPoints);
	const entries = useMemo(
		() =>
			map(entryPoints, (Comp, appId) => (
				<Mounter key={appId} appId={appId}>
					<Comp />
				</Mounter>
			)),
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
