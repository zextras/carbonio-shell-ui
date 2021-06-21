/* eslint-disable react-hooks/rules-of-hooks */
/* THIS FILE CONTAINS HOOKS, BUT ESLINT IS DUMB */

import { sortBy, filter, find, map } from 'lodash';
import React, { useMemo, FC, FunctionComponent } from 'react';
import { useAppStore } from '.';
import { AppData, AppsMap, IntegratedActionsMap, SharedAction } from './store-types';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import AppContextProvider from '../app/app-context-provider';

export const useApp = (id: string) => (): AppData => useAppStore((s) => s.apps[id]);

export const useApps = (): AppsMap => useAppStore((s) => s.apps);

export const useAppList = (): Array<AppData> => useAppStore((s) => sortBy(s.apps, 'core.priority'));

export const useAppContext = (id: string) => (): unknown => useAppStore((s) => s.apps[id]?.context);

// eslint-disable-next-line @typescript-eslint/ban-types
export const useIntegratedHook = (id: string): [Function, boolean] => {
	const integration = useAppStore((s) => s.integrations.hooks[id]?.item);
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	return integration ? [integration, true] : [(): void => {}, false];
};
// eslint-disable-next-line @typescript-eslint/ban-types
export const useIntegratedFunction = (id: string): [Function, boolean] => {
	const integration = useAppStore((s) => s.integrations.functions[id]?.item);
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	return integration ? [integration, true] : [(): void => {}, false];
};
export const useIntegratedAction = (id: string): [SharedAction, boolean] => {
	const integration = useAppStore((s) => s.integrations.actions[id]?.item);
	return [integration ?? undefined, !!integration];
};

export const useIntegratedActionsByType = (type: string): Array<SharedAction> =>
	useAppStore((s) =>
		map(
			filter(s.integrations.actions, (action) => !!find(action.item.types ?? [], type)),
			'item'
		)
	);

export const useIntegratedComponent = (id: string): [FunctionComponent<unknown>, boolean] => {
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
			return [C, true];
		}
		return [(): null => null, false];
	}, [Integration]);
};
