/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React from 'react';

import { compact, map } from 'lodash';

import type { IntegrationsState } from './store';
import AppContextProvider from '../../boot/app/app-context-provider';
import type { Action } from '../../types/integrations';
import type { AnyFunction } from '../../utils/typeUtils';

export function buildIntegrationComponent(
	integration: IntegrationsState['components'][string]
): [React.FunctionComponent<Record<string, unknown>>, boolean] {
	if (integration) {
		const IntegrationComponent = (props: Record<string, unknown>): React.JSX.Element => (
			<AppContextProvider pkg={integration.app}>
				<integration.Item {...props} />
			</AppContextProvider>
		);
		return [IntegrationComponent, true];
	}
	return [(): null => null, false];
}

export function buildIntegrationFunction(
	integration: IntegrationsState['functions'][string]
): [AnyFunction, boolean] {
	return integration ? [integration, true] : [(): void => undefined, false];
}

export function buildIntegrationActions<TAction extends Action>(
	integration: IntegrationsState['actions'][string],
	context: unknown
): Array<TAction> {
	return compact(
		map(integration, (actionFactory) => {
			try {
				return actionFactory(context) as TAction;
			} catch (e) {
				// eslint-disable-next-line no-console
				console.error(e);
				return undefined;
			}
		})
	);
}

export function buildIntegrationAction(
	integration: IntegrationsState['actions'][string][string],
	target: unknown
): [Action | undefined, boolean] {
	try {
		return [integration?.(target), true];
	} catch (e) {
		return [undefined, false];
	}
}
