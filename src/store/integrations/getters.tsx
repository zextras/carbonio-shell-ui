/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import type React from 'react';

import { useIntegrationsStore } from './store';
import {
	buildIntegrationAction,
	buildIntegrationActions,
	buildIntegrationComponent
} from './utils';
import type { Action } from '../../types/integrations';
import type { AnyFunction } from '../../utils/typeUtils';

export const getIntegratedFunction = (id: string): [AnyFunction, boolean] => {
	const integration = useIntegrationsStore.getState().functions?.[id];
	return integration ? [integration, true] : [(): void => undefined, false];
};

export const getIntegratedComponent = (
	id: string
): [React.FunctionComponent<Record<string, unknown>>, boolean] => {
	const integration = useIntegrationsStore.getState().components?.[id];
	return buildIntegrationComponent(integration);
};

export const getActions = <TContext, TAction extends Action = Action>(
	context: TContext,
	type: string
): Array<TAction> => {
	const factories = useIntegrationsStore.getState().actions[type];
	return buildIntegrationActions(factories, context);
};

export const getAction = <T,>(
	type: string,
	id: string,
	target?: T
): [Action | undefined, boolean] => {
	const factory = useIntegrationsStore.getState().actions[type]?.[id];
	return buildIntegrationAction(factory, target);
};
