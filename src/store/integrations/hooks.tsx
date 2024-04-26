/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import type React from 'react';
import { useMemo, useCallback } from 'react';

import { useIntegrationsStore } from './store';
import {
	buildIntegrationAction,
	buildIntegrationActions,
	buildIntegrationComponent,
	buildIntegrationFunction
} from './utils';
import type { Action, ActionFactory } from '../../types/integrations';
import type { AnyFunction } from '../../utils/typeUtils';

export const useIntegratedFunction = (id: string): [AnyFunction, boolean] => {
	const integration = useIntegrationsStore((s) => s.functions?.[id]);
	return buildIntegrationFunction(integration);
};

export const useIntegratedComponent = (
	id: string
): [React.FunctionComponent<Record<string, unknown>>, boolean] => {
	const integration = useIntegrationsStore((s) => s.components?.[id]);
	return useMemo(() => buildIntegrationComponent(integration), [integration]);
};

export const useActions = <T,>(target: T, type: string): Array<Action> => {
	const factories = useIntegrationsStore((s) => s.actions[type]);
	return useMemo(() => buildIntegrationActions(factories, target), [factories, target]);
};

export const useActionsFactory = (type: string): (<T>(target: T) => Array<Action>) => {
	const factories = useIntegrationsStore((s) => s.actions[type]);
	return useCallback((target) => buildIntegrationActions(factories, target), [factories]);
};

export const useAction = <T,>(
	type: string,
	id: string,
	target?: T
): [Action | undefined, boolean] => {
	const factory = useIntegrationsStore((s) => s.actions[type][id]);
	return useMemo(() => buildIntegrationAction(factory, target), [factory, target]);
};

export const useActionFactory = <T,>(
	type: string,
	id: string
): [ActionFactory<T> | undefined, boolean] => {
	const factory = useIntegrationsStore((s) => s.actions[type][id]);
	return [factory, !!factory];
};
