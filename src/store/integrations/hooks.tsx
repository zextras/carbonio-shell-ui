/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

/* THIS FILE CONTAINS HOOKS, BUT ESLINT IS DUMB */

import React, { useMemo, FC, FunctionComponent, useCallback } from 'react';

import { compact, map } from 'lodash';

import { useIntegrationsStore } from './store';
import { Action, ActionFactory, CombinedActionFactory } from '../../../types';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import AppContextProvider from '../../boot/app/app-context-provider';
// eslint-disable-next-line @typescript-eslint/ban-types
export const useIntegratedFunction = (id: string): [Function, boolean] => {
	const integration = useIntegrationsStore((s) => s.functions?.[id]);
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	return integration ? [integration, true] : [(): void => {}, false];
};

export const useIntegratedComponent = (id: string): [FunctionComponent<unknown>, boolean] => {
	const Integration = useIntegrationsStore((s) => s.components?.[id]);
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

export const useActions = <T,>(target: T, type: string): Array<Action> => {
	const factories = useIntegrationsStore((s) => s.actions[type]);
	return useMemo(
		() =>
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
			) ?? [],
		[factories, target]
	);
};

export const useActionsFactory = <T,>(type: string): CombinedActionFactory<T> => {
	const factories = useIntegrationsStore((s) => s.actions[type]);
	return useCallback(
		(target: unknown) =>
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
			),
		[factories]
	);
};

export const useAction = <T,>(
	type: string,
	id: string,
	target?: T
): [Action | undefined, boolean] => {
	const factory = useIntegrationsStore((s) => s.actions[type][id]);
	const action = useMemo(() => {
		try {
			return factory?.(target);
		} catch (e) {
			return undefined;
		}
	}, [factory, target]);
	return [action, !!action];
};

export const useActionFactory = <T,>(
	type: string,
	id: string
): [ActionFactory<T> | undefined, boolean] => {
	const factory = useIntegrationsStore((s) => s.actions[type][id]);
	return [factory, !!factory];
};
