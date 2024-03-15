/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import type { ComponentType } from 'react';

import { produce } from 'immer';
import { forEach, includes, omit } from 'lodash';
import { create } from 'zustand';

import Composer from './composer';
import { SHELL_APP_ID } from '../../constants';
import type { ActionFactory } from '../../types/integrations';
import type { AnyFunction } from '../../utils/typeUtils';

type Action<TTarget = unknown> = ActionFactory<TTarget>;
type Component<TProps extends Record<string, unknown> = Record<string, unknown>> =
	ComponentType<TProps>;

export type IntegrationsState = {
	actions: { [type: string]: { [id: string]: Action } };
	components: { [id: string]: { app: string; Item: Component } };
	functions: { [id: string]: AnyFunction };
};

export type IntegrationActions = {
	removeActions: (...ids: Array<string>) => void;
	registerActions: (...items: Array<{ id: string; action: Action; type: string }>) => void;
	removeComponents: (...ids: Array<string>) => void;
	registerComponents: (
		app: string
	) => <TProps extends Record<string, unknown>>(
		...items: Array<{ id: string; component: Component<TProps> }>
	) => void;
	removeFunctions: (...ids: Array<string>) => void;
	registerFunctions: (...items: Array<{ id: string; fn: AnyFunction }>) => void;
};

const initialState: IntegrationsState = {
	actions: {},
	components: {
		composer: {
			Item: Composer,
			app: SHELL_APP_ID
		}
	},
	functions: {}
};
// extra currying as suggested in https://github.com/pmndrs/zustand/blob/main/docs/guides/typescript.md#basic-usage
export const useIntegrationsStore = create<IntegrationsState & IntegrationActions>()((set) => ({
	...initialState,
	registerActions: (...items): void =>
		set(
			produce<IntegrationsState>((state) => {
				forEach(items, ({ id, action, type }) => {
					if (!state.actions[type]) state.actions[type] = {};
					state.actions[type][id] = action;
				});
			})
		),
	registerComponents:
		(app) =>
		(...items): void =>
			set(
				produce<IntegrationsState>((state) => {
					forEach(items, ({ id, component }) => {
						state.components[id] = { app, Item: component as Component };
					});
				})
			),
	registerFunctions: (...items): void =>
		set(
			produce<IntegrationsState>((state) => {
				forEach(items, ({ id, fn }) => {
					state.functions[id] = fn;
				});
			})
		),
	removeActions: (...ids): void =>
		set(
			produce<IntegrationsState>((state) => {
				forEach(state.actions, (actionTypeMap, type) => {
					forEach(actionTypeMap, (actionFactory, actionFactoryId) => {
						if (includes(ids, actionFactoryId)) {
							delete state.actions[type][actionFactoryId];
						}
					});
				});
			})
		),
	removeComponents: (...ids): void =>
		set((s) => ({
			...s,
			components: omit(s.components, ids)
		})),
	removeFunctions: (...ids): void =>
		set((s) => ({
			...s,
			functions: omit(s.functions, ids)
		}))
}));
