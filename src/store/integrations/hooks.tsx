/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import type { FunctionComponent } from 'react';
import React, { useMemo, useCallback } from 'react';

import { compact, map } from 'lodash';

import { useIntegrationsStore } from './store';
import AppContextProvider from '../../boot/app/app-context-provider';
import type {
	Action,
	ActionFactory,
	ActionType,
	CombinedActionFactory
} from '../../types/integrations';
import type { AnyFunction } from '../../utils/typeUtils';

export const useIntegratedFunction = (id: string): [AnyFunction, boolean] => {
	const integration = useIntegrationsStore((s) => s.functions?.[id]);
	return integration ? [integration, true] : [(): void => undefined, false];
};

export const useIntegratedComponent = (
	id: string
): [FunctionComponent<Record<string, unknown>>, boolean] => {
	const Integration = useIntegrationsStore((s) => s.components?.[id]);
	return useMemo(() => {
		if (Integration) {
			const C = (props: Record<string, unknown>): React.JSX.Element => (
				<AppContextProvider pkg={Integration.app}>
					<Integration.Item {...props} />
				</AppContextProvider>
			);
			return [C, true];
		}
		return [(): null => null, false];
	}, [Integration]);
};

export const useActions = <T,>(target: T, type: ActionType): Array<Action> => {
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
