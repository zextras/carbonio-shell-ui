/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import type { FC } from 'react';
import React, { useMemo } from 'react';

import { map } from 'lodash';

import AppContextProvider from './app-context-provider';
import { useAppStore } from '../../store/app';

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
