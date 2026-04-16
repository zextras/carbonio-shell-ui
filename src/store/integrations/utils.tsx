/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { compact, map } from 'lodash';

import type { IntegrationsState } from './store';
import { AppContextProvider } from '../../boot/app/app-context-provider';
import type { Action } from '../../types/integrations';
import type { AnyFunction } from '../../utils/typeUtils';

export function buildIntegrationComponent<TComponent extends React.ComponentType>(
	integration: IntegrationsState['components'][string]
): [TComponent, boolean] {
	if (integration) {
		const IntegrationComponent = (
			props: React.ComponentPropsWithRef<TComponent>
		): React.JSX.Element => (
			<AppContextProvider pkg={integration.app}>
				<integration.Item {...props} />
			</AppContextProvider>
		);
		return [IntegrationComponent as TComponent, true];
	}
	return [((): null => null) as unknown as TComponent, false];
}

export function buildIntegrationFunction<TFunction extends AnyFunction>(
	integration: IntegrationsState['functions'][string]
): [TFunction, boolean] {
	return integration
		? [integration as TFunction, true]
		: [((): void => undefined) as TFunction, false];
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
		if (!integration) {
			return [undefined, false];
		}
		return [integration(target), true];
	} catch (e) {
		return [undefined, false];
	}
}
