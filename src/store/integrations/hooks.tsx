/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

/* eslint-disable react-hooks/rules-of-hooks */
/* THIS FILE CONTAINS HOOKS, BUT ESLINT IS DUMB */

import { compact, map } from 'lodash';
import React, { useMemo, FC, FunctionComponent, useCallback } from 'react';
import { useIntegrationsStore } from './store';
import { Action, ActionFactory, CombinedActionFactory } from '../../../types';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import AppContextProvider from '../../boot/app/app-context-provider';
// eslint-disable-next-line @typescript-eslint/ban-types
export const useIntegratedHook = (id: string): [Function, boolean] => {
	const integration = useIntegrationsStore((s) => s.hooks?.[id]);
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	return integration ? [integration, true] : [(): void => {}, false];
};
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
	const actions = useMemo(
		() =>
			compact(
				map(factories, (f) => {
					try {
						const action = f(target);
						return action;
					} catch (e) {
						// eslint-disable-next-line no-console
						console.error(e);
						return undefined;
					}
				})
			) ?? [],
		[factories, target]
	);
	return actions;
};

export const useActionsFactory = <T,>(type: string): CombinedActionFactory<T> => {
	const factories = useIntegrationsStore((s) => s.actions[type]);
	const combinedFactory = useCallback(
		(target: unknown) =>
			compact(
				map(factories, (f) => {
					try {
						const action = f(target);
						return action;
					} catch (e) {
						// eslint-disable-next-line no-console
						console.error(e);
						return undefined;
					}
				})
			),
		[factories]
	);
	return combinedFactory;
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
