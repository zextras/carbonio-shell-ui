/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { Suspense, useMemo } from 'react';
import { map } from 'lodash';
import { useAppStore } from '../../store/app';
import { AppContextProvider } from './app-context-provider';
import { LoadingView } from '../splash';

type MounterProps = { appId: string; children?: React.ReactNode | undefined };
const Mounter = ({ children, appId }: MounterProps): JSX.Element => (
	<div key={appId} id={appId}>
		<AppContextProvider pkg={appId}>
			<Suspense fallback={<LoadingView />}>{children}</Suspense>
		</AppContextProvider>
	</div>
);

export const AppLoaderMounter = (): JSX.Element => {
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
