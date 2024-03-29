/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

/* THIS FILE CONTAINS HOOKS, BUT ESLINT IS DUMB */

import React, { FC, FunctionComponent } from 'react';

import { compact, map } from 'lodash';

import { useIntegrationsStore } from './store';
import { Action, ActionFactory } from '../../../types';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import AppContextProvider from '../../boot/app/app-context-provider';
// eslint-disable-next-line @typescript-eslint/ban-types
export const getIntegratedFunction = (id: string): [Function, boolean] => {
	const integration = useIntegrationsStore.getState().functions?.[id];
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	return integration ? [integration, true] : [(): void => {}, false];
};

export const getIntegratedComponent = (id: string): [FunctionComponent<unknown>, boolean] => {
	const Integration = useIntegrationsStore.getState().components?.[id];
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
