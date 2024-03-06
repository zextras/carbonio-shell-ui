/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React from 'react';

import { compact, map } from 'lodash';

import { useIntegrationsStore } from './store';
import AppContextProvider from '../../boot/app/app-context-provider';
import type { Action, ActionFactory } from '../../types/integrations';
import type { AnyFunction } from '../../utils/typeUtils';

export const getIntegratedFunction = (id: string): [AnyFunction, boolean] => {
	const integration = useIntegrationsStore.getState().functions?.[id];
	return integration ? [integration, true] : [(): void => undefined, false];
};

export const getIntegratedComponent = (
	id: string
): [React.ComponentType<Record<string, unknown>>, boolean] => {
	const Integration = useIntegrationsStore.getState().components?.[id];
	if (Integration) {
		const C = (props: Record<string, unknown>): React.JSX.Element => (
			<AppContextProvider pkg={Integration.app}>
				<Integration.Item {...props} />
			</AppContextProvider>
		);
		return [C, true];
	}
	return [(): null => null, false];
};

export const getActions = <T,>(target: T, type: string): Array<Action> => {
	const factories = useIntegrationsStore.getState().actions[type];
	return compact(
		map(factories, (f) => {
			try {
				return f(target);
			} catch (e) {
				// eslint-disable-next-line no-console
				console.error(e);
				return undefined;
			}
		})
	);
};

export const getActionsFactory = (type: string): (<T>(target: T) => Array<Action>) => {
	const factories = useIntegrationsStore.getState().actions[type];
	return <T,>(target: T): Array<Action> =>
		compact(
			map(factories, (f) => {
				try {
					return f(target);
				} catch (e) {
					// eslint-disable-next-line no-console
					console.error(e);
					return undefined;
				}
			})
		);
};

export const getAction = <T,>(
	type: string,
	id: string,
	target?: T
): [Action | undefined, boolean] => {
	const factory = useIntegrationsStore.getState().actions[type]?.[id];
	const action = factory?.(target);
	return [action, !!action];
};

export const getActionFactory = <T,>(
	type: string,
	id: string
): [ActionFactory<T> | undefined, boolean] => {
	const factory = useIntegrationsStore.getState().actions[type]?.[id];
	return [factory, !!factory];
};
