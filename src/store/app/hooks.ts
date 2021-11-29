/*
 * SPDX-FileCopyrightText: 2021 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

/* eslint-disable react-hooks/rules-of-hooks */
/* THIS FILE CONTAINS HOOKS, BUT ESLINT IS DUMB */

import { reduce, sortBy } from 'lodash';
import { useMemo } from 'react';
import { useAppStore, appStore } from './store';
import { AppData, AppsMap, ZextrasModule } from '../../../types';

export const useApp = (id: string) => (): AppData => useAppStore((s) => s.apps[id]);

export const useApps = (): AppsMap => useAppStore((s) => s.apps);
export const useAppCores = (): { [appId: string]: ZextrasModule } => {
	const apps = useAppStore((s) => s.apps);
	return useMemo(() => reduce(apps, (acc, app, id) => ({ ...acc, [id]: app.core }), {}), [apps]);
};

export const useAppList = (): Array<AppData> => {
	const apps = useAppStore((s) => s.apps);
	return useMemo(() => sortBy(apps, (a) => a.core.priority), [apps]);
};

export const useAppContext = (id: string) => (): unknown => useAppStore((s) => s.apps[id]?.context);

/* eslint-disable react-hooks/rules-of-hooks */

export const getApp = (id: string) => (): AppData => appStore.getState().apps[id];

export const getApps = (): AppsMap => appStore.getState().apps;

export const getAppList = (): Array<AppData> =>
	sortBy(appStore.getState().apps, (a) => a.core.priority);

export const getAppContext = (id: string) => (): unknown => appStore.getState().apps[id]?.context;
export const getShell = (): ZextrasModule | undefined => appStore.getState().shell;
