import produce from 'immer';
import create from 'zustand';
import { forEach } from 'lodash';
import { Component } from 'react';
import { ActionFactory, AnyFunction, IntegrationsState } from '../../../types';

export const useIntegrationsStore = create<IntegrationsState>((set) => ({
	actions: {},
	components: {},
	hooks: {},
	functions: {},
	registerActions: <T>(
		...items: Array<{ id: string; action: ActionFactory<T>; type: string }>
	): void =>
		set(
			produce((state) => {
				forEach(items, ({ id, action, type }) => {
					if (!state.actions[type]) state.actions[type] = {};
					state.actions[type][id] = action;
				});
			})
		),
	registerComponents:
		(app: string) =>
		(...items: Array<{ id: string; component: Component }>): void =>
			set(
				produce((state) => {
					forEach(items, ({ id, component }) => {
						state.components[id] = { app, item: component };
					});
				})
			),
	registerHooks: (...items: Array<{ id: string; hook: AnyFunction }>): void =>
		set(
			produce((state) => {
				forEach(items, ({ id, hook }) => {
					state.hooks[id] = hook;
				});
			})
		),
	registerFunctions: (...items: Array<{ id: string; fn: AnyFunction }>): void =>
		set(
			produce((state) => {
				forEach(items, ({ id, fn }) => {
					state.functions[id] = fn;
				});
			})
		)
}));
