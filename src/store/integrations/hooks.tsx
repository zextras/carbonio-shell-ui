/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import type React from 'react';
import { useMemo } from 'react';

import { useIntegrationsStore } from './store';
import {
	buildIntegrationAction,
	buildIntegrationActions,
	buildIntegrationComponent,
	buildIntegrationFunction
} from './utils';
import type { Action } from '../../types/integrations';
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

export const useActions = <TContext, TAction extends Action = Action>(
	context: TContext,
	type: string
): Array<TAction> => {
	const factories = useIntegrationsStore((s) => s.actions[type]);
	return useMemo(() => buildIntegrationActions(factories, context), [factories, context]);
};

export const useAction = <T,>(
	type: string,
	id: string,
	target?: T
): [Action | undefined, boolean] => {
	const factory = useIntegrationsStore((s) => s.actions[type][id]);
	return useMemo(() => buildIntegrationAction(factory, target), [factory, target]);
};
