/* eslint-disable react-hooks/rules-of-hooks */
/* THIS FILE CONTAINS HOOKS, BUT ESLINT IS DUMB */

import { sortBy } from 'lodash';
import React, { useMemo, FC } from 'react';
import { appStore } from '.';
import { AppData, AppsMap } from './store-types';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import AppContextProvider from '../app/app-context-provider';

export const getApp = (id: string): AppData => appStore.getState().apps[id];

export const getApps = (): AppsMap => appStore.getState().apps;

export const getAppList = (): Array<AppData> => sortBy(appStore.getState().apps, 'core.priority');

export const getAppContext = (id: string) => (): unknown => appStore.getState().apps[id]?.context;

export const getIntegratedHook = (id: string): unknown =>
	appStore.getState().integrations.hooks[id]?.item;

export const getIntegratedFunction = (id: string): unknown =>
	appStore.getState().integrations.functions[id]?.item;

export const getIntegratedAction = (id: string): unknown =>
	appStore.getState().integrations.actions[id]?.item;

export const getIntegratedComponent = (id: string): unknown => {
	const Integration = appStore.getState().integrations.components[id];
	if (Integration) {
		const IntegrationWithContext: FC = (props: unknown) => (
			<AppContextProvider pkg={Integration.app}>
				{/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
				{/* @ts-ignore */}
				<Integration.item {...props} />
			</AppContextProvider>
		);
		return IntegrationWithContext;
	}
	return null;
};
