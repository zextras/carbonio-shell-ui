/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Component } from 'react';

export type IntegrationsState = {
	actions: ActionMap;
	components: ComponentMap;
	hooks: HookMap;
	functions: FunctionMap;
	registerActions: (
		...items: Array<{ id: string; action: ActionFactory<unknown>; type: string }>
	) => void;
	registerComponents: (
		app: string
	) => (...items: Array<{ id: string; component: Component }>) => void;
	registerHooks: (...items: Array<{ id: string; hook: AnyFunction }>) => void;
	registerFunctions: (...items: Array<{ id: string; fn: AnyFunction }>) => void;
};

export type Action = {
	id: string;
	label: string;
	icon: string;
	click: (ev: unknown) => void;
	type: string;
	primary?: boolean;
	group?: string;
	disabled?: boolean;
	[key: string]: unknown;
};

export type ActionFactory<T> = (target: T) => Action;
export type CombinedActionFactory<T> = (target: T) => Array<Action>;

export type ActionMap = Record<string, Record<string, ActionFactory<unknown>>>;
export type ComponentMap = Record<string, { app: string; item: Component }>;
export type HookMap = Record<string, AnyFunction>;
export type FunctionMap = Record<string, AnyFunction>;

export type AnyFunction = (...args: unknown[]) => unknown;
