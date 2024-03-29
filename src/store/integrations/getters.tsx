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
import type { Action, ActionFactory } from '../../types/integrations';
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

export const getActions = <T,>(target: T, type: string): Array<Action> => {
	const factories = useIntegrationsStore.getState().actions[type];
	return buildIntegrationActions(factories, target);
};

export const getActionsFactory = (type: string): (<T>(target: T) => Array<Action>) => {
	const factories = useIntegrationsStore.getState().actions[type];
	return <T,>(target: T): Array<Action> => buildIntegrationActions(factories, target);
};

export const getAction = <T,>(
	type: string,
	id: string,
	target?: T
): [Action | undefined, boolean] => {
	const factory = useIntegrationsStore.getState().actions[type]?.[id];
	return buildIntegrationAction(factory, target);
};

export const getActionFactory = <T,>(
	type: string,
	id: string
): [ActionFactory<T> | undefined, boolean] => {
	const factory = useIntegrationsStore.getState().actions[type]?.[id];
	return [factory, !!factory];
};
