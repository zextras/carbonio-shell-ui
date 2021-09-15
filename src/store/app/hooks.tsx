/*
 * *** BEGIN LICENSE BLOCK *****
 * Copyright (C) 2011-2021 Zextras
 *
 *  The contents of this file are subject to the Zextras EULA;
 * you may not use this file except in compliance with the EULA.
 * You may obtain a copy of the EULA at
 * http://www.zextras.com/zextras-eula.html
 * *** END LICENSE BLOCK *****
 */
/* eslint-disable react-hooks/rules-of-hooks */
/* THIS FILE CONTAINS HOOKS, BUT ESLINT IS DUMB */

import { sortBy } from 'lodash';
import { useAppStore, appStore } from './store';
import { AppData, AppsMap, ZextrasModule } from '../../../types';

export const useApp = (id: string) => (): AppData => useAppStore((s) => s.apps[id]);

export const useApps = (): AppsMap => useAppStore((s) => s.apps);

export const useAppList = (): Array<AppData> =>
	useAppStore((s) => sortBy(s.apps, (a) => -a.core.priority));

export const useAppContext = (id: string) => (): unknown => useAppStore((s) => s.apps[id]?.context);

/* eslint-disable react-hooks/rules-of-hooks */

export const getApp = (id: string) => (): AppData => appStore.getState().apps[id];

export const getApps = (): AppsMap => appStore.getState().apps;

export const getAppList = (): Array<AppData> => sortBy(appStore.getState().apps, 'core.priority');

export const getAppContext = (id: string) => (): unknown => appStore.getState().apps[id]?.context;
export const getShell = (): ZextrasModule | undefined => appStore.getState().shell;
