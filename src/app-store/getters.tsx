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

import { sortBy, filter, find, map } from 'lodash';

import React, { FC, Component } from 'react';
import { appStore } from '.';
import { AppData, AppsMap, SharedAction } from './store-types';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import AppContextProvider from '../app/app-context-provider';

export const getApp = (id: string) => (): AppData => appStore.getState().apps[id];

export const getApps = (): AppsMap => appStore.getState().apps;

export const getAppList = (): Array<AppData> => sortBy(appStore.getState().apps, 'core.priority');

export const getAppContext = (id: string) => (): unknown => appStore.getState().apps[id]?.context;

// eslint-disable-next-line @typescript-eslint/ban-types
export const getIntegratedHook = (id: string): [Function, boolean] => {
	const integration = appStore.getState().integrations.hooks[id]?.item;
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	return integration ? [integration, true] : [(): void => {}, false];
};

// eslint-disable-next-line @typescript-eslint/ban-types
export const getIntegratedFunction = (id: string): [Function, boolean] => {
	const integration = appStore.getState().integrations.functions[id]?.item;
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	return integration ? [integration, true] : [(): void => {}, false];
};

// eslint-disable-next-line @typescript-eslint/ban-types
export const getIntegratedAction = (id: string): [SharedAction | undefined, boolean] => {
	const integration = appStore.getState().integrations.actions[id]?.item;
	return integration ? [integration, true] : [undefined, false];
};

export const getIntegratedActionsByType = (type: string): Array<unknown> =>
	map(
		filter(
			appStore.getState().integrations.actions,
			(action) => !!find(action.item.types ?? [], type)
		),
		'item'
	);

export const getIntegratedComponent = (id: string): [FC<unknown>, boolean] => {
	const Integration = appStore.getState().integrations.components[id];
	if (Integration) {
		const IntegrationWithContext: FC = (props: unknown) => (
			<AppContextProvider pkg={Integration.app}>
				{/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
				{/* @ts-ignore */}
				<Integration.item {...props} />
			</AppContextProvider>
		);
		return [IntegrationWithContext, true];
	}
	return [(): null => null, false];
};
