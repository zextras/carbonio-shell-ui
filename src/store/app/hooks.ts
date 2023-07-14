/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

/* eslint-disable react-hooks/rules-of-hooks */
/* THIS FILE CONTAINS HOOKS, BUT ESLINT IS DUMB */

import { useMemo } from 'react';

import { sortBy } from 'lodash';

import { useAppStore } from './store';
import { AppRoute, CarbonioModule } from '../../../types';

export const useApp = (appId: string) => (): CarbonioModule => useAppStore((s) => s.apps[appId]);
export const useApps = (): Record<string, CarbonioModule> => useAppStore((s) => s.apps);
export const useAppList = (): Array<CarbonioModule> => {
	const apps = useApps();
	return useMemo(() => sortBy(apps, (a) => a.priority), [apps]);
};
export const getAppList = (): Array<CarbonioModule> =>
	sortBy(useAppStore.getState().apps, (a) => a.priority);

export const getApp = (appId: string) => (): CarbonioModule | undefined =>
	useAppStore.getState().apps[appId];
export const getApps = (): Record<string, CarbonioModule> => useAppStore.getState().apps;

export const useAppContext = (appId: string) => (): unknown =>
	useAppStore((s) => s.appContexts[appId]);
export const getAppContext = (appId: string) => (): unknown =>
	useAppStore.getState().appContexts[appId];
export const getShell = (): CarbonioModule => useAppStore.getState().shell;
export const getRoutes = (): Record<string, AppRoute> => useAppStore.getState().routes;
export const useRoutes = (): Record<string, AppRoute> => useAppStore((s) => s.routes);
export const getRoute = (id: string): AppRoute => useAppStore.getState().routes[id];
export const useRoute = (id: string): AppRoute => useAppStore((s) => s.routes[id]);
