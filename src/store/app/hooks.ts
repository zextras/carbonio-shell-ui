/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useMemo } from 'react';

import { sortBy } from 'lodash';

import { useAppStore } from './store';
import type { AppRoute, CarbonioModule } from '../../types/apps';

export const getAppHook = (appId: string) => (): CarbonioModule =>
	useAppStore((s) => s.apps[appId]);

export const useApps = (): Record<string, CarbonioModule> => useAppStore((s) => s.apps);

export const useAppList = (): Array<CarbonioModule> => {
	const apps = useApps();
	return useMemo(() => sortBy(apps, (a) => a.priority), [apps]);
};

export const getApp = (appId: string) => (): CarbonioModule | undefined =>
	useAppStore.getState().apps[appId];

export const getAppContextHook =
	(appId: string) =>
	<T>(): T =>
		useAppStore((s) => s.appContexts[appId] as T);

export const getAppContext = (appId: string) => (): unknown =>
	useAppStore.getState().appContexts[appId];

export const useRoutes = (): Record<string, AppRoute> => useAppStore((s) => s.routes);
