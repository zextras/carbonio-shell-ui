/* eslint-disable react-hooks/rules-of-hooks */
/* THIS FILE CONTAINS HOOKS, BUT ESLINT IS DUMB */

import { sortBy } from 'lodash';
import React, { useMemo, FC } from 'react';
import { useAppStore } from './store';
import { AppData, AppsMap } from './store-types';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import AppContextProvider from '../../app/app-context-provider';

export const useApp = (id: string): AppData => useAppStore((s) => s.apps[id]);

export const useApps = (): AppsMap => useAppStore((s) => s.apps);

export const useAppList = (): Array<AppData> => useAppStore((s) => sortBy(s.apps, 'core.priority'));

export const useAppContext = (id: string) => (): unknown => useAppStore((s) => s.apps[id]?.context);

export const useIntegratedHook = (id: string): unknown =>
	useAppStore((s) => s.integrations.hooks[id]?.item);

export const useIntegratedFunction = (id: string): unknown =>
	useAppStore((s) => s.integrations.functions[id]?.item);

export const useIntegratedAction = (id: string): unknown =>
	useAppStore((s) => s.integrations.actions[id]?.item);

export const useIntegratedComponent = (id: string): unknown => {
	const Integration = useAppStore((s) => s.integrations.components[id]);
	return useMemo(() => {
		if (Integration) {
			const C: FC = (props: unknown) => (
				<AppContextProvider pkg={Integration.app}>
					{/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
					{/* @ts-ignore */}
					<Integration.item {...props} />
				</AppContextProvider>
			);
			return C;
		}
		return null;
	}, [Integration]);
};
